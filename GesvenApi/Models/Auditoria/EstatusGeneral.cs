namespace GesvenApi.Models.Auditoria;

/// <summary>
/// Catálogo de estatus general para optimización de rendimiento.
/// Permite manejar estados como: Activo, Inactivo, Pendiente, Aprobada, Rechazada, Recibida.
/// </summary>
public class EstatusGeneral
{
    /// <summary>
    /// Identificador único del estatus.
    /// </summary>
    public int EstatusId { get; set; }

    /// <summary>
    /// Nombre del estatus (Activo, Inactivo, Pendiente, Recibido, etc.).
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Módulo al que pertenece el estatus (Usuarios, Compras, Ventas, General).
    /// </summary>
    public string Modulo { get; set; } = string.Empty;
}

