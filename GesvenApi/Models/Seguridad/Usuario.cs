using GesvenApi.Models.Auditoria;
using GesvenApi.Models.Base;

namespace GesvenApi.Models.Seguridad;

/// <summary>
/// Representa un usuario del sistema.
/// </summary>
public class Usuario : EntidadAuditable
{
    /// <summary>
    /// Identificador único del usuario.
    /// </summary>
    public int UsuarioId { get; set; }

    /// <summary>
    /// Correo electrónico único del usuario.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Nombre completo del usuario.
    /// </summary>
    public string NombreCompleto { get; set; } = string.Empty;

    /// <summary>
    /// Número de empleado.
    /// </summary>
    public string? NumeroEmpleado { get; set; }

    /// <summary>
    /// Puesto del empleado.
    /// </summary>
    public string? Puesto { get; set; }

    /// <summary>
    /// Identificador del estatus del usuario.
    /// </summary>
    public int? EstatusId { get; set; }

    /// <summary>
    /// Navegación al estatus del usuario.
    /// </summary>
    public EstatusGeneral? Estatus { get; set; }

    /// <summary>
    /// Accesos a instalaciones del usuario.
    /// </summary>
    public ICollection<AccesoInstalacion> Accesos { get; set; } = new List<AccesoInstalacion>();
}

