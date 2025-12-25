using AutoMapper;
using AutoMapper.QueryableExtensions;
using GesvenApi.Data;
using GesvenApi.Models.Dtos.Requests;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Models.Inventario;
using GesvenApi.Models.Ventas;
using GesvenApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controllers;

/// <summary>
/// Controlador para gestión de ventas.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
        private readonly IMapper _mapper;
    private readonly ILogger<VentasController> _logger;
    private readonly IEstatusLookupService _estatusLookup;

    public VentasController(GesvenDbContext contexto, IMapper mapper, ILogger<VentasController> logger, IEstatusLookupService estatusLookup)
    {
        _contexto = contexto;
        _mapper = mapper;
        _logger = logger;
        _estatusLookup = estatusLookup;
    }

    /// <summary>
    /// GET /api/ventas
    /// Lista ventas con filtros opcionales.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<VentaRespuestaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<VentaRespuestaDto>>>> ObtenerVentas([FromQuery] int? instalacionId = null, [FromQuery] DateTime? desde = null, [FromQuery] DateTime? hasta = null)
    {
        var query = _contexto.Ventas
            .AsQueryable();

        if (instalacionId.HasValue)
        {
            query = query.Where(v => v.InstalacionId == instalacionId.Value);
        }

        if (desde.HasValue)
        {
            query = query.Where(v => v.FechaVenta >= desde.Value);
        }

        if (hasta.HasValue)
        {
            query = query.Where(v => v.FechaVenta <= hasta.Value);
        }

        var ventas = await query
            .OrderByDescending(v => v.FechaVenta)
            .ProjectTo<VentaRespuestaDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(new RespuestaApi<List<VentaRespuestaDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {ventas.Count} ventas",
            Datos = ventas
        });
    }

    /// <summary>
    /// GET /api/ventas/{id}
    /// Obtiene una venta.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<VentaRespuestaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<VentaRespuestaDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<VentaRespuestaDto>>> ObtenerVenta(int id)
    {
        var venta = await _contexto.Ventas
            .Where(v => v.VentaId == id)
            .ProjectTo<VentaRespuestaDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (venta is null)
        {
            return NotFound(new RespuestaApi<VentaRespuestaDto>
            {
                Exito = false,
                Mensaje = "Venta no encontrada"
            });
        }

        return Ok(new RespuestaApi<VentaRespuestaDto>
        {
            Exito = true,
            Mensaje = "Venta obtenida",
            Datos = venta
        });
    }

    /// <summary>
    /// POST /api/ventas
    /// Crea una venta y descuenta inventario.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<VentaRespuestaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<VentaRespuestaDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespuestaApi<VentaRespuestaDto>>> CrearVenta([FromBody] CrearVentaDto dto)
    {
        if (dto.Lineas.Count == 0)
        {
            return BadRequest(new RespuestaApi<VentaRespuestaDto>
            {
                Exito = false,
                Mensaje = "Debe incluir al menos una línea"
            });
        }

        var instalacionExiste = await _contexto.Instalaciones.AnyAsync(i => i.InstalacionId == dto.InstalacionId);
        if (!instalacionExiste)
        {
            return BadRequest(new RespuestaApi<VentaRespuestaDto>
            {
                Exito = false,
                Mensaje = "La instalación no existe"
            });
        }

        var cliente = await _contexto.Clientes.FindAsync(dto.ClienteId);
        if (cliente is null)
        {
            return BadRequest(new RespuestaApi<VentaRespuestaDto>
            {
                Exito = false,
                Mensaje = "El cliente no existe"
            });
        }

        // Validar productos y stock
        foreach (var linea in dto.Lineas)
        {
            var producto = await _contexto.Productos.FirstOrDefaultAsync(p => p.ProductoId == linea.ProductoId && p.InstalacionId == dto.InstalacionId);
            if (producto is null)
            {
                return BadRequest(new RespuestaApi<VentaRespuestaDto>
                {
                    Exito = false,
                    Mensaje = $"El producto {linea.ProductoId} no existe en la instalación"
                });
            }

            if (!producto.EsInventariable)
            {
                return BadRequest(new RespuestaApi<VentaRespuestaDto>
                {
                    Exito = false,
                    Mensaje = $"El producto {producto.Nombre} no es inventariable"
                });
            }

            var saldo = await ObtenerSaldoActual(producto.ProductoId, dto.InstalacionId);
            if (saldo < linea.Cantidad)
            {
                return BadRequest(new RespuestaApi<VentaRespuestaDto>
                {
                    Exito = false,
                    Mensaje = $"Stock insuficiente para el producto {producto.Nombre}. Disponible: {saldo}"
                });
            }
        }

        var estatusPendiente = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Pendiente, "Ventas");

        var venta = new Venta
        {
            InstalacionId = dto.InstalacionId,
            ClienteId = dto.ClienteId,
            FechaVenta = DateTime.UtcNow,
            EstatusId = estatusPendiente,
            Comentarios = dto.Comentarios
        };

        foreach (var linea in dto.Lineas)
        {
            var subtotal = linea.Cantidad * linea.PrecioUnitario * (1 - (linea.Descuento / 100));
            venta.Detalles.Add(new VentaDetalle
            {
                ProductoId = linea.ProductoId,
                Cantidad = linea.Cantidad,
                PrecioUnitario = linea.PrecioUnitario,
                Descuento = linea.Descuento,
                Subtotal = subtotal
            });
            venta.MontoTotal += subtotal;
        }

        _contexto.Ventas.Add(venta);
        await _contexto.SaveChangesAsync();

        venta.Folio = $"VTA-{DateTime.UtcNow:yyyyMMdd}-{venta.VentaId:0000}";
        await _contexto.SaveChangesAsync();

        // Registrar movimientos de salida.
        foreach (var detalle in venta.Detalles)
        {
            var saldoAnterior = await ObtenerSaldoActual(detalle.ProductoId, venta.InstalacionId);
            var saldoFinal = saldoAnterior - detalle.Cantidad;

            _contexto.Movimientos.Add(new Movimiento
            {
                InstalacionId = venta.InstalacionId,
                ProductoId = detalle.ProductoId,
                TipoMovimiento = TipoMovimiento.Salida,
                Cantidad = detalle.Cantidad,
                SaldoFinal = saldoFinal,
                CostoUnitario = detalle.PrecioUnitario,
                CreadoEn = DateTime.UtcNow,
                CreadoPor = UsuarioSistemaId
            });
        }

        await _contexto.SaveChangesAsync();

        var respuesta = await ConstruirVentaRespuesta(venta.VentaId);
        return Ok(new RespuestaApi<VentaRespuestaDto>
        {
            Exito = true,
            Mensaje = "Venta creada",
            Datos = respuesta
        });
    }

    /// <summary>
    /// POST /api/ventas/{id}/cancelar
    /// Cancela una venta y registra estatus.
    /// </summary>
    [HttpPost("{id}/cancelar")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> CancelarVenta(int id, [FromBody] string? motivo)
    {
        var venta = await _contexto.Ventas.FindAsync(id);
        if (venta is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Venta no encontrada"
            });
        }

        venta.EstatusId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Rechazada, "Ventas");
        if (!string.IsNullOrWhiteSpace(motivo))
        {
            venta.Comentarios = $"{venta.Comentarios} | Cancelación: {motivo}".Trim();
        }

        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = "Venta cancelada",
            Datos = true
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

    private async Task<VentaRespuestaDto> ConstruirVentaRespuesta(int ventaId)
    {
        return await _contexto.Ventas
            .Where(v => v.VentaId == ventaId)
            .ProjectTo<VentaRespuestaDto>(_mapper.ConfigurationProvider)
            .FirstAsync();
    }
}

