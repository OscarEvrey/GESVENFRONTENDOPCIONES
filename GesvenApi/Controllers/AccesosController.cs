using AutoMapper;
using AutoMapper.QueryableExtensions;
using GesvenApi.Data;
using GesvenApi.Models.Dtos.Requests.Seguridad;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Models.Dtos.Responses.Seguridad;
using GesvenApi.Models.Seguridad;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Controllers;

/// <summary>
/// Administración de accesos Usuario-Instalación-Rol.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AccesosController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly IMapper _mapper;
    private readonly ILogger<AccesosController> _logger;

    public AccesosController(GesvenDbContext contexto, IMapper mapper, ILogger<AccesosController> logger)
    {
        _contexto = contexto;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/accesos/usuarios
    /// Lista usuarios del sistema (fuente actual: tabla Seg.Usuario).
    /// </summary>
    [HttpGet("usuarios")]
    [ProducesResponseType(typeof(RespuestaApi<List<UsuarioDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<UsuarioDto>>>> ObtenerUsuarios([FromQuery] string? q = null)
    {
        try
        {
            var query = _contexto.Usuarios.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = q.Trim().ToLower();
                query = query.Where(u => u.Email.ToLower().Contains(term) || u.NombreCompleto.ToLower().Contains(term));
            }

            var usuarios = await query
                .OrderBy(u => u.NombreCompleto)
                .ProjectTo<UsuarioDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(new RespuestaApi<List<UsuarioDto>>
            {
                Exito = true,
                Mensaje = "Usuarios obtenidos exitosamente",
                Datos = usuarios,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuarios");
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<UsuarioDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener usuarios",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."],
            });
        }
    }

    /// <summary>
    /// GET /api/accesos/roles
    /// Lista roles.
    /// </summary>
    [HttpGet("roles")]
    [ProducesResponseType(typeof(RespuestaApi<List<RolDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<RolDto>>>> ObtenerRoles()
    {
        try
        {
            var roles = await _contexto.Roles
                .AsNoTracking()
                .OrderBy(r => r.Nombre)
                .ProjectTo<RolDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(new RespuestaApi<List<RolDto>>
            {
                Exito = true,
                Mensaje = "Roles obtenidos exitosamente",
                Datos = roles,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener roles");
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<RolDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener roles",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."],
            });
        }
    }

    /// <summary>
    /// GET /api/accesos
    /// Lista accesos asignados.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<AccesoInstalacionDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<AccesoInstalacionDto>>>> ObtenerAccesos(
        [FromQuery] int? instalacionId = null,
        [FromQuery] int? usuarioId = null,
        [FromQuery] bool incluirInactivos = true)
    {
        try
        {
            var query = _contexto.AccesosInstalacion
                .AsNoTracking();

            if (instalacionId is not null)
            {
                query = query.Where(a => a.InstalacionId == instalacionId);
            }

            if (usuarioId is not null)
            {
                query = query.Where(a => a.UsuarioId == usuarioId);
            }

            if (!incluirInactivos)
            {
                query = query.Where(a => a.EsActivo);
            }

            var accesos = await query
                .OrderByDescending(a => a.ActualizadoEn)
                .Select(a => new AccesoInstalacionDto
                {
                    AccesoId = a.AccesoId,
                    UsuarioId = a.UsuarioId,
                    UsuarioNombreCompleto = a.Usuario != null ? a.Usuario.NombreCompleto : string.Empty,
                    UsuarioEmail = a.Usuario != null ? a.Usuario.Email : string.Empty,
                    UsuarioPuesto = a.Usuario != null ? a.Usuario.Puesto : null,
                    InstalacionId = a.InstalacionId,
                    InstalacionNombre = a.Instalacion != null ? a.Instalacion.Nombre : string.Empty,
                    RolId = a.RolId,
                    RolNombre = a.Rol != null ? a.Rol.Nombre : string.Empty,
                    EsActivo = a.EsActivo,
                    Permisos = new PermisosModuloDto
                    {
                        Compras = a.PermisoCompras,
                        Ventas = a.PermisoVentas,
                        Inventario = a.PermisoInventario,
                        Facturacion = a.PermisoFacturacion,
                        Pagos = a.PermisoPagos,
                        Auditoria = a.PermisoAuditoria,
                        Catalogos = a.PermisoCatalogos,
                    },
                    CreadoEn = a.CreadoEn,
                    CreadoPor = a.CreadoPor,
                    ActualizadoEn = a.ActualizadoEn,
                    ActualizadoPor = a.ActualizadoPor,
                })
                .ToListAsync();

            return Ok(new RespuestaApi<List<AccesoInstalacionDto>>
            {
                Exito = true,
                Mensaje = "Accesos obtenidos exitosamente",
                Datos = accesos,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener accesos");
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<List<AccesoInstalacionDto>>
            {
                Exito = false,
                Mensaje = "Error al obtener accesos",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."],
            });
        }
    }

    /// <summary>
    /// POST /api/accesos
    /// Crea (o reactiva) un acceso Usuario-Instalación.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespuestaApi<AccesoInstalacionDto>>> CrearAcceso([FromBody] CrearAccesoInstalacionDto dto)
    {
        try
        {
            if (dto.UsuarioId <= 0 || dto.InstalacionId <= 0 || dto.RolId <= 0)
            {
                return BadRequest(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Datos inválidos",
                    Errores = ["UsuarioId, InstalacionId y RolId son requeridos."],
                });
            }

            var existeUsuario = await _contexto.Usuarios.AnyAsync(u => u.UsuarioId == dto.UsuarioId);
            if (!existeUsuario)
            {
                return BadRequest(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Usuario no encontrado",
                    Errores = [$"No existe UsuarioId={dto.UsuarioId}"],
                });
            }

            var existeInstalacion = await _contexto.Instalaciones.AnyAsync(i => i.InstalacionId == dto.InstalacionId);
            if (!existeInstalacion)
            {
                return BadRequest(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Instalación no encontrada",
                    Errores = [$"No existe InstalacionId={dto.InstalacionId}"],
                });
            }

            var existeRol = await _contexto.Roles.AnyAsync(r => r.RolId == dto.RolId);
            if (!existeRol)
            {
                return BadRequest(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Rol no encontrado",
                    Errores = [$"No existe RolId={dto.RolId}"],
                });
            }

            var existente = await _contexto.AccesosInstalacion
                .FirstOrDefaultAsync(a => a.UsuarioId == dto.UsuarioId && a.InstalacionId == dto.InstalacionId);

            if (existente is null)
            {
                var nuevo = new AccesoInstalacion
                {
                    UsuarioId = dto.UsuarioId,
                    InstalacionId = dto.InstalacionId,
                    RolId = dto.RolId,
                    EsActivo = dto.EsActivo,
                    PermisoCompras = dto.PermisoCompras,
                    PermisoVentas = dto.PermisoVentas,
                    PermisoInventario = dto.PermisoInventario,
                    PermisoFacturacion = dto.PermisoFacturacion,
                    PermisoPagos = dto.PermisoPagos,
                    PermisoAuditoria = dto.PermisoAuditoria,
                    PermisoCatalogos = dto.PermisoCatalogos,
                };

                _contexto.AccesosInstalacion.Add(nuevo);
                await _contexto.SaveChangesAsync();

                return Ok(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = true,
                    Mensaje = "Acceso creado exitosamente",
                    Datos = await MapAccesoDto(nuevo.AccesoId),
                });
            }

            existente.RolId = dto.RolId;
            existente.EsActivo = dto.EsActivo;
            existente.PermisoCompras = dto.PermisoCompras;
            existente.PermisoVentas = dto.PermisoVentas;
            existente.PermisoInventario = dto.PermisoInventario;
            existente.PermisoFacturacion = dto.PermisoFacturacion;
            existente.PermisoPagos = dto.PermisoPagos;
            existente.PermisoAuditoria = dto.PermisoAuditoria;
            existente.PermisoCatalogos = dto.PermisoCatalogos;

            await _contexto.SaveChangesAsync();

            return Ok(new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = true,
                Mensaje = "Acceso actualizado (reactivado) exitosamente",
                Datos = await MapAccesoDto(existente.AccesoId),
            });
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Error de BD al crear acceso");
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = false,
                Mensaje = "Error al crear acceso",
                Errores = ["No fue posible guardar el acceso. Verifique restricciones de unicidad o llaves foráneas."],
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear acceso");
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = false,
                Mensaje = "Error al crear acceso",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."],
            });
        }
    }

    /// <summary>
    /// PUT /api/accesos/{accesoId}
    /// Actualiza rol, permisos y estatus.
    /// </summary>
    [HttpPut("{accesoId:int}")]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<AccesoInstalacionDto>>> ActualizarAcceso(int accesoId, [FromBody] ActualizarAccesoInstalacionDto dto)
    {
        try
        {
            var acceso = await _contexto.AccesosInstalacion.FirstOrDefaultAsync(a => a.AccesoId == accesoId);
            if (acceso is null)
            {
                return NotFound(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Acceso no encontrado",
                });
            }

            var existeRol = await _contexto.Roles.AnyAsync(r => r.RolId == dto.RolId);
            if (!existeRol)
            {
                return BadRequest(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Rol no encontrado",
                    Errores = [$"No existe RolId={dto.RolId}"],
                });
            }

            acceso.RolId = dto.RolId;
            acceso.EsActivo = dto.EsActivo;
            acceso.PermisoCompras = dto.PermisoCompras;
            acceso.PermisoVentas = dto.PermisoVentas;
            acceso.PermisoInventario = dto.PermisoInventario;
            acceso.PermisoFacturacion = dto.PermisoFacturacion;
            acceso.PermisoPagos = dto.PermisoPagos;
            acceso.PermisoAuditoria = dto.PermisoAuditoria;
            acceso.PermisoCatalogos = dto.PermisoCatalogos;

            await _contexto.SaveChangesAsync();

            return Ok(new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = true,
                Mensaje = "Acceso actualizado exitosamente",
                Datos = await MapAccesoDto(accesoId),
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar acceso {AccesoId}", accesoId);
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = false,
                Mensaje = "Error al actualizar acceso",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."],
            });
        }
    }

    /// <summary>
    /// DELETE /api/accesos/{accesoId}
    /// Revoca (desactiva) el acceso.
    /// </summary>
    [HttpDelete("{accesoId:int}")]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<AccesoInstalacionDto>>> RevocarAcceso(int accesoId)
    {
        try
        {
            var acceso = await _contexto.AccesosInstalacion.FirstOrDefaultAsync(a => a.AccesoId == accesoId);
            if (acceso is null)
            {
                return NotFound(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = false,
                    Mensaje = "Acceso no encontrado",
                });
            }

            acceso.EsActivo = false;
            await _contexto.SaveChangesAsync();

            return Ok(new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = true,
                Mensaje = "Acceso revocado exitosamente",
                Datos = await MapAccesoDto(accesoId),
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al revocar acceso {AccesoId}", accesoId);
            return StatusCode(StatusCodes.Status500InternalServerError, new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = false,
                Mensaje = "Error al revocar acceso",
                Errores = ["Ocurrió un error interno. Por favor, intente más tarde."],
            });
        }
    }

    private async Task<AccesoInstalacionDto?> MapAccesoDto(int accesoId)
    {
        return await _contexto.AccesosInstalacion
            .AsNoTracking()
            .Where(a => a.AccesoId == accesoId)
            .Select(a => new AccesoInstalacionDto
            {
                AccesoId = a.AccesoId,
                UsuarioId = a.UsuarioId,
                UsuarioNombreCompleto = a.Usuario != null ? a.Usuario.NombreCompleto : string.Empty,
                UsuarioEmail = a.Usuario != null ? a.Usuario.Email : string.Empty,
                UsuarioPuesto = a.Usuario != null ? a.Usuario.Puesto : null,
                InstalacionId = a.InstalacionId,
                InstalacionNombre = a.Instalacion != null ? a.Instalacion.Nombre : string.Empty,
                RolId = a.RolId,
                RolNombre = a.Rol != null ? a.Rol.Nombre : string.Empty,
                EsActivo = a.EsActivo,
                Permisos = new PermisosModuloDto
                {
                    Compras = a.PermisoCompras,
                    Ventas = a.PermisoVentas,
                    Inventario = a.PermisoInventario,
                    Facturacion = a.PermisoFacturacion,
                    Pagos = a.PermisoPagos,
                    Auditoria = a.PermisoAuditoria,
                    Catalogos = a.PermisoCatalogos,
                },
                CreadoEn = a.CreadoEn,
                CreadoPor = a.CreadoPor,
                ActualizadoEn = a.ActualizadoEn,
                ActualizadoPor = a.ActualizadoPor,
            })
            .FirstOrDefaultAsync();
    }
}
