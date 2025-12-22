using GesvenApi.Datos;
using GesvenApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestionar el inventario.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class InventarioController : ControllerBase
{
    private readonly GesvenDbContext _contexto;

    public InventarioController(GesvenDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <summary>
    /// GET /api/inventario/{instalacionId}
    /// Devuelve los productos filtrados por el contexto de la instalación.
    /// </summary>
    [HttpGet("{instalacionId}")]
    public async Task<ActionResult<RespuestaApi<List<ProductoInventarioDto>>>> ObtenerInventario(int instalacionId)
    {
        try
        {
            // Verificar que la instalación existe
            var instalacionExiste = await _contexto.Instalaciones.AnyAsync(i => i.InstalacionId == instalacionId);
            if (!instalacionExiste)
            {
                return NotFound(new RespuestaApi<List<ProductoInventarioDto>>
                {
                    Exito = false,
                    Mensaje = "Instalación no encontrada"
                });
            }

            // Obtener productos de la instalación con su stock actual (basado en el último movimiento)
            var productos = await _contexto.Productos
                .Where(p => p.InstalacionId == instalacionId)
                .Include(p => p.Unidad)
                .Include(p => p.Movimientos.OrderByDescending(m => m.MovimientoId).Take(1))
                .Select(p => new ProductoInventarioDto
                {
                    ProductoId = p.ProductoId,
                    Codigo = p.Codigo ?? "",
                    Nombre = p.Nombre,
                    Categoria = p.Categoria ?? "",
                    Unidad = p.Unidad != null ? p.Unidad.Nombre : "Pieza",
                    StockActual = p.Movimientos.Any() 
                        ? p.Movimientos.OrderByDescending(m => m.MovimientoId).First().SaldoFinal 
                        : 0,
                    StockMinimo = p.StockMinimo,
                    PrecioUnitario = p.PrecioUnitario,
                    Estado = DeterminarEstado(
                        p.Movimientos.Any() 
                            ? p.Movimientos.OrderByDescending(m => m.MovimientoId).First().SaldoFinal 
                            : 0, 
                        p.StockMinimo),
                    Ubicacion = GenerarUbicacion(p.ProductoId)
                })
                .ToListAsync();

            return Ok(new RespuestaApi<List<ProductoInventarioDto>>
            {
                Exito = true,
                Mensaje = $"Se encontraron {productos.Count} productos",
                Datos = productos
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new RespuestaApi<List<ProductoInventarioDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener el inventario",
                Errores = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// GET /api/inventario/{instalacionId}/productos
    /// Devuelve lista simplificada de productos para selectores.
    /// </summary>
    [HttpGet("{instalacionId}/productos")]
    public async Task<ActionResult<RespuestaApi<List<ProductoSimpleDto>>>> ObtenerProductosSimples(int instalacionId)
    {
        try
        {
            var productos = await _contexto.Productos
                .Where(p => p.InstalacionId == instalacionId)
                .Select(p => new ProductoSimpleDto
                {
                    ProductoId = p.ProductoId,
                    Nombre = p.Nombre,
                    CostoSugerido = p.PrecioUnitario * 0.7m // El costo sugerido es ~70% del precio de venta
                })
                .ToListAsync();

            return Ok(new RespuestaApi<List<ProductoSimpleDto>>
            {
                Exito = true,
                Mensaje = $"Se encontraron {productos.Count} productos",
                Datos = productos
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new RespuestaApi<List<ProductoSimpleDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener productos",
                Errores = new List<string> { ex.Message }
            });
        }
    }

    private static string DeterminarEstado(decimal stockActual, decimal stockMinimo)
    {
        if (stockActual == 0)
            return "agotado";
        if (stockActual < stockMinimo)
            return "bajo_stock";
        return "disponible";
    }

    private static string GenerarUbicacion(int productoId)
    {
        // Genera una ubicación ficticia basada en el ID
        var seccion = (char)('A' + (productoId % 7));
        var fila = ((productoId / 7) % 5) + 1;
        var posicion = (productoId % 10) + 1;
        return $"{seccion}-{fila:D2}-{posicion:D2}";
    }
}
