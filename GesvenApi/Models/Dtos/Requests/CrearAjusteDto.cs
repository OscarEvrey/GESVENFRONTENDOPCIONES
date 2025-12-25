namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para crear un ajuste de inventario.
/// </summary>
public class CrearAjusteDto
{
    public int InstalacionId { get; set; }
    public int ProductoId { get; set; }
    public char TipoAjuste { get; set; }
    public decimal Cantidad { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
}
