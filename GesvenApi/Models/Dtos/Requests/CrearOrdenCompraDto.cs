namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para crear una orden de compra.
/// </summary>
public class CrearOrdenCompraDto
{
    public int InstalacionId { get; set; }
    public int ProveedorId { get; set; }
    public string? Comentarios { get; set; }
    public List<LineaOrdenCompraDto> Lineas { get; set; } = [];
}
