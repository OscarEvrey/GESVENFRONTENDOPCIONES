namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para el detalle de una orden de compra en la respuesta.
/// </summary>
public class DetalleOrdenCompraRespuestaDto
{
    public int DetalleId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public decimal CantidadSolicitada { get; set; }
    public decimal CostoUnitario { get; set; }
    public decimal Subtotal { get; set; }
}
