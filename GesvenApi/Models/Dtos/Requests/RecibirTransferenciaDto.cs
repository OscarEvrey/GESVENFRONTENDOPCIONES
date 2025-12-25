namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para actualizar recepción de transferencia.
/// </summary>
public class RecibirTransferenciaDto
{
    public List<LineaRecepcionTransferenciaDto> Lineas { get; set; } = [];
}
