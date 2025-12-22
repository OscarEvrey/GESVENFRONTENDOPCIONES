using GesvenApi.Modelos.Base;

namespace GesvenApi.Modelos.Organizacion;

/// <summary>
/// Representa una empresa del sistema.
/// </summary>
public class Empresa : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la empresa.
    /// </summary>
    public int EmpresaId { get; set; }

    /// <summary>
    /// Nombre de la empresa.
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// RFC de la empresa.
    /// </summary>
    public string? RFC { get; set; }

    /// <summary>
    /// Sucursales de la empresa.
    /// </summary>
    public ICollection<Sucursal> Sucursales { get; set; } = new List<Sucursal>();
}
