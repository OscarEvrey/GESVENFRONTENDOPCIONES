using GesvenApi.Modelos.Auditoria;
using GesvenApi.Modelos.Base;
using GesvenApi.Modelos.Organizacion;

namespace GesvenApi.Modelos.Compras;

/// <summary>
/// Representa una orden de compra.
/// </summary>
public class OrdenCompra : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la orden de compra.
    /// </summary>
    public int OrdenCompraId { get; set; }

    /// <summary>
    /// Identificador de la instalación.
    /// </summary>
    public int InstalacionId { get; set; }

    /// <summary>
    /// Navegación a la instalación.
    /// </summary>
    public Instalacion? Instalacion { get; set; }

    /// <summary>
    /// Identificador del proveedor.
    /// </summary>
    public int ProveedorId { get; set; }

    /// <summary>
    /// Navegación al proveedor.
    /// </summary>
    public Proveedor? Proveedor { get; set; }

    /// <summary>
    /// Identificador del estatus de la orden.
    /// </summary>
    public int EstatusId { get; set; }

    /// <summary>
    /// Navegación al estatus.
    /// </summary>
    public EstatusGeneral? Estatus { get; set; }

    /// <summary>
    /// Monto total de la orden.
    /// </summary>
    public decimal MontoTotal { get; set; }

    /// <summary>
    /// Comentarios de la orden.
    /// </summary>
    public string? Comentarios { get; set; }

    /// <summary>
    /// Motivo de rechazo (si aplica).
    /// </summary>
    public string? MotivoRechazo { get; set; }

    /// <summary>
    /// Fecha de aprobación (si aplica).
    /// </summary>
    public DateTime? FechaAprobacion { get; set; }

    /// <summary>
    /// Fecha de rechazo (si aplica).
    /// </summary>
    public DateTime? FechaRechazo { get; set; }

    /// <summary>
    /// Detalle de la orden de compra.
    /// </summary>
    public ICollection<OrdenCompraDetalle> Detalles { get; set; } = new List<OrdenCompraDetalle>();
}
