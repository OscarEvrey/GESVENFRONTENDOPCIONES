using GesvenApi.Data;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Models.Dtos.Responses.Seguridad;
using GesvenApi.Models.Seguridad;
using GesvenApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeguridadController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly IUsuarioActualService _usuarioService;

    public SeguridadController(GesvenDbContext contexto, IUsuarioActualService usuarioService)
    {
        _contexto = contexto;
        _usuarioService = usuarioService;
    }

    [HttpGet("menu")]
    public async Task<ActionResult<RespuestaApi<MenuResponseDto>>> ObtenerMenu([FromQuery] int instalacionId)
    {
        try
        {
            var usuarioId = _usuarioService.ObtenerUsuarioId();

            // 1. Validar Acceso a la Instalación y Obtener Rol
            var acceso = await _contexto.AccesosInstalacion
                .Include(a => a.Rol)
                .Include(a => a.Usuario)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.UsuarioId == usuarioId && a.InstalacionId == instalacionId && a.EsActivo);

            if (acceso == null || acceso.Rol == null || !acceso.Rol.EsActivo)
            {
                return Unauthorized(new RespuestaApi<object> { Exito = false, Mensaje = "No tienes acceso activo a esta instalación." });
            }

            // 2. Obtener Permisos del Rol
            var rolPermisos = await _contexto.RolesPermisos
                .Include(rp => rp.Permiso)
                .ThenInclude(p => p!.Modulo)
                .Where(rp => rp.RolId == acceso.RolId && rp.EsActivo && rp.Permiso!.EsActivo)
                .AsNoTracking()
                .ToListAsync();

            // Lista de claves de permisos
            var clavesPermisos = rolPermisos
                .Select(rp => rp.Permiso!.Clave)
                .Distinct()
                .ToList();

            // 3. Obtener IDs de Módulos autorizados
            var modulosIdsAutorizados = rolPermisos
                .Select(rp => rp.Permiso!.ModuloId)
                .Distinct()
                .ToHashSet();

            // 4. Traer todos los módulos del sistema
            var todosLosModulos = await _contexto.Modulos
                .Where(m => m.EsActivo)
                .OrderBy(m => m.Orden)
                .AsNoTracking()
                .ToListAsync();

            // 5. Construir el Árbol del Menú
            var menuArbol = ConstruirArbolMenu(todosLosModulos, modulosIdsAutorizados);

            // CORRECCIÓN AQUÍ: Usamos ?. y ?? para evitar la advertencia CS8602
            var respuesta = new MenuResponseDto
            {
                Usuario = new UsuarioResumenDto
                {
                    UsuarioId = acceso.UsuarioId,
                    // Si Usuario es null (improbable por el Include, pero posible para el compilador), devuelve cadena vacía
                    NombreCompleto = acceso.Usuario?.NombreCompleto ?? string.Empty,
                    Email = acceso.Usuario?.Email ?? string.Empty,
                    RolId = acceso.RolId,
                    RolNombre = acceso.Rol.Nombre
                },
                Permisos = clavesPermisos,
                Menu = menuArbol
            };

            return Ok(new RespuestaApi<MenuResponseDto>
            {
                Exito = true,
                Datos = respuesta
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new RespuestaApi<object> { Exito = false, Mensaje = "Error al construir el menú: " + ex.Message });
        }
    }

    /// <summary>
    /// Construye la jerarquía de menús filtrando solo los autorizados.
    /// </summary>
    private List<ModuloDto> ConstruirArbolMenu(List<Modulo> todos, HashSet<int> idsAutorizados)
    {
        var mapaDto = new Dictionary<int, ModuloDto>();
        var raices = new List<ModuloDto>();

        // Paso A: Convertir a DTOs
        foreach (var m in todos)
        {
            mapaDto[m.ModuloId] = new ModuloDto
            {
                ModuloId = m.ModuloId,
                Nombre = m.Nombre,
                Ruta = m.Ruta,
                Icono = m.Icono,
                Orden = m.Orden,
                PadreId = m.PadreId
            };
        }

        // Paso B: Armar jerarquía
        foreach (var m in todos)
        {
            var dto = mapaDto[m.ModuloId];
            
            if (m.PadreId.HasValue && mapaDto.ContainsKey(m.PadreId.Value))
            {
                mapaDto[m.PadreId.Value].Hijos.Add(dto);
            }
            else
            {
                raices.Add(dto);
            }
        }

        // Paso C: Filtrar
        return FiltrarNodosAutorizados(raices, idsAutorizados);
    }

    private List<ModuloDto> FiltrarNodosAutorizados(List<ModuloDto> nodos, HashSet<int> idsAutorizados)
    {
        var resultado = new List<ModuloDto>();

        foreach (var nodo in nodos)
        {
            if (nodo.Hijos.Any())
            {
                nodo.Hijos = FiltrarNodosAutorizados(nodo.Hijos, idsAutorizados);
            }

            bool esVisible = idsAutorizados.Contains(nodo.ModuloId) || nodo.Hijos.Any();

            if (esVisible)
            {
                resultado.Add(nodo);
            }
        }

        return resultado;
    }
}