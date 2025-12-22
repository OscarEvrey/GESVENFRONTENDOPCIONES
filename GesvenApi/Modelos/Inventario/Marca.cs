using GesvenApi.Modelos.Base;

namespace GesvenApi.Modelos.Inventario;

/// <summary>
/// Representa una marca de producto.
/// </summary>
public class Marca : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la marca.
    /// </summary>
    public int MarcaId { get; set; }

    /// <summary>
    /// Nombre de la marca.
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Productos de esta marca.
    /// </summary>
    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
