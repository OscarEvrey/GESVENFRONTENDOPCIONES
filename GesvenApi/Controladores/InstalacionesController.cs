using GesvenApi.Datos;
using GesvenApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para gestionar las instalaciones.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class InstalacionesController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private const int UsuarioActualId = 1; // Usuario del sistema

    public InstalacionesController(GesvenDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <summary>
    /// GET /api/instalaciones
    /// Lista las instalaciones permitidas para el Usuario 1.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<RespuestaApi<List<InstalacionDto>>>> ObtenerInstalaciones()
    {
        try
        {
            // Obtener instalaciones a las que tiene acceso el usuario 1
            var instalaciones = await _contexto.AccesosInstalacion
                .Where(a => a.UsuarioId == UsuarioActualId)
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
            return StatusCode(500, new RespuestaApi<List<InstalacionDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener las instalaciones",
                Errores = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// GET /api/instalaciones/{id}
    /// Obtiene una instalación por su ID.
    /// </summary>
    [HttpGet("{id}")]
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

            if (instalacion == null)
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
            return StatusCode(500, new RespuestaApi<InstalacionDto>
            {
                Exito = false,
                Mensaje = "Error al obtener la instalación",
                Errores = new List<string> { ex.Message }
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
