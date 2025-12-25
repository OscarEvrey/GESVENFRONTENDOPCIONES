namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO de respuesta para transferencias.
/// </summary>
public class TransferenciaRespuestaDto
{
    public int TransferenciaId { get; set; }
    public string Folio { get; set; } = string.Empty;
    public int InstalacionOrigenId { get; set; }
    public string InstalacionOrigenNombre { get; set; } = string.Empty;
    public int InstalacionDestinoId { get; set; }
    public string InstalacionDestinoNombre { get; set; } = string.Empty;
    public DateTime FechaEnvio { get; set; }
    public DateTime? FechaRecepcion { get; set; }
    public string Estatus { get; set; } = string.Empty;
    public string? Comentarios { get; set; }
    public List<DetalleTransferenciaRespuestaDto> Detalles { get; set; } = [];
}
