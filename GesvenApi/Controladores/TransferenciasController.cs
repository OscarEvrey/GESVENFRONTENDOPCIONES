using GesvenApi.Datos;
using GesvenApi.DTOs;
using GesvenApi.Modelos.Inventario;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para transferencias entre instalaciones.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransferenciasController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<TransferenciasController> _logger;

    public TransferenciasController(GesvenDbContext contexto, ILogger<TransferenciasController> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/transferencias
    /// Lista transferencias.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<TransferenciaRespuestaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<TransferenciaRespuestaDto>>>> ObtenerTransferencias([FromQuery] int? instalacionId = null, [FromQuery] string? estatus = null)
    {
        var query = _contexto.Transferencias
            .Include(t => t.InstalacionOrigen)
            .Include(t => t.InstalacionDestino)
            .Include(t => t.Detalles)
                .ThenInclude(d => d.Producto)
            .AsQueryable();

        if (instalacionId.HasValue)
        {
            query = query.Where(t => t.InstalacionOrigenId == instalacionId.Value || t.InstalacionDestinoId == instalacionId.Value);
        }

        if (!string.IsNullOrWhiteSpace(estatus))
        {
            query = query.Where(t => t.Estatus == estatus);
        }

        var transferencias = await query
            .OrderByDescending(t => t.FechaEnvio)
            .Select(t => new TransferenciaRespuestaDto
            {
                TransferenciaId = t.TransferenciaId,
                Folio = t.Folio,
                InstalacionOrigenId = t.InstalacionOrigenId,
                InstalacionOrigenNombre = t.InstalacionOrigen != null ? t.InstalacionOrigen.Nombre : string.Empty,
                InstalacionDestinoId = t.InstalacionDestinoId,
                InstalacionDestinoNombre = t.InstalacionDestino != null ? t.InstalacionDestino.Nombre : string.Empty,
                FechaEnvio = t.FechaEnvio,
                FechaRecepcion = t.FechaRecepcion,
                Estatus = t.Estatus,
                Comentarios = t.Comentarios,
                Detalles = t.Detalles.Select(d => new DetalleTransferenciaRespuestaDto
                {
                    DetalleId = d.DetalleId,
                    ProductoId = d.ProductoId,
                    ProductoNombre = d.Producto != null ? d.Producto.Nombre : string.Empty,
                    CantidadEnviada = d.CantidadEnviada,
                    CantidadRecibida = d.CantidadRecibida
                }).ToList()
            })
            .ToListAsync();

        return Ok(new RespuestaApi<List<TransferenciaRespuestaDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {transferencias.Count} transferencias",
            Datos = transferencias
        });
    }

    /// <summary>
    /// GET /api/transferencias/{id}
    /// Obtiene una transferencia.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<TransferenciaRespuestaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<TransferenciaRespuestaDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<TransferenciaRespuestaDto>>> ObtenerTransferencia(int id)
    {
        var transferencia = await _contexto.Transferencias
            .Include(t => t.InstalacionOrigen)
            .Include(t => t.InstalacionDestino)
            .Include(t => t.Detalles)
                .ThenInclude(d => d.Producto)
            .FirstOrDefaultAsync(t => t.TransferenciaId == id);

        if (transferencia is null)
        {
            return NotFound(new RespuestaApi<TransferenciaRespuestaDto>
            {
                Exito = false,
                Mensaje = "Transferencia no encontrada"
            });
        }

        var dto = new TransferenciaRespuestaDto
        {
            TransferenciaId = transferencia.TransferenciaId,
            Folio = transferencia.Folio,
            InstalacionOrigenId = transferencia.InstalacionOrigenId,
            InstalacionOrigenNombre = transferencia.InstalacionOrigen?.Nombre ?? string.Empty,
            InstalacionDestinoId = transferencia.InstalacionDestinoId,
            InstalacionDestinoNombre = transferencia.InstalacionDestino?.Nombre ?? string.Empty,
            FechaEnvio = transferencia.FechaEnvio,
            FechaRecepcion = transferencia.FechaRecepcion,
            Estatus = transferencia.Estatus,
            Comentarios = transferencia.Comentarios,
            Detalles = transferencia.Detalles.Select(d => new DetalleTransferenciaRespuestaDto
            {
                DetalleId = d.DetalleId,
                ProductoId = d.ProductoId,
                ProductoNombre = d.Producto?.Nombre ?? string.Empty,
                CantidadEnviada = d.CantidadEnviada,
                CantidadRecibida = d.CantidadRecibida
            }).ToList()
        };

        return Ok(new RespuestaApi<TransferenciaRespuestaDto>
        {
            Exito = true,
            Mensaje = "Transferencia obtenida",
            Datos = dto
        });
    }

    /// <summary>
    /// POST /api/transferencias
    /// Crea una transferencia y descuenta inventario del origen.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<TransferenciaRespuestaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<TransferenciaRespuestaDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespuestaApi<TransferenciaRespuestaDto>>> CrearTransferencia([FromBody] CrearTransferenciaDto dto)
    {
        if (dto.Lineas.Count == 0)
        {
            return BadRequest(new RespuestaApi<TransferenciaRespuestaDto>
            {
                Exito = false,
                Mensaje = "Debe indicar al menos una línea"
            });
        }

        if (dto.InstalacionOrigenId == dto.InstalacionDestinoId)
        {
            return BadRequest(new RespuestaApi<TransferenciaRespuestaDto>
            {
                Exito = false,
                Mensaje = "La instalación origen y destino no pueden ser iguales"
            });
        }

        var origenExiste = await _contexto.Instalaciones.AnyAsync(i => i.InstalacionId == dto.InstalacionOrigenId);
        var destinoExiste = await _contexto.Instalaciones.AnyAsync(i => i.InstalacionId == dto.InstalacionDestinoId);
        if (!origenExiste || !destinoExiste)
        {
            return BadRequest(new RespuestaApi<TransferenciaRespuestaDto>
            {
                Exito = false,
                Mensaje = "Instalación origen o destino no existe"
            });
        }

        // Validar stock en origen
        foreach (var linea in dto.Lineas)
        {
            var producto = await _contexto.Productos.FirstOrDefaultAsync(p => p.ProductoId == linea.ProductoId && p.InstalacionId == dto.InstalacionOrigenId);
            if (producto is null)
            {
                return BadRequest(new RespuestaApi<TransferenciaRespuestaDto>
                {
                    Exito = false,
                    Mensaje = $"El producto {linea.ProductoId} no existe en la instalación origen"
                });
            }

            var saldo = await ObtenerSaldoActual(producto.ProductoId, dto.InstalacionOrigenId);
            if (saldo < linea.Cantidad)
            {
                return BadRequest(new RespuestaApi<TransferenciaRespuestaDto>
                {
                    Exito = false,
                    Mensaje = $"Stock insuficiente para {producto.Nombre}. Disponible: {saldo}"
                });
            }
        }

        var transferencia = new Transferencia
        {
            InstalacionOrigenId = dto.InstalacionOrigenId,
            InstalacionDestinoId = dto.InstalacionDestinoId,
            FechaEnvio = DateTime.UtcNow,
            Estatus = "EnTransito",
            Comentarios = dto.Comentarios
        };

        foreach (var linea in dto.Lineas)
        {
            transferencia.Detalles.Add(new TransferenciaDetalle
            {
                ProductoId = linea.ProductoId,
                CantidadEnviada = linea.Cantidad,
                CantidadRecibida = 0
            });
        }

        _contexto.Transferencias.Add(transferencia);
        await _contexto.SaveChangesAsync();

        transferencia.Folio = $"TRF-{DateTime.UtcNow:yyyyMMdd}-{transferencia.TransferenciaId:0000}";
        await _contexto.SaveChangesAsync();

        // Registrar salidas en origen
        foreach (var detalle in transferencia.Detalles)
        {
            var saldoAnterior = await ObtenerSaldoActual(detalle.ProductoId, transferencia.InstalacionOrigenId);
            var saldoFinal = saldoAnterior - detalle.CantidadEnviada;

            _contexto.Movimientos.Add(new Movimiento
            {
                InstalacionId = transferencia.InstalacionOrigenId,
                ProductoId = detalle.ProductoId,
                TipoMovimiento = TipoMovimiento.Salida,
                Cantidad = detalle.CantidadEnviada,
                SaldoFinal = saldoFinal,
                CreadoEn = DateTime.UtcNow,
                CreadoPor = UsuarioSistemaId
            });
        }

        await _contexto.SaveChangesAsync();

        var respuesta = await ConstruirRespuesta(transferencia.TransferenciaId);
        return Ok(new RespuestaApi<TransferenciaRespuestaDto>
        {
            Exito = true,
            Mensaje = "Transferencia creada",
            Datos = respuesta
        });
    }

    /// <summary>
    /// POST /api/transferencias/{id}/recibir
    /// Confirma recepción en destino y genera movimientos de entrada.
    /// </summary>
    [HttpPost("{id}/recibir")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> RecibirTransferencia(int id, [FromBody] RecibirTransferenciaDto dto)
    {
        var transferencia = await _contexto.Transferencias
            .Include(t => t.Detalles)
            .FirstOrDefaultAsync(t => t.TransferenciaId == id);

        if (transferencia is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Transferencia no encontrada"
            });
        }

        if (transferencia.Estatus == "Cancelada")
        {
            return BadRequest(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "La transferencia está cancelada"
            });
        }

        foreach (var linea in dto.Lineas)
        {
            var detalle = transferencia.Detalles.FirstOrDefault(d => d.DetalleId == linea.DetalleId);
            if (detalle is null)
            {
                return BadRequest(new RespuestaApi<bool>
                {
                    Exito = false,
                    Mensaje = $"El detalle {linea.DetalleId} no pertenece a la transferencia"
                });
            }

            if (linea.CantidadRecibida < 0)
            {
                return BadRequest(new RespuestaApi<bool>
                {
                    Exito = false,
                    Mensaje = "Cantidad recibida inválida"
                });
            }

            detalle.CantidadRecibida = linea.CantidadRecibida;

            var saldoAnterior = await ObtenerSaldoActual(detalle.ProductoId, transferencia.InstalacionDestinoId);
            var saldoFinal = saldoAnterior + linea.CantidadRecibida;

            _contexto.Movimientos.Add(new Movimiento
            {
                InstalacionId = transferencia.InstalacionDestinoId,
                ProductoId = detalle.ProductoId,
                TipoMovimiento = TipoMovimiento.Entrada,
                Cantidad = linea.CantidadRecibida,
                SaldoFinal = saldoFinal,
                CreadoEn = DateTime.UtcNow,
                CreadoPor = UsuarioSistemaId
            });
        }

        transferencia.Estatus = "Recibida";
        transferencia.FechaRecepcion = DateTime.UtcNow;
        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = "Transferencia recibida",
            Datos = true
        });
    }

    /// <summary>
    /// POST /api/transferencias/{id}/cancelar
    /// Cancela una transferencia.
    /// </summary>
    [HttpPost("{id}/cancelar")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> CancelarTransferencia(int id)
    {
        var transferencia = await _contexto.Transferencias.FindAsync(id);
        if (transferencia is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Transferencia no encontrada"
            });
        }

        transferencia.Estatus = "Cancelada";
        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = "Transferencia cancelada",
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

    private async Task<TransferenciaRespuestaDto> ConstruirRespuesta(int transferenciaId)
    {
        var t = await _contexto.Transferencias
            .Include(x => x.InstalacionOrigen)
            .Include(x => x.InstalacionDestino)
            .Include(x => x.Detalles)
                .ThenInclude(d => d.Producto)
            .FirstAsync(x => x.TransferenciaId == transferenciaId);

        return new TransferenciaRespuestaDto
        {
            TransferenciaId = t.TransferenciaId,
            Folio = t.Folio,
            InstalacionOrigenId = t.InstalacionOrigenId,
            InstalacionOrigenNombre = t.InstalacionOrigen?.Nombre ?? string.Empty,
            InstalacionDestinoId = t.InstalacionDestinoId,
            InstalacionDestinoNombre = t.InstalacionDestino?.Nombre ?? string.Empty,
            FechaEnvio = t.FechaEnvio,
            FechaRecepcion = t.FechaRecepcion,
            Estatus = t.Estatus,
            Comentarios = t.Comentarios,
            Detalles = t.Detalles.Select(d => new DetalleTransferenciaRespuestaDto
            {
                DetalleId = d.DetalleId,
                ProductoId = d.ProductoId,
                ProductoNombre = d.Producto?.Nombre ?? string.Empty,
                CantidadEnviada = d.CantidadEnviada,
                CantidadRecibida = d.CantidadRecibida
            }).ToList()
        };
    }
}