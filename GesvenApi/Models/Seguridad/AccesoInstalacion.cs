using GesvenApi.Models.Base;
using GesvenApi.Models.Organizacion;

namespace GesvenApi.Models.Seguridad;

/// <summary>
/// Representa la relación Usuario-Instalación-Rol.
/// Define qué Rol tiene un usuario dentro de una instalación específica.
/// </summary>
public class AccesoInstalacion : EntidadAuditable
{
    /// <summary>
    /// Identificador único del acceso.
    /// </summary>
    public int AccesoId { get; set; }

    /// <summary>
    /// Identificador del usuario.
    /// </summary>
    public int UsuarioId { get; set; }

    /// <summary>
    /// Navegación al usuario.
    /// </summary>
    public Usuario? Usuario { get; set; }

    /// <summary>
    /// Identificador de la instalación.
    /// </summary>
    public int InstalacionId { get; set; }

    /// <summary>
    /// Navegación a la instalación.
    /// </summary>
    public Instalacion? Instalacion { get; set; }

    /// <summary>
    /// Identificador del rol asignado.
    /// Los permisos efectivos se derivan de este Rol.
    /// </summary>
    public int RolId { get; set; }

    /// <summary>
    /// Navegación al rol.
    /// </summary>
    public Rol? Rol { get; set; }

    /// <summary>
    /// Indica si el acceso está activo.
    /// </summary>
    public bool EsActivo { get; set; } = true;
}