using GesvenApi.Models.Base;

namespace GesvenApi.Models.Seguridad;

/// <summary>
/// Representa un rol de usuario en el sistema.
/// </summary>
public class Rol : EntidadAuditable
{
    /// <summary>
    /// Identificador único del rol.
    /// </summary>
    public int RolId { get; set; }

    /// <summary>
    /// Nombre del rol.
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Descripción del rol.
    /// </summary>
    public string? Descripcion { get; set; }

    /// <summary>
    /// Indica si el rol está activo.
    /// </summary>
    public bool EsActivo { get; set; } = true;
}

