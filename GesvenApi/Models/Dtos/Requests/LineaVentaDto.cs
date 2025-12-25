namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para la línea de una venta.
/// </summary>
public class LineaVentaDto
{
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Descuento { get; set; }
}
