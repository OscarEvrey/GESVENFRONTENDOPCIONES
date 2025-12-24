using GesvenApi.Datos;
using GesvenApi.DTOs;
using GesvenApi.Modelos.Inventario;
using GesvenApi.Servicios;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestión del catálogo de productos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<ProductosController> _logger;
    private readonly IEstatusLookupService _estatusLookup;

    public ProductosController(GesvenDbContext contexto, ILogger<ProductosController> logger, IEstatusLookupService estatusLookup)
    {
        _contexto = contexto;
        _logger = logger;
        _estatusLookup = estatusLookup;
    }

    /// <summary>
    /// GET /api/productos
    /// Lista productos, opcionalmente filtrados por instalación.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<ProductoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<ProductoDto>>>> ObtenerProductos([FromQuery] int? instalacionId = null)
    {
        var consulta = _contexto.Productos
            .Include(p => p.Marca)
            .Include(p => p.Unidad)
            .Include(p => p.Estatus)
            .AsQueryable();

        if (instalacionId.HasValue)
        {
            consulta = consulta.Where(p => p.InstalacionId == instalacionId.Value);
        }

        var productos = await consulta
            .OrderBy(p => p.Nombre)
            .Select(p => new ProductoDto
            {
                ProductoId = p.ProductoId,
                InstalacionId = p.InstalacionId,
                Nombre = p.Nombre,
                Codigo = p.Codigo,
                Categoria = p.Categoria,
                EsInventariable = p.EsInventariable,
                PrecioUnitario = p.PrecioUnitario,
                StockMinimo = p.StockMinimo,
                MarcaId = p.MarcaId,
                MarcaNombre = p.Marca != null ? p.Marca.Nombre : null,
                UnidadId = p.UnidadId,
                UnidadNombre = p.Unidad != null ? p.Unidad.Nombre : null,
                EstatusId = p.EstatusId,
                EstatusNombre = p.Estatus != null ? p.Estatus.Nombre : string.Empty
            })
            .ToListAsync();

        return Ok(new RespuestaApi<List<ProductoDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {productos.Count} productos",
            Datos = productos
        });
    }

    /// <summary>
    /// GET /api/productos/{id}
    /// Obtiene un producto específico.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<ProductoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ProductoDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<ProductoDto>>> ObtenerProducto(int id)
    {
        var producto = await _contexto.Productos
            .Include(p => p.Marca)
            .Include(p => p.Unidad)
            .Include(p => p.Estatus)
            .FirstOrDefaultAsync(p => p.ProductoId == id);

        if (producto is null)
        {
            return NotFound(new RespuestaApi<ProductoDto>
            {
                Exito = false,
                Mensaje = "Producto no encontrado"
            });
        }

        var dto = new ProductoDto
        {
            ProductoId = producto.ProductoId,
            InstalacionId = producto.InstalacionId,
            Nombre = producto.Nombre,
            Codigo = producto.Codigo,
            Categoria = producto.Categoria,
            EsInventariable = producto.EsInventariable,
            PrecioUnitario = producto.PrecioUnitario,
            StockMinimo = producto.StockMinimo,
            MarcaId = producto.MarcaId,
            MarcaNombre = producto.Marca?.Nombre,
            UnidadId = producto.UnidadId,
            UnidadNombre = producto.Unidad?.Nombre,
            EstatusId = producto.EstatusId,
            EstatusNombre = producto.Estatus?.Nombre ?? string.Empty
        };

        return Ok(new RespuestaApi<ProductoDto>
        {
            Exito = true,
            Mensaje = "Producto obtenido exitosamente",
            Datos = dto
        });
    }

    /// <summary>
    /// POST /api/productos
    /// Crea un nuevo producto.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<ProductoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ProductoDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespuestaApi<ProductoDto>>> CrearProducto([FromBody] CrearProductoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
        {
            return BadRequest(new RespuestaApi<ProductoDto>
            {
                Exito = false,
                Mensaje = "El nombre del producto es obligatorio"
            });
        }

        var existeInstalacion = await _contexto.Instalaciones.AnyAsync(i => i.InstalacionId == dto.InstalacionId);
        if (!existeInstalacion)
        {
            return BadRequest(new RespuestaApi<ProductoDto>
            {
                Exito = false,
                Mensaje = "La instalación indicada no existe"
            });
        }

        var estatusActivoId = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Activo);

        var producto = new Producto
        {
            InstalacionId = dto.InstalacionId,
            Nombre = dto.Nombre,
            MarcaId = dto.MarcaId,
            UnidadId = dto.UnidadId,
            EsInventariable = dto.EsInventariable,
            PrecioUnitario = dto.PrecioUnitario,
            StockMinimo = dto.StockMinimo,
            Codigo = dto.Codigo,
            Categoria = dto.Categoria,
            EstatusId = estatusActivoId
        };

        _contexto.Productos.Add(producto);
        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<ProductoDto>
        {
            Exito = true,
            Mensaje = "Producto creado exitosamente",
            Datos = new ProductoDto
            {
                ProductoId = producto.ProductoId,
                InstalacionId = producto.InstalacionId,
                Nombre = producto.Nombre,
                Codigo = producto.Codigo,
                Categoria = producto.Categoria,
                EsInventariable = producto.EsInventariable,
                PrecioUnitario = producto.PrecioUnitario,
                StockMinimo = producto.StockMinimo,
                MarcaId = producto.MarcaId,
                UnidadId = producto.UnidadId,
                EstatusId = producto.EstatusId,
                EstatusNombre = EstatusNombres.Activo
            }
        });
    }

    /// <summary>
    /// PUT /api/productos/{id}
    /// Actualiza los datos de un producto.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<ProductoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ProductoDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<ProductoDto>>> ActualizarProducto(int id, [FromBody] ActualizarProductoDto dto)
    {
        var producto = await _contexto.Productos.FindAsync(id);
        if (producto is null)
        {
            return NotFound(new RespuestaApi<ProductoDto>
            {
                Exito = false,
                Mensaje = "Producto no encontrado"
            });
        }

        producto.Nombre = dto.Nombre;
        producto.MarcaId = dto.MarcaId;
        producto.UnidadId = dto.UnidadId;
        producto.EsInventariable = dto.EsInventariable;
        producto.PrecioUnitario = dto.PrecioUnitario;
        producto.StockMinimo = dto.StockMinimo;
        producto.Codigo = dto.Codigo;
        producto.Categoria = dto.Categoria;
        producto.EstatusId = dto.Activo
            ? await _estatusLookup.ObtenerIdAsync(EstatusNombres.Activo)
            : await _estatusLookup.ObtenerIdAsync(EstatusNombres.Inactivo);

        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<ProductoDto>
        {
            Exito = true,
            Mensaje = "Producto actualizado",
            Datos = new ProductoDto
            {
                ProductoId = producto.ProductoId,
                InstalacionId = producto.InstalacionId,
                Nombre = producto.Nombre,
                Codigo = producto.Codigo,
                Categoria = producto.Categoria,
                EsInventariable = producto.EsInventariable,
                PrecioUnitario = producto.PrecioUnitario,
                StockMinimo = producto.StockMinimo,
                MarcaId = producto.MarcaId,
                UnidadId = producto.UnidadId,
                EstatusId = producto.EstatusId,
                EstatusNombre = dto.Activo ? EstatusNombres.Activo : EstatusNombres.Inactivo
            }
        });
    }

    /// <summary>
    /// PATCH /api/productos/{id}/estatus
    /// Activa o desactiva un producto.
    /// </summary>
    [HttpPatch("{id}/estatus")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> CambiarEstatus(int id, [FromQuery] bool activo)
    {
        var producto = await _contexto.Productos.FindAsync(id);
        if (producto is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Producto no encontrado"
            });
        }

        producto.EstatusId = activo
            ? await _estatusLookup.ObtenerIdAsync(EstatusNombres.Activo)
            : await _estatusLookup.ObtenerIdAsync(EstatusNombres.Inactivo);
        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = activo ? "Producto activado" : "Producto desactivado",
            Datos = true
        });
    }
}