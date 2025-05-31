using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contratos
{
    public interface IRedeSocialService
    {
        Task<RedeSocialDto[]> SaveByEvento(int id, RedeSocialDto[] models);
        Task<bool> DeleteByEvento(int eventoId, int redeSocialId);
        Task<RedeSocialDto[]> SaveByPalestrante(int id, RedeSocialDto[] models);
        Task<bool> DeleteByPalestrante(int palestranteId, int redeSocialId);
        Task<RedeSocialDto[]> GetAllByEventoIdAsync(int id);
        Task<RedeSocialDto[]> GetAllByPalestranteIdAsync(int id);
        Task<RedeSocialDto[]> GetRedeSocialEventoByIdsAsync(int id);
        Task<RedeSocialDto[]> GetRedeSocialPalestranteByIdsAsync(int id);
        
    }
}