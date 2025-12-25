namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para recepción de orden de compra.
/// </summary>
public class RecepcionOrdenCompraDto
{
    public List<LineaRecepcionOrdenCompraDto> Lineas { get; set; } = [];
}
