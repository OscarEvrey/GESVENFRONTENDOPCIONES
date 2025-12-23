using GesvenApi.Datos;
using GesvenApi.DTOs;
using GesvenApi.Modelos.Compras;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestión de proveedores.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProveedoresController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<ProveedoresController> _logger;

    public ProveedoresController(GesvenDbContext contexto, ILogger<ProveedoresController> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/proveedores
    /// Lista proveedores.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<ProveedorDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<ProveedorDto>>>> ObtenerProveedores()
    {
        var proveedores = await _contexto.Proveedores
            .OrderBy(p => p.Nombre)
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

    /// <summary>
    /// GET /api/proveedores/{id}
    /// Obtiene un proveedor.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<ProveedorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ProveedorDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<ProveedorDto>>> ObtenerProveedor(int id)
    {
        var proveedor = await _contexto.Proveedores.FindAsync(id);
        if (proveedor is null)
        {
            return NotFound(new RespuestaApi<ProveedorDto>
            {
                Exito = false,
                Mensaje = "Proveedor no encontrado"
            });
        }

        var dto = new ProveedorDto
        {
            ProveedorId = proveedor.ProveedorId,
            Nombre = proveedor.Nombre,
            RFC = proveedor.RFC
        };

        return Ok(new RespuestaApi<ProveedorDto>
        {
            Exito = true,
            Mensaje = "Proveedor obtenido",
            Datos = dto
        });
    }

    /// <summary>
    /// POST /api/proveedores
    /// Crea un proveedor.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<ProveedorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ProveedorDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespuestaApi<ProveedorDto>>> CrearProveedor([FromBody] ProveedorDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
        {
            return BadRequest(new RespuestaApi<ProveedorDto>
            {
                Exito = false,
                Mensaje = "El nombre del proveedor es obligatorio"
            });
        }

        if (!string.IsNullOrWhiteSpace(dto.RFC))
        {
            var rfcDuplicado = await _contexto.Proveedores.AnyAsync(p => p.RFC == dto.RFC);
            if (rfcDuplicado)
            {
                return BadRequest(new RespuestaApi<ProveedorDto>
                {
                    Exito = false,
                    Mensaje = "El RFC ya está registrado"
                });
            }
        }

        var proveedor = new Proveedor
        {
            Nombre = dto.Nombre,
            RFC = dto.RFC
        };

        _contexto.Proveedores.Add(proveedor);
        await _contexto.SaveChangesAsync();

        dto.ProveedorId = proveedor.ProveedorId;
        return Ok(new RespuestaApi<ProveedorDto>
        {
            Exito = true,
            Mensaje = "Proveedor creado",
            Datos = dto
        });
    }

    /// <summary>
    /// PUT /api/proveedores/{id}
    /// Actualiza un proveedor.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<ProveedorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ProveedorDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<ProveedorDto>>> ActualizarProveedor(int id, [FromBody] ProveedorDto dto)
    {
        var proveedor = await _contexto.Proveedores.FindAsync(id);
        if (proveedor is null)
        {
            return NotFound(new RespuestaApi<ProveedorDto>
            {
                Exito = false,
                Mensaje = "Proveedor no encontrado"
            });
        }

        if (!string.IsNullOrWhiteSpace(dto.RFC))
        {
            var rfcDuplicado = await _contexto.Proveedores.AnyAsync(p => p.RFC == dto.RFC && p.ProveedorId != id);
            if (rfcDuplicado)
            {
                return BadRequest(new RespuestaApi<ProveedorDto>
                {
                    Exito = false,
                    Mensaje = "El RFC ya está registrado"
                });
            }
        }

        proveedor.Nombre = dto.Nombre;
        proveedor.RFC = dto.RFC;
        await _contexto.SaveChangesAsync();

        dto.ProveedorId = proveedor.ProveedorId;
        return Ok(new RespuestaApi<ProveedorDto>
        {
            Exito = true,
            Mensaje = "Proveedor actualizado",
            Datos = dto
        });
    }
}