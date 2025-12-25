namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para crear una venta.
/// </summary>
public class CrearVentaDto
{
    public int InstalacionId { get; set; }
    public int ClienteId { get; set; }
    public string? Comentarios { get; set; }
    public List<LineaVentaDto> Lineas { get; set; } = [];
}
