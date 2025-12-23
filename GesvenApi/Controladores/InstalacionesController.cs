using GesvenApi.Datos;
using GesvenApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestionar las instalaciones.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class InstalacionesController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<InstalacionesController> _logger;

    /// <summary>
    /// Inicializa una nueva instancia del controlador de instalaciones.
    /// </summary>
    /// <param name="contexto">El contexto de base de datos.</param>
    /// <param name="logger">El logger para registrar eventos.</param>
    public InstalacionesController(GesvenDbContext contexto, ILogger<InstalacionesController> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/instalaciones
    /// Lista las instalaciones permitidas para el usuario del sistema.
    /// </summary>
    /// <returns>Lista de instalaciones accesibles para el usuario.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<InstalacionDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<List<InstalacionDto>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RespuestaApi<List<InstalacionDto>>>> ObtenerInstalaciones()
    {
        try
        {
            // Obtener instalaciones a las que tiene acceso el usuario del sistema.
            var instalaciones = await _contexto.AccesosInstalacion
                .Where(a => a.UsuarioId == UsuarioSistemaId)
                .Include(a => a.Instalacion)
                    .ThenInclude(i => i!.Sucursal)
                        .ThenInclude(s => s!.Empresa)
                .Select(a => new InstalacionDto
                {
                    InstalacionId = a.Instalacion!.InstalacionId,
                    Nombre = a.Instalacion.Nombre,
                    Tipo = a.Instalacion.Tipo,
                    Empresa = a.Instalacion.Sucursal!.Empresa!.Nombre,
                    Sucursal = a.Instalacion.Sucursal.Nombre,
                    Descripcion = GenerarDescripcion(a.Instalacion.Tipo, a.Instalacion.Sucursal.Empresa.Nombre, a.Instalacion.Sucursal.Nombre)
                })
                .ToListAsync();

            return Ok(new RespuestaApi<List<InstalacionDto>>
            {
                Exito = true,
                Mensaje = "Instalaciones obtenidas exitosamente",
                Datos = instalaciones
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener las instalaciones para el usuario {UsuarioId}", UsuarioSistemaId);
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<InstalacionDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener las instalaciones",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."]
            });
        }
    }

    /// <summary>
    /// GET /api/instalaciones/{id}
    /// Obtiene una instalación por su ID.
    /// </summary>
    /// <param name="id">El identificador de la instalación.</param>
    /// <returns>Los datos de la instalación solicitada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<InstalacionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<InstalacionDto>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(RespuestaApi<InstalacionDto>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RespuestaApi<InstalacionDto>>> ObtenerInstalacion(int id)
    {
        try
        {
            var instalacion = await _contexto.Instalaciones
                .Include(i => i.Sucursal)
                    .ThenInclude(s => s!.Empresa)
                .Where(i => i.InstalacionId == id)
                .Select(i => new InstalacionDto
                {
                    InstalacionId = i.InstalacionId,
                    Nombre = i.Nombre,
                    Tipo = i.Tipo,
                    Empresa = i.Sucursal!.Empresa!.Nombre,
                    Sucursal = i.Sucursal.Nombre,
                    Descripcion = GenerarDescripcion(i.Tipo, i.Sucursal.Empresa.Nombre, i.Sucursal.Nombre)
                })
                .FirstOrDefaultAsync();

            if (instalacion is null)
            {
                return NotFound(new RespuestaApi<InstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Instalación no encontrada"
                });
            }

            return Ok(new RespuestaApi<InstalacionDto>
            {
                Exito = true,
                Mensaje = "Instalación obtenida exitosamente",
                Datos = instalacion
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener la instalación con ID {InstalacionId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<InstalacionDto>
            {
                Exito = false,
                Mensaje = "Error al obtener la instalación",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."]
            });
        }
    }

    private static string GenerarDescripcion(string tipo, string empresa, string ubicacion)
    {
        var tipoDescripcion = tipo.ToLower() == "almacen" ? "Almacén" : "Oficinas";
        var productos = tipo.ToLower() == "almacen" 
            ? "Productos: refrescos y snacks." 
            : "Productos: papelería y consumibles.";
        return $"{tipoDescripcion} de {empresa} en {ubicacion}. {productos}";
    }
}
