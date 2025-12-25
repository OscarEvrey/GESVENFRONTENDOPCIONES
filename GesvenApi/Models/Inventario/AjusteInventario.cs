using GesvenApi.Models.Base;
using GesvenApi.Models.Organizacion;

namespace GesvenApi.Models.Inventario;

/// <summary>
/// Representa un ajuste de inventario por toma física.
/// </summary>
public class AjusteInventario : EntidadAuditable
{
    /// <summary>
    /// Identificador único del ajuste.
    /// </summary>
    public int AjusteId { get; set; }

    /// <summary>
    /// Id de la instalación donde se realiza el ajuste.
    /// </summary>
    public int InstalacionId { get; set; }

    /// <summary>
    /// Id del producto ajustado.
    /// </summary>
    public int ProductoId { get; set; }

    /// <summary>
    /// Tipo de ajuste: 'E' = Entrada por hallazgo, 'S' = Salida por merma/daño.
    /// </summary>
    public char TipoAjuste { get; set; }

    /// <summary>
    /// Cantidad ajustada (siempre positiva).
    /// </summary>
    public decimal Cantidad { get; set; }

    /// <summary>
    /// Stock antes del ajuste.
    /// </summary>
    public decimal StockAnterior { get; set; }

    /// <summary>
    /// Stock después del ajuste.
    /// </summary>
    public decimal StockNuevo { get; set; }

    /// <summary>
    /// Motivo del ajuste (OBLIGATORIO para auditoría).
    /// </summary>
    public string Motivo { get; set; } = string.Empty;

    /// <summary>
    /// Observaciones adicionales.
    /// </summary>
    public string? Observaciones { get; set; }

    /// <summary>
    /// Fecha y hora del ajuste.
    /// </summary>
    public DateTime FechaAjuste { get; set; }

    // Navegación
    public Instalacion? Instalacion { get; set; }
    public Producto? Producto { get; set; }
}

