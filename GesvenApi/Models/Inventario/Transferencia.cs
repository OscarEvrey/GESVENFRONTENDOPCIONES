using GesvenApi.Models.Base;
using GesvenApi.Models.Organizacion;

namespace GesvenApi.Models.Inventario;

/// <summary>
/// Representa una transferencia de mercancía entre instalaciones.
/// </summary>
public class Transferencia : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la transferencia.
    /// </summary>
    public int TransferenciaId { get; set; }

    /// <summary>
    /// Folio único de la transferencia (ej: TRF-2024-0001).
    /// </summary>
    public string Folio { get; set; } = string.Empty;

    /// <summary>
    /// Id de la instalación origen.
    /// </summary>
    public int InstalacionOrigenId { get; set; }

    /// <summary>
    /// Id de la instalación destino.
    /// </summary>
    public int InstalacionDestinoId { get; set; }

    /// <summary>
    /// Fecha de envío de la transferencia.
    /// </summary>
    public DateTime FechaEnvio { get; set; }

    /// <summary>
    /// Fecha de recepción en destino (null si está en tránsito).
    /// </summary>
    public DateTime? FechaRecepcion { get; set; }

    /// <summary>
    /// Estatus de la transferencia (EnTransito, Recibida, Cancelada).
    /// </summary>
    public string Estatus { get; set; } = "EnTransito";

    /// <summary>
    /// Comentarios o notas adicionales.
    /// </summary>
    public string? Comentarios { get; set; }

    // Navegación
    public Instalacion? InstalacionOrigen { get; set; }
    public Instalacion? InstalacionDestino { get; set; }
    public ICollection<TransferenciaDetalle> Detalles { get; set; } = new List<TransferenciaDetalle>();
}

