namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para exponer un producto.
/// </summary>
public class ProductoDto
{
    public int ProductoId { get; set; }
    public int? InstalacionId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Codigo { get; set; }
    public string? Categoria { get; set; }
    public bool EsInventariable { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal StockMinimo { get; set; }
    public int? MarcaId { get; set; }
    public string? MarcaNombre { get; set; }
    public int? UnidadId { get; set; }
    public string? UnidadNombre { get; set; }
    public int? EstatusId { get; set; }
    public string EstatusNombre { get; set; } = string.Empty;
}
