using GesvenApi.Datos;
using GesvenApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestionar el inventario de productos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class InventarioController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<InventarioController> _logger;

    /// <summary>
    /// Inicializa una nueva instancia del controlador de inventario.
    /// </summary>
    /// <param name="contexto">El contexto de base de datos.</param>
    /// <param name="logger">El logger para registrar eventos.</param>
    public InventarioController(GesvenDbContext contexto, ILogger<InventarioController> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/inventario/{instalacionId}
    /// Devuelve los productos filtrados por el contexto de la instalación.
    /// </summary>
    /// <param name="instalacionId">El identificador de la instalación.</param>
    /// <returns>Lista de productos con su stock actual.</returns>
    [HttpGet("{instalacionId}")]
    [ProducesResponseType(typeof(RespuestaApi<List<ProductoInventarioDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<List<ProductoInventarioDto>>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(RespuestaApi<List<ProductoInventarioDto>>), StatusCodes.Status500InternalServerError)]
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

            // Obtener productos de la instalación con su stock actual (basado en el último movimiento).
            var productos = await _contexto.Productos
                .Where(p => p.InstalacionId == instalacionId)
                .Include(p => p.Unidad)
                .Include(p => p.Movimientos.OrderByDescending(m => m.MovimientoId).Take(1))
                .Select(p => new ProductoInventarioDto
                {
                    ProductoId = p.ProductoId,
                    Codigo = p.Codigo ?? string.Empty,
                    Nombre = p.Nombre,
                    Categoria = p.Categoria ?? string.Empty,
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
            _logger.LogError(ex, "Error al obtener inventario para la instalación {InstalacionId}", instalacionId);
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<ProductoInventarioDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener el inventario",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."]
            });
        }
    }

    /// <summary>
    /// GET /api/inventario/{instalacionId}/productos
    /// Devuelve lista simplificada de productos para selectores.
    /// </summary>
    /// <param name="instalacionId">El identificador de la instalación.</param>
    /// <returns>Lista simplificada de productos.</returns>
    [HttpGet("{instalacionId}/productos")]
    [ProducesResponseType(typeof(RespuestaApi<List<ProductoSimpleDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<List<ProductoSimpleDto>>), StatusCodes.Status500InternalServerError)]
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
                    CostoSugerido = p.PrecioUnitario * FactorCostoSugerido
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
            _logger.LogError(ex, "Error al obtener productos simples para la instalación {InstalacionId}", instalacionId);
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<ProductoSimpleDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener productos",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."]
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
