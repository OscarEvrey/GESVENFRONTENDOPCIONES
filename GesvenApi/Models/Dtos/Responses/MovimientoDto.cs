namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para consultar movimientos de inventario.
/// </summary>
public class MovimientoDto
{
    public long MovimientoId { get; set; }
    public int InstalacionId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public char TipoMovimiento { get; set; }
    public decimal Cantidad { get; set; }
    public decimal SaldoFinal { get; set; }
    public decimal? CostoUnitario { get; set; }
    public string? Lote { get; set; }
    public DateOnly? FechaCaducidad { get; set; }
    public DateTime CreadoEn { get; set; }
}
