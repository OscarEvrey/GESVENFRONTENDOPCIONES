using GesvenApi.Models.Base;

namespace GesvenApi.Models.Seguridad;

/// <summary>
/// Catálogo de permisos (acciones) disponibles en el sistema.
/// </summary>
public class Permiso : EntidadAuditable
{
    /// <summary>
    /// Identificador único del permiso.
    /// </summary>
    public int PermisoId { get; set; }

    /// <summary>
    /// Identificador del módulo al que pertenece este permiso.
    /// </summary>
    public int ModuloId { get; set; }

    /// <summary>
    /// Navegación al módulo.
    /// </summary>
    public Modulo? Modulo { get; set; }

    /// <summary>
    /// Nombre legible del permiso (ej. "Acceso a Ventas").
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Clave única para uso en código (ej. "VENTAS_ACCESS").
    /// </summary>
    public string Clave { get; set; } = string.Empty;

    /// <summary>
    /// Descripción detallada de lo que permite este permiso.
    /// </summary>
    public string? Descripcion { get; set; }

    /// <summary>
    /// Indica si el permiso está activo en el sistema.
    /// </summary>
    public bool EsActivo { get; set; } = true;

    /// <summary>
    /// Colección de roles que tienen este permiso asignado.
    /// </summary>
    public ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
}