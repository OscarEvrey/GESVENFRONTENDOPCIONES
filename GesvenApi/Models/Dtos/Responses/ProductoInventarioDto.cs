namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para la respuesta de productos de inventario.
/// </summary>
public class ProductoInventarioDto
{
    public int ProductoId { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string Unidad { get; set; } = string.Empty;
    public decimal StockActual { get; set; }
    public decimal StockMinimo { get; set; }
    public decimal PrecioUnitario { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
}
