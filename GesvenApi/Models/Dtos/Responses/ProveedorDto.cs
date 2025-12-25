namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para proveedor.
/// </summary>
public class ProveedorDto
{
    public int ProveedorId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? RFC { get; set; }
}
