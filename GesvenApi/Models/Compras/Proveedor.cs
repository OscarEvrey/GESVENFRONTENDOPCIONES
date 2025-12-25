using GesvenApi.Models.Base;

namespace GesvenApi.Models.Compras;

/// <summary>
/// Representa un proveedor.
/// </summary>
public class Proveedor : EntidadAuditable
{
    /// <summary>
    /// Identificador único del proveedor.
    /// </summary>
    public int ProveedorId { get; set; }

    /// <summary>
    /// Nombre del proveedor.
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// RFC del proveedor.
    /// </summary>
    public string? RFC { get; set; }

    /// <summary>
    /// Órdenes de compra del proveedor.
    /// </summary>
    public ICollection<OrdenCompra> OrdenesCompra { get; set; } = new List<OrdenCompra>();
}

