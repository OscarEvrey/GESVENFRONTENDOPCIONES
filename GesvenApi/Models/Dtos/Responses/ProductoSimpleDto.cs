namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para producto simplificado (para selectores).
/// </summary>
public class ProductoSimpleDto
{
    public int ProductoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal CostoSugerido { get; set; }
}
