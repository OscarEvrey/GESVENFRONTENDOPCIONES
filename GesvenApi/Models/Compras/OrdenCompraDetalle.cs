using GesvenApi.Models.Inventario;

namespace GesvenApi.Models.Compras;

/// <summary>
/// Representa el detalle de una orden de compra.
/// </summary>
public class OrdenCompraDetalle
{
    /// <summary>
    /// Identificador único del detalle.
    /// </summary>
    public int DetalleId { get; set; }

    /// <summary>
    /// Identificador de la orden de compra.
    /// </summary>
    public int OrdenCompraId { get; set; }

    /// <summary>
    /// Navegación a la orden de compra.
    /// </summary>
    public OrdenCompra? OrdenCompra { get; set; }

    /// <summary>
    /// Identificador del producto.
    /// </summary>
    public int ProductoId { get; set; }

    /// <summary>
    /// Navegación al producto.
    /// </summary>
    public Producto? Producto { get; set; }

    /// <summary>
    /// Cantidad solicitada.
    /// </summary>
    public decimal CantidadSolicitada { get; set; }

    /// <summary>
    /// Cantidad recibida.
    /// </summary>
    public decimal CantidadRecibida { get; set; }

    /// <summary>
    /// Costo unitario del producto.
    /// </summary>
    public decimal CostoUnitario { get; set; }
}

