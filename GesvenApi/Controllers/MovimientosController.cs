using AutoMapper;
using AutoMapper.QueryableExtensions;
using GesvenApi.Data;
using GesvenApi.Models.Dtos.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Controllers;

/// <summary>
/// Controlador de consulta de movimientos (Kardex).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MovimientosController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
        private readonly IMapper _mapper;

        public MovimientosController(GesvenDbContext contexto, IMapper mapper)
    {
        _contexto = contexto;
            _mapper = mapper;
    }

    /// <summary>
    /// GET /api/movimientos
    /// Consulta movimientos con filtros.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<MovimientoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<MovimientoDto>>>> ObtenerMovimientos([FromQuery] int? instalacionId = null, [FromQuery] int? productoId = null, [FromQuery] DateTime? desde = null, [FromQuery] DateTime? hasta = null)
    {
        var query = _contexto.Movimientos
            .Include(m => m.Producto)
            .AsQueryable();

        if (instalacionId.HasValue)
        {
            query = query.Where(m => m.InstalacionId == instalacionId.Value);
        }

        if (productoId.HasValue)
        {
            query = query.Where(m => m.ProductoId == productoId.Value);
        }

        if (desde.HasValue)
        {
            query = query.Where(m => m.CreadoEn >= desde.Value);
        }

        if (hasta.HasValue)
        {
            query = query.Where(m => m.CreadoEn <= hasta.Value);
        }

        var movimientos = await query
            .OrderByDescending(m => m.CreadoEn)
            .ProjectTo<MovimientoDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(new RespuestaApi<List<MovimientoDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {movimientos.Count} movimientos",
            Datos = movimientos
        });
    }
}

