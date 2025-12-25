namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para métricas de dashboard.
/// </summary>
public class DashboardResumenDto
{
    public int ProductosBajoStock { get; set; }
    public int OrdenesPendientes { get; set; }
    public decimal VentasMes { get; set; }
    public int VentasPendientesFacturar { get; set; }
}
