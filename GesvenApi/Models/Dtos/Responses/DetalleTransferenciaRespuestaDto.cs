namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// Detalle de transferencia en respuesta.
/// </summary>
public class DetalleTransferenciaRespuestaDto
{
    public int DetalleId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public decimal CantidadEnviada { get; set; }
    public decimal? CantidadRecibida { get; set; }
}
