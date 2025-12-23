namespace GesvenApi.Modelos.Base;

/// <summary>
/// Clase base para entidades que requieren auditoría de creación y modificación.
/// </summary>
public abstract class EntidadAuditable
{
    /// <summary>
    /// Fecha y hora de creación del registro.
    /// </summary>
    public DateTime CreadoEn { get; set; }

    /// <summary>
    /// Id del usuario que creó el registro.
    /// </summary>
    public int? CreadoPor { get; set; }

    /// <summary>
    /// Fecha y hora de la última actualización del registro.
    /// </summary>
    public DateTime ActualizadoEn { get; set; }

    /// <summary>
    /// Id del usuario que actualizó el registro por última vez.
    /// </summary>
    public int? ActualizadoPor { get; set; }
}
