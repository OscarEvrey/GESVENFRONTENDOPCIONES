namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO de respuesta para ajustes de inventario.
/// </summary>
public class AjusteRespuestaDto
{
    public int AjusteId { get; set; }
    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public char TipoAjuste { get; set; }
    public decimal Cantidad { get; set; }
    public decimal StockAnterior { get; set; }
    public decimal StockNuevo { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
    public DateTime FechaAjuste { get; set; }
}
