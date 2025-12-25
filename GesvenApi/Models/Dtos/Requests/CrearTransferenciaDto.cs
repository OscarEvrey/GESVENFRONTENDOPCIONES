namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para crear una transferencia entre instalaciones.
/// </summary>
public class CrearTransferenciaDto
{
    public int InstalacionOrigenId { get; set; }
    public int InstalacionDestinoId { get; set; }
    public string? Comentarios { get; set; }
    public List<LineaTransferenciaDto> Lineas { get; set; } = [];
}
