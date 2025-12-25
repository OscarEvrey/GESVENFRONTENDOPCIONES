namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO de línea de recepción para OC.
/// </summary>
public class LineaRecepcionOrdenCompraDto
{
    public int DetalleId { get; set; }
    public decimal CantidadRecibida { get; set; }
    public string? Lote { get; set; }
    public DateOnly? FechaCaducidad { get; set; }
}
