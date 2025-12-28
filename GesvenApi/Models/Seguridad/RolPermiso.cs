using GesvenApi.Models.Base;

namespace GesvenApi.Models.Seguridad;

/// <summary>
/// Tabla intermedia que define qué permisos tiene asignados un rol.
/// </summary>
public class RolPermiso : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la asignación.
    /// </summary>
    public int RolPermisoId { get; set; }

    /// <summary>
    /// Identificador del rol.
    /// </summary>
    public int RolId { get; set; }

    /// <summary>
    /// Navegación al rol.
    /// </summary>
    public Rol? Rol { get; set; }

    /// <summary>
    /// Identificador del permiso.
    /// </summary>
    public int PermisoId { get; set; }

    /// <summary>
    /// Navegación al permiso.
    /// </summary>
    public Permiso? Permiso { get; set; }

    /// <summary>
    /// Indica si esta asignación está activa (útil para desactivar un permiso temporalmente sin borrar el registro).
    /// </summary>
    public bool EsActivo { get; set; } = true;
}