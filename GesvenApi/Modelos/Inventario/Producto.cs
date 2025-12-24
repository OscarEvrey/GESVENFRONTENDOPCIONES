using GesvenApi.Modelos.Auditoria;
using GesvenApi.Modelos.Base;

namespace GesvenApi.Modelos.Inventario;

/// <summary>
/// Representa un producto del inventario.
/// </summary>
public class Producto : EntidadAuditable
{
    /// <summary>
    /// Identificador único del producto.
    /// </summary>
    public int ProductoId { get; set; }

    /// <summary>
    /// Nombre del producto.
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Identificador de la marca.
    /// </summary>
    public int? MarcaId { get; set; }

    /// <summary>
    /// Navegación a la marca.
    /// </summary>
    public Marca? Marca { get; set; }

    /// <summary>
    /// Identificador de la unidad de medida.
    /// </summary>
    public int? UnidadId { get; set; }

    /// <summary>
    /// Navegación a la unidad de medida.
    /// </summary>
    public UnidadMedida? Unidad { get; set; }

    /// <summary>
    /// Indica si el producto es inventariable (afecta stock) o es un gasto.
    /// </summary>
    public bool EsInventariable { get; set; } = true;

    /// <summary>
    /// Identificador del estatus del producto.
    /// </summary>
    public int EstatusId { get; set; }

    /// <summary>
    /// Navegación al estatus del producto.
    /// </summary>
    public EstatusGeneral? Estatus { get; set; }

    /// <summary>
    /// Precio unitario del producto.
    /// </summary>
    public decimal PrecioUnitario { get; set; }

    /// <summary>
    /// Stock mínimo recomendado.
    /// </summary>
    public decimal StockMinimo { get; set; }

    /// <summary>
    /// Código SKU del producto.
    /// </summary>
    public string? Codigo { get; set; }

    /// <summary>
    /// Categoría del producto.
    /// </summary>
    public string? Categoria { get; set; }

    /// <summary>
    /// Identificador de la instalación a la que pertenece el producto.
    /// </summary>
    public int? InstalacionId { get; set; }

    /// <summary>
    /// Movimientos de inventario de este producto.
    /// </summary>
    public ICollection<Movimiento> Movimientos { get; set; } = new List<Movimiento>();
}
