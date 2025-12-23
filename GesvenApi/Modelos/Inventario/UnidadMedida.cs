namespace GesvenApi.Modelos.Inventario;

/// <summary>
/// Representa una unidad de medida.
/// </summary>
public class UnidadMedida
{
    /// <summary>
    /// Identificador único de la unidad.
    /// </summary>
    public int UnidadId { get; set; }

    /// <summary>
    /// Nombre de la unidad (Pieza, Kilogramo, Litro, etc.).
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Símbolo de la unidad (Pza, Kg, L, etc.).
    /// </summary>
    public string Simbolo { get; set; } = string.Empty;

    /// <summary>
    /// Productos que usan esta unidad.
    /// </summary>
    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
