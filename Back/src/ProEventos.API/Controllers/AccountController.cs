using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.API.Helpers;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IUtil _util;
        private readonly string _destino = "Perfil";

        public AccountController(IAccountService accountService, ITokenService tokenService, IUtil util)
        {
            _accountService = accountService;
            _tokenService = tokenService;
            _util = util;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var userName = User.GetUserName();
                var user = await _accountService.GetUserByUserNameAsync(userName);
                return Ok(user);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar Recuperar Usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                if (await _accountService.UserExist(userDto.UserName))
                    return BadRequest("Usuário já existe");

                var user = await _accountService.CrateAccountAsync(userDto);
                if (user != null)
                    return Ok(new
                    {
                        userName = user.UserName,
                        firstName = user.FirstName,
                        token = _tokenService.CreateToken(user).Result
                    });

                return BadRequest("Usupario não criado, tente novamente mais tarde.");
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar Registrar Usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLogin)
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(userLogin.UserName);
                if (user == null) return Unauthorized("Usuário ou Senha Inválidos.");

                var result = await _accountService.CheckUserPasswordAsync(user, userLogin.Password);
                if (!result.Succeeded) return Unauthorized("Senha Inválida.");

                return Ok(new
                {
                    userName = user.UserName,
                    firstName = user.FirstName,
                    token = _tokenService.CreateToken(user).Result
                });
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar realizar Login. Erro: {ex.Message}");
            }
        }

        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {
                if (userUpdateDto.UserName != User.GetUserName())
                    return Unauthorized("Usuário Inválido");

                var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
                if (user == null) return Unauthorized("Usuário Inválido.");

                var userReturn = await _accountService.UpdateAccount(userUpdateDto);
                if (userReturn == null) return NoContent();

                return Ok(new
                {
                    userName = userReturn.UserName,
                    firstName = userReturn.FirstName,
                    token = _tokenService.CreateToken(userReturn).Result
                });
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar Atualizar Usuário. Erro: {ex.Message}");
            }
        }
        
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
                if (user == null) return NoContent();

                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                    _util.DeleteImage(user.ImageURL, _destino);
                    user.ImageURL = await _util.SaveImage(file, _destino);
                }

                var userRetorno = await _accountService.UpdateAccount(user);

                return Ok(userRetorno);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar realizar upload de foto do Usuário. Erro: {ex.Message}");
            }
        }
    }
}