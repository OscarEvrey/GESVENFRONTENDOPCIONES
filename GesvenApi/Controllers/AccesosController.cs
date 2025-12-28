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
            return StatusCode(500, new RespuestaApi<object> { Exito = false, Mensaje = "Error interno" });
        }
    }

    [HttpGet("roles")]
    [ProducesResponseType(typeof(RespuestaApi<List<RolDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<RolDto>>>> ObtenerRoles()
    {
        try
        {
            var roles = await _contexto.Roles.AsNoTracking()
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
            return StatusCode(500, new RespuestaApi<object> { Exito = false, Mensaje = "Error interno" });
        }
    }

    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<PagedResultDto<AccesoInstalacionDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<PagedResultDto<AccesoInstalacionDto>>>> ObtenerAccesos(
        [FromQuery] int? instalacionId = null,
        [FromQuery] int? usuarioId = null,
        [FromQuery] int? rolId = null,
        [FromQuery] bool incluirInactivos = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null)
    {
        try
        {
            var query = _contexto.AccesosInstalacion
                .Include(a => a.Usuario)
                .Include(a => a.Instalacion)
                .Include(a => a.Rol)
                .AsNoTracking();

            if (instalacionId is not null) query = query.Where(a => a.InstalacionId == instalacionId);
            if (usuarioId is not null) query = query.Where(a => a.UsuarioId == usuarioId);
            if (rolId is not null) query = query.Where(a => a.RolId == rolId);
            if (!incluirInactivos) query = query.Where(a => a.EsActivo);

            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = q.Trim().ToLower();
                query = query.Where(a =>
                    (a.Usuario != null && (a.Usuario.NombreCompleto.ToLower().Contains(term) || a.Usuario.Email.ToLower().Contains(term)))
                    || (a.Rol != null && a.Rol.Nombre.ToLower().Contains(term))
                );
            }

            // Pagination metadata
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 20;
            var totalCount = await query.CountAsync();

            var accesos = await query
                .OrderByDescending(a => a.ActualizadoEn)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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
                    CreadoEn = a.CreadoEn,
                    CreadoPor = a.CreadoPor,
                    ActualizadoEn = a.ActualizadoEn,
                    ActualizadoPor = a.ActualizadoPor,
                })
                .ToListAsync();

            var paged = new PagedResultDto<AccesoInstalacionDto>
            {
                Items = accesos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return Ok(new RespuestaApi<PagedResultDto<AccesoInstalacionDto>>
            {
                Exito = true,
                Mensaje = "Accesos obtenidos exitosamente",
                Datos = paged,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener accesos");
            return StatusCode(500, new RespuestaApi<object> { Exito = false, Mensaje = "Error interno" });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<AccesoInstalacionDto>>> CrearAcceso([FromBody] CrearAccesoInstalacionDto dto)
    {
        try
        {
            if (dto.UsuarioId <= 0 || dto.InstalacionId <= 0 || dto.RolId <= 0)
            {
                return BadRequest(new RespuestaApi<object> { Exito = false, Mensaje = "Datos inválidos", Errores = ["IDs requeridos."] });
            }

            if (!await _contexto.Usuarios.AnyAsync(u => u.UsuarioId == dto.UsuarioId))
                return BadRequest(new RespuestaApi<object> { Exito = false, Mensaje = "Usuario no existe" });
            if (!await _contexto.Instalaciones.AnyAsync(i => i.InstalacionId == dto.InstalacionId))
                return BadRequest(new RespuestaApi<object> { Exito = false, Mensaje = "Instalación no existe" });
            if (!await _contexto.Roles.AnyAsync(r => r.RolId == dto.RolId))
                return BadRequest(new RespuestaApi<object> { Exito = false, Mensaje = "Rol no existe" });

            var existente = await _contexto.AccesosInstalacion
                .FirstOrDefaultAsync(a => a.UsuarioId == dto.UsuarioId && a.InstalacionId == dto.InstalacionId);

            if (existente is null)
            {
                var nuevo = new AccesoInstalacion
                {
                    UsuarioId = dto.UsuarioId,
                    InstalacionId = dto.InstalacionId,
                    RolId = dto.RolId,
                    EsActivo = dto.EsActivo
                };
                _contexto.AccesosInstalacion.Add(nuevo);
                await _contexto.SaveChangesAsync();

                return Ok(new RespuestaApi<AccesoInstalacionDto>
                {
                    Exito = true,
                    Mensaje = "Acceso creado exitosamente",
                    Datos = await MapAccesoDto(nuevo.AccesoId)
                });
            }

            // Actualizar existente
            existente.RolId = dto.RolId;
            existente.EsActivo = dto.EsActivo;
            await _contexto.SaveChangesAsync();

            return Ok(new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = true,
                Mensaje = "Acceso reactivado/actualizado exitosamente",
                Datos = await MapAccesoDto(existente.AccesoId)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear acceso");
            return StatusCode(500, new RespuestaApi<object> { Exito = false, Mensaje = "Error interno" });
        }
    }

    [HttpPut("{accesoId:int}")]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<AccesoInstalacionDto>>> ActualizarAcceso(int accesoId, [FromBody] ActualizarAccesoInstalacionDto dto)
    {
        try
        {
            var acceso = await _contexto.AccesosInstalacion.FirstOrDefaultAsync(a => a.AccesoId == accesoId);
            if (acceso is null) return NotFound(new RespuestaApi<object> { Exito = false, Mensaje = "Acceso no encontrado" });

            if (!await _contexto.Roles.AnyAsync(r => r.RolId == dto.RolId))
                return BadRequest(new RespuestaApi<object> { Exito = false, Mensaje = "Rol no existe" });

            acceso.RolId = dto.RolId;
            acceso.EsActivo = dto.EsActivo;

            await _contexto.SaveChangesAsync();

            return Ok(new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = true,
                Mensaje = "Acceso actualizado exitosamente",
                Datos = await MapAccesoDto(accesoId)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar acceso");
            return StatusCode(500, new RespuestaApi<object> { Exito = false, Mensaje = "Error interno" });
        }
    }

    [HttpDelete("{accesoId:int}")]
    [ProducesResponseType(typeof(RespuestaApi<AccesoInstalacionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<AccesoInstalacionDto>>> RevocarAcceso(int accesoId)
    {
        try
        {
            var acceso = await _contexto.AccesosInstalacion.FirstOrDefaultAsync(a => a.AccesoId == accesoId);
            if (acceso is null) return NotFound(new RespuestaApi<object> { Exito = false, Mensaje = "Acceso no encontrado" });

            acceso.EsActivo = false;
            await _contexto.SaveChangesAsync();

            return Ok(new RespuestaApi<AccesoInstalacionDto>
            {
                Exito = true,
                Mensaje = "Acceso revocado exitosamente",
                Datos = await MapAccesoDto(accesoId)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al revocar acceso");
            return StatusCode(500, new RespuestaApi<object> { Exito = false, Mensaje = "Error interno" });
        }
    }

    private async Task<AccesoInstalacionDto?> MapAccesoDto(int accesoId)
    {
        return await _contexto.AccesosInstalacion
            .AsNoTracking()
            .Include(a => a.Usuario)
            .Include(a => a.Instalacion)
            .Include(a => a.Rol)
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
                CreadoEn = a.CreadoEn,
                CreadoPor = a.CreadoPor,
                ActualizadoEn = a.ActualizadoEn,
                ActualizadoPor = a.ActualizadoPor,
            })
            .FirstOrDefaultAsync();
    }
}