using AutoMapper;
using AutoMapper.QueryableExtensions;
using GesvenApi.Data;
using GesvenApi.Models.Dtos.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controllers;

/// <summary>
/// Controlador para gestionar las instalaciones.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class InstalacionesController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
        private readonly IMapper _mapper;
    private readonly ILogger<InstalacionesController> _logger;

    /// <summary>
    /// Inicializa una nueva instancia del controlador de instalaciones.
    /// </summary>
    /// <param name="contexto">El contexto de base de datos.</param>
    /// <param name="logger">El logger para registrar eventos.</param>
    public InstalacionesController(GesvenDbContext contexto, IMapper mapper, ILogger<InstalacionesController> logger)
    {
        _contexto = contexto;
        _mapper = mapper;
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
            var usuarioId = UsuarioSistemaId;
            if (Request.Headers.TryGetValue("X-Gesven-UsuarioId", out var usuarioIdHeader) &&
                int.TryParse(usuarioIdHeader.FirstOrDefault(), out var parsedUsuarioId) &&
                parsedUsuarioId > 0)
            {
                usuarioId = parsedUsuarioId;
            }

            _logger.LogInformation("Obteniendo instalaciones para UsuarioId={UsuarioId} (header X-Gesven-UsuarioId={HeaderUsuarioId})", usuarioId, usuarioIdHeader.FirstOrDefault());

            // Obtener instalaciones a las que tiene acceso el usuario del sistema.
            var instalaciones = await _contexto.AccesosInstalacion
                .Where(a => a.UsuarioId == usuarioId)
                .Select(a => a.Instalacion!)
                .ProjectTo<InstalacionDto>(_mapper.ConfigurationProvider)
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
            _logger.LogError(ex, "Error al obtener las instalaciones");
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
                .Where(i => i.InstalacionId == id)
                .ProjectTo<InstalacionDto>(_mapper.ConfigurationProvider)
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

}


