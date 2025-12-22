using GesvenApi.Modelos.Base;
using GesvenApi.Modelos.Seguridad;

namespace GesvenApi.Modelos.Organizacion;

/// <summary>
/// Representa una instalación (Almacén u Oficina) de una sucursal.
/// </summary>
public class Instalacion : EntidadAuditable
{
    /// <summary>
    /// Identificador único de la instalación.
    /// </summary>
    public int InstalacionId { get; set; }

    /// <summary>
    /// Identificador de la sucursal a la que pertenece.
    /// </summary>
    public int SucursalId { get; set; }

    /// <summary>
    /// Navegación a la sucursal.
    /// </summary>
    public Sucursal? Sucursal { get; set; }

    /// <summary>
    /// Nombre de la instalación.
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Tipo de instalación (Almacen, Oficina).
    /// </summary>
    public string Tipo { get; set; } = string.Empty;

    /// <summary>
    /// Accesos de usuarios a esta instalación.
    /// </summary>
    public ICollection<AccesoInstalacion> Accesos { get; set; } = new List<AccesoInstalacion>();
}
