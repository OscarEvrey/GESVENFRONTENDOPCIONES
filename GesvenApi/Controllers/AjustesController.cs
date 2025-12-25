using GesvenApi.Data;
using GesvenApi.Models.Dtos.Requests;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Models.Inventario;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controllers;

/// <summary>
/// Controlador para ajustes de inventario.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AjustesController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<AjustesController> _logger;

    public AjustesController(GesvenDbContext contexto, ILogger<AjustesController> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/ajustes
    /// Lista ajustes por instalación.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<AjusteRespuestaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<AjusteRespuestaDto>>>> ObtenerAjustes([FromQuery] int? instalacionId = null)
    {
        var query = _contexto.AjustesInventario
            .Include(a => a.Instalacion)
            .Include(a => a.Producto)
            .AsQueryable();

        if (instalacionId.HasValue)
        {
            query = query.Where(a => a.InstalacionId == instalacionId.Value);
        }

        var ajustes = await query
            .OrderByDescending(a => a.FechaAjuste)
            .Select(a => new AjusteRespuestaDto
            {
                AjusteId = a.AjusteId,
                InstalacionId = a.InstalacionId,
                InstalacionNombre = a.Instalacion != null ? a.Instalacion.Nombre : string.Empty,
                ProductoId = a.ProductoId,
                ProductoNombre = a.Producto != null ? a.Producto.Nombre : string.Empty,
                TipoAjuste = a.TipoAjuste,
                Cantidad = a.Cantidad,
                StockAnterior = a.StockAnterior,
                StockNuevo = a.StockNuevo,
                Motivo = a.Motivo,
                Observaciones = a.Observaciones,
                FechaAjuste = a.FechaAjuste
            })
            .ToListAsync();

        return Ok(new RespuestaApi<List<AjusteRespuestaDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {ajustes.Count} ajustes",
            Datos = ajustes
        });
    }

    /// <summary>
    /// POST /api/ajustes
    /// Crea un ajuste y registra el movimiento.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<AjusteRespuestaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<AjusteRespuestaDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespuestaApi<AjusteRespuestaDto>>> CrearAjuste([FromBody] CrearAjusteDto dto)
    {
        if (dto.Cantidad <= 0)
        {
            return BadRequest(new RespuestaApi<AjusteRespuestaDto>
            {
                Exito = false,
                Mensaje = "La cantidad debe ser mayor a cero"
            });
        }

        var producto = await _contexto.Productos.FirstOrDefaultAsync(p => p.ProductoId == dto.ProductoId && p.InstalacionId == dto.InstalacionId);
        if (producto is null)
        {
            return BadRequest(new RespuestaApi<AjusteRespuestaDto>
            {
                Exito = false,
                Mensaje = "El producto no existe en la instalación"
            });
        }

        var saldoAnterior = await ObtenerSaldoActual(dto.ProductoId, dto.InstalacionId);
        var saldoNuevo = dto.TipoAjuste == TipoMovimiento.Entrada
            ? saldoAnterior + dto.Cantidad
            : saldoAnterior - dto.Cantidad;

        if (saldoNuevo < 0)
        {
            return BadRequest(new RespuestaApi<AjusteRespuestaDto>
            {
                Exito = false,
                Mensaje = "El ajuste provocaría saldo negativo"
            });
        }

        var ajuste = new AjusteInventario
        {
            InstalacionId = dto.InstalacionId,
            ProductoId = dto.ProductoId,
            TipoAjuste = dto.TipoAjuste,
            Cantidad = dto.Cantidad,
            StockAnterior = saldoAnterior,
            StockNuevo = saldoNuevo,
            Motivo = dto.Motivo,
            Observaciones = dto.Observaciones,
            FechaAjuste = DateTime.UtcNow,
            CreadoEn = DateTime.UtcNow,
            CreadoPor = UsuarioSistemaId,
            ActualizadoEn = DateTime.UtcNow,
            ActualizadoPor = UsuarioSistemaId
        };

        _contexto.AjustesInventario.Add(ajuste);

        _contexto.Movimientos.Add(new Movimiento
        {
            InstalacionId = dto.InstalacionId,
            ProductoId = dto.ProductoId,
            TipoMovimiento = dto.TipoAjuste,
            Cantidad = dto.Cantidad,
            SaldoFinal = saldoNuevo,
            CreadoEn = DateTime.UtcNow,
            CreadoPor = UsuarioSistemaId
        });

        await _contexto.SaveChangesAsync();

        var respuesta = new AjusteRespuestaDto
        {
            AjusteId = ajuste.AjusteId,
            InstalacionId = ajuste.InstalacionId,
            InstalacionNombre = string.Empty,
            ProductoId = ajuste.ProductoId,
            ProductoNombre = producto.Nombre,
            TipoAjuste = ajuste.TipoAjuste,
            Cantidad = ajuste.Cantidad,
            StockAnterior = ajuste.StockAnterior,
            StockNuevo = ajuste.StockNuevo,
            Motivo = ajuste.Motivo,
            Observaciones = ajuste.Observaciones,
            FechaAjuste = ajuste.FechaAjuste
        };

        return Ok(new RespuestaApi<AjusteRespuestaDto>
        {
            Exito = true,
            Mensaje = "Ajuste registrado",
            Datos = respuesta
        });
    }

    private async Task<decimal> ObtenerSaldoActual(int productoId, int instalacionId)
    {
        var ultimo = await _contexto.Movimientos
            .Where(m => m.ProductoId == productoId && m.InstalacionId == instalacionId)
            .OrderByDescending(m => m.MovimientoId)
            .FirstOrDefaultAsync();

        return ultimo?.SaldoFinal ?? 0;
    }
}

