using GesvenApi.Modelos.Auditoria;
using GesvenApi.Modelos.Base;
using GesvenApi.Modelos.Organizacion;

namespace GesvenApi.Modelos.Ventas;

/// <summary>
/// Representa una venta registrada en el sistema.
/// </summary>
public class Venta : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la venta.
    /// </summary>
    public int VentaId { get; set; }

    /// <summary>
    /// Folio único de la venta (ej: VTA-2024-0001).
    /// </summary>
    public string Folio { get; set; } = string.Empty;

    /// <summary>
    /// Id de la instalación donde se realiza la venta.
    /// </summary>
    public int InstalacionId { get; set; }

    /// <summary>
    /// Id del cliente.
    /// </summary>
    public int ClienteId { get; set; }

    /// <summary>
    /// Fecha de la venta.
    /// </summary>
    public DateTime FechaVenta { get; set; }

    /// <summary>
    /// Monto total de la venta.
    /// </summary>
    public decimal MontoTotal { get; set; }

    /// <summary>
    /// Id del estatus de la venta.
    /// </summary>
    public int EstatusId { get; set; }

    /// <summary>
    /// Comentarios o notas adicionales.
    /// </summary>
    public string? Comentarios { get; set; }

    // Navegación
    public Instalacion? Instalacion { get; set; }
    public Cliente? Cliente { get; set; }
    public EstatusGeneral? Estatus { get; set; }
    public ICollection<VentaDetalle> Detalles { get; set; } = new List<VentaDetalle>();
}
