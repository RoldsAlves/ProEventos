using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}