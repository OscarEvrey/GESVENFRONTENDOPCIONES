namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para línea de transferencia.
/// </summary>
public class LineaTransferenciaDto
{
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
}
