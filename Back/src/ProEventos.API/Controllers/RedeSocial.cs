﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RedeSocialController : ControllerBase
    {
        private readonly IRedeSocialService _redeSocialService;
        private readonly IEventoService _eventoService;
        private readonly IPalestranteService _palestranteService;

        public RedeSocialController(IRedeSocialService redeSocialService, IEventoService eventoService, IPalestranteService palestranteService)
        {
            _redeSocialService = redeSocialService;
            _eventoService = eventoService;
            _palestranteService = palestranteService;
        }

        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetByEvento(int eventoId)
        {
            try
            {
                if (!await AutorEvento(eventoId)) return Unauthorized();
                
                var redeSocial = await _redeSocialService.GetAllByEventoIdAsync(eventoId);
                if (redeSocial == null) return NoContent();                

                return Ok(redeSocial);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar Rede Social do Evento. Erro: {ex.Message}");
            }
        }

        [HttpGet("palestrante")]
        public async Task<IActionResult> GetByPalestrante()
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if (palestrante == null) return Unauthorized();
                
                var redeSocial = await _redeSocialService.GetAllByPalestranteIdAsync(palestrante.Id);
                if (redeSocial == null) return NoContent();                

                return Ok(redeSocial);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar Rede Social do Palestrante. Erro: {ex.Message}");
            }
        }

        [HttpPut("evento/{eventoId}")]
        public async Task<IActionResult> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                if (!await AutorEvento(eventoId)) return Unauthorized();

                var redeSocial = await _redeSocialService.SaveByEvento(eventoId, models);
                if (redeSocial == null) return NoContent();

                return Ok(redeSocial);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar salvar Rede Social do Evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("palestrante")]
        public async Task<IActionResult> SaveByPalestrante(RedeSocialDto[] models)
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if (palestrante == null) return Unauthorized();

                var redeSocial = await _redeSocialService.SaveByPalestrante(palestrante.Id, models);
                if (redeSocial == null) return NoContent();

                return Ok(redeSocial);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar salvar Rede Social do Palestrante. Erro: {ex.Message}");
            }
        }

        [HttpDelete("evento/{eventoId}/{redeSocialId}")]
        public async Task<IActionResult> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                if (!await AutorEvento(eventoId)) return Unauthorized();

                var redeSocial = await _redeSocialService.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) return NoContent();

                return await _redeSocialService.DeleteByEvento(eventoId, redeSocialId)
                        ? Ok(new { message = "Rede Social Deletada" })
                        : throw new Exception("Ocorreu um problema não especifico ao tentar deletar Rede Social do Evento.");
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar Rede Social do Evento. Erro: {ex.Message}");
            }
        }

        [HttpDelete("palestrante/{redeSocialId}")]
        public async Task<IActionResult> DeleteByPalestrante(int redeSocialId)
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if (palestrante == null) return Unauthorized();
                
                var redeSocial = await _redeSocialService.GetRedeSocialPalestranteByIdsAsync(palestrante.Id, redeSocialId);
                if (redeSocial == null) return NoContent();

                return await _redeSocialService.DeleteByPalestrante(palestrante.Id, redeSocialId)
                        ? Ok(new { message = "Rede Social Deletada" })
                        : throw new Exception("Ocorreu um problema não especifico ao tentar deletar Rede Social do Palestrante.");
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar Rede Social do Palestrante. Erro: {ex.Message}");
            }
        }

        [NonAction]
        private async Task<bool> AutorEvento(int eventoId)
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, false);
            if (evento == null) return false;

            return true;
        }
    }
}
