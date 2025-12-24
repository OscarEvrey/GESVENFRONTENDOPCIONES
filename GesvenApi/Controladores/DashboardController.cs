using GesvenApi.Datos;
using GesvenApi.DTOs;
using GesvenApi.Servicios;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controladores;

/// <summary>
/// Controlador para KPIs del dashboard.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
    private readonly IEstatusLookupService _estatusLookup;

    public DashboardController(GesvenDbContext contexto, IEstatusLookupService estatusLookup)
    {
        _contexto = contexto;
        _estatusLookup = estatusLookup;
    }

    /// <summary>
    /// GET /api/dashboard/resumen
    /// Devuelve indicadores rápidos.
    /// </summary>
    [HttpGet("resumen")]
    [ProducesResponseType(typeof(RespuestaApi<DashboardResumenDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<DashboardResumenDto>>> ObtenerResumen([FromQuery] int? instalacionId = null)
    {
        var fechaInicioMes = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

        var estatusPendienteCompras = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Pendiente, "Compras");
        var estatusPendienteVentas = await _estatusLookup.ObtenerIdAsync(EstatusNombres.Pendiente, "Ventas");

        var ordenesPendientes = await _contexto.OrdenesCompra
            .CountAsync(o => o.EstatusId == estatusPendienteCompras && (!instalacionId.HasValue || o.InstalacionId == instalacionId.Value));

        var ventasMes = await _contexto.Ventas
            .Where(v => v.FechaVenta >= fechaInicioMes && (!instalacionId.HasValue || v.InstalacionId == instalacionId.Value))
            .SumAsync(v => (decimal?)v.MontoTotal) ?? 0;

        var ventasPendientesFacturar = await _contexto.Ventas
            .CountAsync(v => v.EstatusId == estatusPendienteVentas && (!instalacionId.HasValue || v.InstalacionId == instalacionId.Value));

        var stocks = await _contexto.Movimientos
            .Where(m => !instalacionId.HasValue || m.InstalacionId == instalacionId.Value)
            .GroupBy(m => m.ProductoId)
            .Select(g => new
            {
                ProductoId = g.Key,
                Saldo = g.OrderByDescending(m => m.MovimientoId).Select(m => m.SaldoFinal).FirstOrDefault()
            })
            .ToListAsync();

        var productos = await _contexto.Productos
            .Where(p => !instalacionId.HasValue || p.InstalacionId == instalacionId.Value)
            .ToListAsync();

        var bajoStock = productos
            .Select(p =>
            {
                var saldo = stocks.FirstOrDefault(s => s.ProductoId == p.ProductoId)?.Saldo ?? 0;
                return new { p.ProductoId, saldo, p.StockMinimo };
            })
            .Count(x => x.saldo <= x.StockMinimo);

        var resumen = new DashboardResumenDto
        {
            ProductosBajoStock = bajoStock,
            OrdenesPendientes = ordenesPendientes,
            VentasMes = ventasMes,
            VentasPendientesFacturar = ventasPendientesFacturar
        };

        return Ok(new RespuestaApi<DashboardResumenDto>
        {
            Exito = true,
            Mensaje = "Resumen calculado",
            Datos = resumen
        });
    }
}