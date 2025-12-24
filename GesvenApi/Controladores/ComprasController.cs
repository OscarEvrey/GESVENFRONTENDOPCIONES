using GesvenApi.Datos;
using GesvenApi.DTOs;
using GesvenApi.Modelos.Compras;
using GesvenApi.Modelos.Inventario;
using GesvenApi.Servicios;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestionar las compras y órdenes de compra.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ComprasController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<ComprasController> _logger;
    private readonly IEstatusLookupService _estatusLookup;

    /// <summary>
    /// Inicializa una nueva instancia del controlador de compras.
    /// </summary>
    /// <param name="contexto">El contexto de base de datos.</param>
    /// <param name="logger">El logger para registrar eventos.</param>
    public ComprasController(GesvenDbContext contexto, ILogger<ComprasController> logger, IEstatusLookupService estatusLookup)
    {
        _contexto = contexto;
        _logger = logger;
        _estatusLookup = estatusLookup;
    }

    /// <summary>
    /// GET /api/compras/pendientes
    /// Lista órdenes de compra pendientes de aprobación.
    /// </summary>
    [HttpGet("pendientes")]
    [ProducesResponseType(typeof(RespuestaApi<List<OrdenCompraRespuestaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<OrdenCompraRespuestaDto>>>> ObtenerPendientes([FromQuery] int? instalacionId = null)
    {
        var estatusPendienteId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Pendiente, "Compras");

        var query = _contexto.OrdenesCompra
            .Include(o => o.Instalacion)
            .Include(o => o.Proveedor)
            .Include(o => o.Estatus)
            .Include(o => o.Detalles)
            .Where(o => o.EstatusId == estatusPendienteId);

        if (instalacionId.HasValue)
        {
            query = query.Where(o => o.InstalacionId == instalacionId.Value);
        }

        var ordenes = await MapearOrdenes(query);
        return Ok(new RespuestaApi<List<OrdenCompraRespuestaDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {ordenes.Count} órdenes pendientes",
            Datos = ordenes
        });
    }

    /// <summary>
    /// POST /api/compras/{id}/aprobar
    /// Aprueba una orden de compra.
    /// </summary>
    [HttpPost("{id}/aprobar")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> AprobarOrden(int id)
    {
        var orden = await _contexto.OrdenesCompra.FindAsync(id);
        if (orden is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Orden de compra no encontrada"
            });
        }

        orden.EstatusId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Aprobada, "Compras");
        orden.FechaAprobacion = DateTime.UtcNow;
        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = "Orden aprobada",
            Datos = true
        });
    }

    /// <summary>
    /// POST /api/compras/{id}/rechazar
    /// Rechaza una orden de compra.
    /// </summary>
    [HttpPost("{id}/rechazar")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> RechazarOrden(int id, [FromBody] string motivo)
    {
        if (string.IsNullOrWhiteSpace(motivo))
        {
            return BadRequest(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Debe indicar un motivo de rechazo"
            });
        }

        var orden = await _contexto.OrdenesCompra.FindAsync(id);
        if (orden is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Orden de compra no encontrada"
            });
        }

        orden.EstatusId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Rechazada, "Compras");
        orden.MotivoRechazo = motivo;
        orden.FechaRechazo = DateTime.UtcNow;
        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = "Orden rechazada",
            Datos = true
        });
    }

    /// <summary>
    /// GET /api/compras/aprobadas
    /// Lista órdenes aprobadas listas para recepción.
    /// </summary>
    [HttpGet("aprobadas")]
    [ProducesResponseType(typeof(RespuestaApi<List<OrdenCompraRespuestaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<OrdenCompraRespuestaDto>>>> ObtenerAprobadas([FromQuery] int? instalacionId = null)
    {
        var estatusAprobadaId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Aprobada, "Compras");

        var query = _contexto.OrdenesCompra
            .Include(o => o.Instalacion)
            .Include(o => o.Proveedor)
            .Include(o => o.Estatus)
            .Include(o => o.Detalles)
            .Where(o => o.EstatusId == estatusAprobadaId);

        if (instalacionId.HasValue)
        {
            query = query.Where(o => o.InstalacionId == instalacionId.Value);
        }

        var ordenes = await MapearOrdenes(query);
        return Ok(new RespuestaApi<List<OrdenCompraRespuestaDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {ordenes.Count} órdenes aprobadas",
            Datos = ordenes
        });
    }

    /// <summary>
    /// POST /api/compras/{id}/recibir
    /// Registra la recepción de mercancía.
    /// </summary>
    [HttpPost("{id}/recibir")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> RecibirOrden(int id, [FromBody] RecepcionOrdenCompraDto dto)
    {
        await using var transaccion = await _contexto.Database.BeginTransactionAsync();

        var orden = await _contexto.OrdenesCompra
            .Include(o => o.Detalles)
            .FirstOrDefaultAsync(o => o.OrdenCompraId == id);

        if (orden is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Orden de compra no encontrada"
            });
        }

        if (dto.Lineas.Count == 0)
        {
            return BadRequest(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Debe indicar al menos una línea a recibir"
            });
        }

        var estatusRecibidaId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Recibida, "Compras");
        var estatusAprobadaId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Aprobada, "Compras");

        foreach (var linea in dto.Lineas)
        {
            var detalle = orden.Detalles.FirstOrDefault(d => d.DetalleId == linea.DetalleId);
            if (detalle is null)
            {
                return BadRequest(new RespuestaApi<bool>
                {
                    Exito = false,
                    Mensaje = $"El detalle {linea.DetalleId} no pertenece a la orden"
                });
            }

            if (linea.CantidadRecibida <= 0)
            {
                return BadRequest(new RespuestaApi<bool>
                {
                    Exito = false,
                    Mensaje = "Cantidad recibida inválida"
                });
            }

            var pendiente = detalle.CantidadSolicitada - detalle.CantidadRecibida;
            if (linea.CantidadRecibida > pendiente)
            {
                return BadRequest(new RespuestaApi<bool>
                {
                    Exito = false,
                    Mensaje = $"La cantidad a recibir excede el pendiente para el detalle {detalle.DetalleId}"
                });
            }

            detalle.CantidadRecibida += linea.CantidadRecibida;

            // Registrar movimiento de entrada si el producto es inventariable.
            var producto = await _contexto.Productos.FirstAsync(p => p.ProductoId == detalle.ProductoId);
            if (producto.EsInventariable)
            {
                var saldoAnterior = await ObtenerSaldoActual(producto.ProductoId, orden.InstalacionId);
                var saldoFinal = saldoAnterior + linea.CantidadRecibida;

                _contexto.Movimientos.Add(new Movimiento
                {
                    InstalacionId = orden.InstalacionId,
                    ProductoId = producto.ProductoId,
                    TipoMovimiento = TipoMovimiento.Entrada,
                    Cantidad = linea.CantidadRecibida,
                    SaldoFinal = saldoFinal,
                    CostoUnitario = detalle.CostoUnitario,
                    Lote = linea.Lote,
                    FechaCaducidad = linea.FechaCaducidad,
                    CreadoEn = DateTime.UtcNow,
                    CreadoPor = UsuarioSistemaId
                });
            }
        }

        var completo = orden.Detalles.All(d => d.CantidadRecibida >= d.CantidadSolicitada);
        orden.EstatusId = completo ? estatusRecibidaId : estatusAprobadaId;
        await _contexto.SaveChangesAsync();
        await transaccion.CommitAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = completo ? "Orden recibida completamente" : "Recepción parcial registrada",
            Datos = true
        });
    }

    /// <summary>
    /// POST /api/compras
    /// Recibe y guarda una Orden de Compra con su detalle (transaccional).
    /// </summary>
    /// <param name="dto">Los datos de la orden de compra a crear.</param>
    /// <returns>La orden de compra creada.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<OrdenCompraRespuestaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<OrdenCompraRespuestaDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(RespuestaApi<OrdenCompraRespuestaDto>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(RespuestaApi<OrdenCompraRespuestaDto>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RespuestaApi<OrdenCompraRespuestaDto>>> CrearOrdenCompra([FromBody] CrearOrdenCompraDto dto)
    {
        // Iniciar transacción
        await using var transaccion = await _contexto.Database.BeginTransactionAsync();

        try
        {
            // Validaciones
            if (dto.Lineas is null || dto.Lineas.Count == 0)
            {
                return BadRequest(new RespuestaApi<OrdenCompraRespuestaDto>
                {
                    Exito = false,
                    Mensaje = "Debe incluir al menos una línea en la orden de compra"
                });
            }

            // Verificar que la instalación existe
            var instalacion = await _contexto.Instalaciones
                .Include(i => i.Sucursal)
                    .ThenInclude(s => s!.Empresa)
                .FirstOrDefaultAsync(i => i.InstalacionId == dto.InstalacionId);

            if (instalacion is null)
            {
                return NotFound(new RespuestaApi<OrdenCompraRespuestaDto>
                {
                    Exito = false,
                    Mensaje = "Instalación no encontrada"
                });
            }

            // Verificar que el proveedor existe
            var proveedor = await _contexto.Proveedores.FindAsync(dto.ProveedorId);
            if (proveedor is null)
            {
                return NotFound(new RespuestaApi<OrdenCompraRespuestaDto>
                {
                    Exito = false,
                    Mensaje = "Proveedor no encontrado"
                });
            }

            // Calcular monto total
            decimal montoTotal = 0;
            var detalles = new List<OrdenCompraDetalle>();

            foreach (var linea in dto.Lineas)
            {
                // Verificar que el producto existe
                var producto = await _contexto.Productos.FindAsync(linea.ProductoId);
                if (producto is null)
                {
                    return NotFound(new RespuestaApi<OrdenCompraRespuestaDto>
                    {
                        Exito = false,
                        Mensaje = $"Producto con ID {linea.ProductoId} no encontrado"
                    });
                }

                var subtotal = linea.Cantidad * linea.CostoUnitario;
                montoTotal += subtotal;

                detalles.Add(new OrdenCompraDetalle
                {
                    ProductoId = linea.ProductoId,
                    CantidadSolicitada = linea.Cantidad,
                    CantidadRecibida = 0,
                    CostoUnitario = linea.CostoUnitario
                });
            }

            // Crear la orden de compra
            var estatusPendienteId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Pendiente, "Compras");

            var ordenCompra = new OrdenCompra
            {
                InstalacionId = dto.InstalacionId,
                ProveedorId = dto.ProveedorId,
                EstatusId = estatusPendienteId,
                MontoTotal = montoTotal,
                Comentarios = dto.Comentarios,
                Detalles = detalles
            };

            _contexto.OrdenesCompra.Add(ordenCompra);
            await _contexto.SaveChangesAsync();

            // Confirmar transacción
            await transaccion.CommitAsync();

            // Preparar respuesta
            var respuesta = new OrdenCompraRespuestaDto
            {
                OrdenCompraId = ordenCompra.OrdenCompraId,
                InstalacionId = instalacion.InstalacionId,
                InstalacionNombre = instalacion.Nombre,
                ProveedorId = proveedor.ProveedorId,
                ProveedorNombre = proveedor.Nombre,
                Estatus = EstatusNombres.Pendiente,
                MontoTotal = montoTotal,
                Comentarios = ordenCompra.Comentarios,
                CreadoEn = ordenCompra.CreadoEn,
                Detalles = []
            };

            // Cargar los detalles con nombres de productos
            foreach (var detalle in ordenCompra.Detalles)
            {
                var producto = await _contexto.Productos.FindAsync(detalle.ProductoId);
                respuesta.Detalles.Add(new DetalleOrdenCompraRespuestaDto
                {
                    DetalleId = detalle.DetalleId,
                    ProductoId = detalle.ProductoId,
                    ProductoNombre = producto?.Nombre ?? "",
                    CantidadSolicitada = detalle.CantidadSolicitada,
                    CostoUnitario = detalle.CostoUnitario,
                    Subtotal = detalle.CantidadSolicitada * detalle.CostoUnitario
                });
            }

            return Ok(new RespuestaApi<OrdenCompraRespuestaDto>
            {
                Exito = true,
                Mensaje = $"Orden de compra {ordenCompra.OrdenCompraId} creada exitosamente",
                Datos = respuesta
            });
        }
        catch (Exception ex)
        {
            // Revertir transacción en caso de error
            await transaccion.RollbackAsync();
            _logger.LogError(ex, "Error al crear orden de compra para instalación {InstalacionId} y proveedor {ProveedorId}", dto.InstalacionId, dto.ProveedorId);

            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<OrdenCompraRespuestaDto>
            {
                Exito = false,
                Mensaje = "Error al crear la orden de compra",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."]
            });
        }
    }

    /// <summary>
    /// GET /api/compras/proveedores
    /// Obtiene la lista de proveedores.
    /// </summary>
    /// <returns>Lista de proveedores registrados.</returns>
    [HttpGet("proveedores")]
    [ProducesResponseType(typeof(RespuestaApi<List<ProveedorDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<List<ProveedorDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RespuestaApi<List<ProveedorDto>>>> ObtenerProveedores()
    {
        try
        {
            var proveedores = await _contexto.Proveedores
                .Select(p => new ProveedorDto
                {
                    ProveedorId = p.ProveedorId,
                    Nombre = p.Nombre,
                    RFC = p.RFC
                })
                .ToListAsync();

            return Ok(new RespuestaApi<List<ProveedorDto>>
            {
                Exito = true,
                Mensaje = $"Se encontraron {proveedores.Count} proveedores",
                Datos = proveedores
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener la lista de proveedores");
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<ProveedorDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener proveedores",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."]
            });
        }
    }

    /// <summary>
    /// GET /api/compras
    /// Obtiene la lista de órdenes de compra.
    /// </summary>
    /// <param name="instalacionId">Filtro opcional por instalación.</param>
    /// <returns>Lista de órdenes de compra.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<OrdenCompraRespuestaDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<List<OrdenCompraRespuestaDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RespuestaApi<List<OrdenCompraRespuestaDto>>>> ObtenerOrdenesCompra([FromQuery] int? instalacionId = null)
    {
        try
        {
            var query = _contexto.OrdenesCompra
                .Include(o => o.Instalacion)
                .Include(o => o.Proveedor)
                .Include(o => o.Estatus)
                .Include(o => o.Detalles)
                    .ThenInclude(d => d.Producto)
                .AsQueryable();

            if (instalacionId.HasValue)
            {
                query = query.Where(o => o.InstalacionId == instalacionId.Value);
            }

            var ordenes = await query
                .OrderByDescending(o => o.CreadoEn)
                .Select(o => new OrdenCompraRespuestaDto
                {
                    OrdenCompraId = o.OrdenCompraId,
                    InstalacionId = o.InstalacionId,
                    InstalacionNombre = o.Instalacion!.Nombre,
                    ProveedorId = o.ProveedorId,
                    ProveedorNombre = o.Proveedor!.Nombre,
                    Estatus = o.Estatus!.Nombre,
                    MontoTotal = o.MontoTotal,
                    Comentarios = o.Comentarios,
                    CreadoEn = o.CreadoEn,
                    Detalles = o.Detalles.Select(d => new DetalleOrdenCompraRespuestaDto
                    {
                        DetalleId = d.DetalleId,
                        ProductoId = d.ProductoId,
                        ProductoNombre = d.Producto!.Nombre,
                        CantidadSolicitada = d.CantidadSolicitada,
                        CostoUnitario = d.CostoUnitario,
                        Subtotal = d.CantidadSolicitada * d.CostoUnitario
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new RespuestaApi<List<OrdenCompraRespuestaDto>>
            {
                Exito = true,
                Mensaje = $"Se encontraron {ordenes.Count} órdenes de compra",
                Datos = ordenes
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener órdenes de compra para instalación {InstalacionId}", instalacionId);
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<OrdenCompraRespuestaDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener órdenes de compra",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."]
            });
        }
    }

    private async Task<List<OrdenCompraRespuestaDto>> MapearOrdenes(IQueryable<OrdenCompra> query)
    {
        return await query
            .OrderByDescending(o => o.CreadoEn)
            .Select(o => new OrdenCompraRespuestaDto
            {
                OrdenCompraId = o.OrdenCompraId,
                InstalacionId = o.InstalacionId,
                InstalacionNombre = o.Instalacion != null ? o.Instalacion.Nombre : string.Empty,
                ProveedorId = o.ProveedorId,
                ProveedorNombre = o.Proveedor != null ? o.Proveedor.Nombre : string.Empty,
                Estatus = o.Estatus != null ? o.Estatus.Nombre : string.Empty,
                MontoTotal = o.MontoTotal,
                Comentarios = o.Comentarios,
                CreadoEn = o.CreadoEn,
                Detalles = o.Detalles.Select(d => new DetalleOrdenCompraRespuestaDto
                {
                    DetalleId = d.DetalleId,
                    ProductoId = d.ProductoId,
                    ProductoNombre = d.Producto != null ? d.Producto.Nombre : string.Empty,
                    CantidadSolicitada = d.CantidadSolicitada,
                    CostoUnitario = d.CostoUnitario,
                    Subtotal = d.CantidadSolicitada * d.CostoUnitario
                }).ToList()
            })
            .ToListAsync();
    }

    private async Task<decimal> ObtenerSaldoActual(int productoId, int instalacionId)
    {
        var ultimoMovimiento = await _contexto.Movimientos
            .Where(m => m.ProductoId == productoId && m.InstalacionId == instalacionId)
            .OrderByDescending(m => m.MovimientoId)
            .FirstOrDefaultAsync();

        return ultimoMovimiento?.SaldoFinal ?? 0;
    }
}
