namespace GesvenApi.Modelos.Inventario;

/// <summary>
/// Detalle de línea de una transferencia.
/// </summary>
public class TransferenciaDetalle
{
    /// <summary>
    /// Identificador único del detalle.
    /// </summary>
    public int DetalleId { get; set; }

    /// <summary>
    /// Id de la transferencia padre.
    /// </summary>
    public int TransferenciaId { get; set; }

    /// <summary>
    /// Id del producto transferido.
    /// </summary>
    public int ProductoId { get; set; }

    /// <summary>
    /// Cantidad enviada.
    /// </summary>
    public decimal CantidadEnviada { get; set; }

    /// <summary>
    /// Cantidad recibida (puede ser diferente si hay faltante).
    /// </summary>
    public decimal? CantidadRecibida { get; set; }

    // Navegación
    public Transferencia? Transferencia { get; set; }
    public Producto? Producto { get; set; }
}
