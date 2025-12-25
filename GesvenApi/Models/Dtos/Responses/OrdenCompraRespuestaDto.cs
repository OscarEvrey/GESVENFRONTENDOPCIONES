namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para la respuesta de una orden de compra creada.
/// </summary>
public class OrdenCompraRespuestaDto
{
    public int OrdenCompraId { get; set; }
    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;
    public int ProveedorId { get; set; }
    public string ProveedorNombre { get; set; } = string.Empty;
    public string Estatus { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public string? Comentarios { get; set; }
    public DateTime CreadoEn { get; set; }
    public List<DetalleOrdenCompraRespuestaDto> Detalles { get; set; } = [];
}
