using GesvenApi.Models.Base;

namespace GesvenApi.Models.Organizacion;

/// <summary>
/// Representa una sucursal de una empresa.
/// </summary>
public class Sucursal : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la sucursal.
    /// </summary>
    public int SucursalId { get; set; }

    /// <summary>
    /// Identificador de la empresa a la que pertenece.
    /// </summary>
    public int EmpresaId { get; set; }

    /// <summary>
    /// Navegación a la empresa.
    /// </summary>
    public Empresa? Empresa { get; set; }

    /// <summary>
    /// Nombre de la sucursal.
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Instalaciones de la sucursal.
    /// </summary>
    public ICollection<Instalacion> Instalaciones { get; set; } = new List<Instalacion>();
}

