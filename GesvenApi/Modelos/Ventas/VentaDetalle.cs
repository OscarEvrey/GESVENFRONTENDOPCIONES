using GesvenApi.Modelos.Inventario;

namespace GesvenApi.Modelos.Ventas;

/// <summary>
/// Detalle de línea de una venta.
/// </summary>
public class VentaDetalle
{
    /// <summary>
    /// Identificador único del detalle.
    /// </summary>
    public int DetalleId { get; set; }

    /// <summary>
    /// Id de la venta padre.
    /// </summary>
    public int VentaId { get; set; }

    /// <summary>
    /// Id del producto vendido.
    /// </summary>
    public int ProductoId { get; set; }

    /// <summary>
    /// Cantidad vendida.
    /// </summary>
    public decimal Cantidad { get; set; }

    /// <summary>
    /// Precio unitario de venta.
    /// </summary>
    public decimal PrecioUnitario { get; set; }

    /// <summary>
    /// Porcentaje de descuento aplicado.
    /// </summary>
    public decimal Descuento { get; set; }

    /// <summary>
    /// Subtotal de la línea (Cantidad * PrecioUnitario * (1 - Descuento/100)).
    /// </summary>
    public decimal Subtotal { get; set; }

    // Navegación
    public Venta? Venta { get; set; }
    public Producto? Producto { get; set; }
}
