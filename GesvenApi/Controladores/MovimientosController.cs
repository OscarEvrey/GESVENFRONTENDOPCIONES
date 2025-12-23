using GesvenApi.Datos;
using GesvenApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador de consulta de movimientos (Kardex).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MovimientosController : ControllerBase
{
    private readonly GesvenDbContext _contexto;

    public MovimientosController(GesvenDbContext contexto)
    {
        _contexto = contexto;
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
            .Select(m => new MovimientoDto
            {
                MovimientoId = m.MovimientoId,
                InstalacionId = m.InstalacionId,
                ProductoId = m.ProductoId,
                ProductoNombre = m.Producto != null ? m.Producto.Nombre : string.Empty,
                TipoMovimiento = m.TipoMovimiento,
                Cantidad = m.Cantidad,
                SaldoFinal = m.SaldoFinal,
                CostoUnitario = m.CostoUnitario,
                Lote = m.Lote,
                FechaCaducidad = m.FechaCaducidad,
                CreadoEn = m.CreadoEn
            })
            .ToListAsync();

        return Ok(new RespuestaApi<List<MovimientoDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {movimientos.Count} movimientos",
            Datos = movimientos
        });
    }
}