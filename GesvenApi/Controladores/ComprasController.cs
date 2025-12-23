using GesvenApi.Datos;
using GesvenApi.DTOs;
using GesvenApi.Modelos.Compras;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestionar las compras.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ComprasController : ControllerBase
{
    private readonly GesvenDbContext _contexto;

    public ComprasController(GesvenDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <summary>
    /// POST /api/compras
    /// Recibe y guarda una Orden de Compra con su detalle (transaccional).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<RespuestaApi<OrdenCompraRespuestaDto>>> CrearOrdenCompra([FromBody] CrearOrdenCompraDto dto)
    {
        // Iniciar transacción
        await using var transaccion = await _contexto.Database.BeginTransactionAsync();

        try
        {
            // Validaciones
            if (dto.Lineas == null || dto.Lineas.Count == 0)
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

            if (instalacion == null)
            {
                return NotFound(new RespuestaApi<OrdenCompraRespuestaDto>
                {
                    Exito = false,
                    Mensaje = "Instalación no encontrada"
                });
            }

            // Verificar que el proveedor existe
            var proveedor = await _contexto.Proveedores.FindAsync(dto.ProveedorId);
            if (proveedor == null)
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
                if (producto == null)
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
            var ordenCompra = new OrdenCompra
            {
                InstalacionId = dto.InstalacionId,
                ProveedorId = dto.ProveedorId,
                EstatusId = EstatusIds.Pendiente,
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
                Estatus = "Pendiente",
                MontoTotal = montoTotal,
                Comentarios = ordenCompra.Comentarios,
                CreadoEn = ordenCompra.CreadoEn,
                Detalles = new List<DetalleOrdenCompraRespuestaDto>()
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

            return StatusCode(500, new RespuestaApi<OrdenCompraRespuestaDto>
            {
                Exito = false,
                Mensaje = "Error al crear la orden de compra",
                Errores = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// GET /api/compras/proveedores
    /// Obtiene la lista de proveedores.
    /// </summary>
    [HttpGet("proveedores")]
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
            return StatusCode(500, new RespuestaApi<List<ProveedorDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener proveedores",
                Errores = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// GET /api/compras
    /// Obtiene la lista de órdenes de compra.
    /// </summary>
    [HttpGet]
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
            return StatusCode(500, new RespuestaApi<List<OrdenCompraRespuestaDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener órdenes de compra",
                Errores = new List<string> { ex.Message }
            });
        }
    }
}
