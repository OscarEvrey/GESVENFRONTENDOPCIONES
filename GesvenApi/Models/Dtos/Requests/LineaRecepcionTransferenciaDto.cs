namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para línea de recepción de transferencia.
/// </summary>
public class LineaRecepcionTransferenciaDto
{
    public int DetalleId { get; set; }
    public decimal CantidadRecibida { get; set; }
}
