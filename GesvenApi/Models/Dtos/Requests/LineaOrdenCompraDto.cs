namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para una línea de orden de compra.
/// </summary>
public class LineaOrdenCompraDto
{
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
    public decimal CostoUnitario { get; set; }
}
