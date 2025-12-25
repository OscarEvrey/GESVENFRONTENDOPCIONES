namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para la respuesta de venta.
/// </summary>
public class VentaRespuestaDto
{
    public int VentaId { get; set; }
    public string Folio { get; set; } = string.Empty;
    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;
    public int ClienteId { get; set; }
    public string ClienteNombre { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public string Estatus { get; set; } = string.Empty;
    public DateTime FechaVenta { get; set; }
    public string? Comentarios { get; set; }
    public List<DetalleVentaRespuestaDto> Detalles { get; set; } = [];
}
