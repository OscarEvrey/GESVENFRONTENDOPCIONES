namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para el detalle de una venta en la respuesta.
/// </summary>
public class DetalleVentaRespuestaDto
{
    public int DetalleId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Descuento { get; set; }
    public decimal Subtotal { get; set; }
}
