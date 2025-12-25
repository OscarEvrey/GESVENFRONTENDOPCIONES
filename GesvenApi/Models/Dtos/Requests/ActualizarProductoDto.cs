namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para actualizar un producto.
/// </summary>
public class ActualizarProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public int? MarcaId { get; set; }
    public int? UnidadId { get; set; }
    public bool EsInventariable { get; set; } = true;
    public decimal PrecioUnitario { get; set; }
    public decimal StockMinimo { get; set; }
    public string? Codigo { get; set; }
    public string? Categoria { get; set; }
    public bool Activo { get; set; } = true;
}
