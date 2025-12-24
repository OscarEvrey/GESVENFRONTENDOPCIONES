using GesvenApi.Modelos.Organizacion;

namespace GesvenApi.Modelos.Inventario;

/// <summary>
/// Representa un movimiento de inventario (entrada o salida).
/// </summary>
public class Movimiento
{
    /// <summary>
    /// Identificador único del movimiento.
    /// </summary>
    public int MovimientoId { get; set; }

    /// <summary>
    /// Identificador de la instalación.
    /// </summary>
    public int InstalacionId { get; set; }

    /// <summary>
    /// Navegación a la instalación.
    /// </summary>
    public Instalacion? Instalacion { get; set; }

    /// <summary>
    /// Identificador del producto.
    /// </summary>
    public int ProductoId { get; set; }

    /// <summary>
    /// Navegación al producto.
    /// </summary>
    public Producto? Producto { get; set; }

    /// <summary>
    /// Tipo de movimiento: 'E' (Entrada) o 'S' (Salida).
    /// </summary>
    public char TipoMovimiento { get; set; }

    /// <summary>
    /// Cantidad del movimiento.
    /// </summary>
    public decimal Cantidad { get; set; }

    /// <summary>
    /// Saldo final después del movimiento.
    /// </summary>
    public decimal SaldoFinal { get; set; }

    /// <summary>
    /// Costo unitario del producto en este movimiento.
    /// </summary>
    public decimal? CostoUnitario { get; set; }

    /// <summary>
    /// Número de lote.
    /// </summary>
    public string? Lote { get; set; }

    /// <summary>
    /// Fecha de caducidad.
    /// </summary>
    public DateOnly? FechaCaducidad { get; set; }

    /// <summary>
    /// Fecha y hora de creación.
    /// </summary>
    public DateTime CreadoEn { get; set; }

    /// <summary>
    /// Id del usuario que creó el movimiento.
    /// </summary>
    public int? CreadoPor { get; set; }
}
