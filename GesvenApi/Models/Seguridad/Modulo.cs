using GesvenApi.Models.Base;

namespace GesvenApi.Models.Seguridad;

/// <summary>
/// Catálogo de módulos y menús del sistema.
/// Soporta jerarquía (Padre-Hijo) para construir el menú lateral.
/// </summary>
public class Modulo : EntidadAuditable
{
    /// <summary>
    /// Identificador único del módulo.
    /// </summary>
    public int ModuloId { get; set; }

    /// <summary>
    /// Nombre visible en el menú (ej. "Ventas").
    /// </summary>
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Ruta del frontend (ej. "/ventas/dashboard").
    /// Si es nulo, suele ser un contenedor (carpeta) de otros módulos.
    /// </summary>
    public string? Ruta { get; set; }

    /// <summary>
    /// Nombre del icono (referencia a librería de iconos, ej. Lucide "LayoutDashboard").
    /// </summary>
    public string? Icono { get; set; }

    /// <summary>
    /// Orden visual en el menú.
    /// </summary>
    public int Orden { get; set; }

    /// <summary>
    /// Identificador del módulo padre (si es un submenú).
    /// </summary>
    public int? PadreId { get; set; }

    /// <summary>
    /// Navegación al módulo padre.
    /// </summary>
    public Modulo? Padre { get; set; }

    /// <summary>
    /// Estado de desarrollo del módulo (ej. "Disponible", "EnDesarrollo", "Oculto").
    /// </summary>
    public string EstadoDesarrollo { get; set; } = "Disponible";

    /// <summary>
    /// Contenido HTML/Texto para mostrar si el módulo está en desarrollo o ayuda.
    /// </summary>
    public string? ContenidoAyuda { get; set; }

    /// <summary>
    /// Indica si el módulo está activo.
    /// </summary>
    public bool EsActivo { get; set; } = true;

    /// <summary>
    /// Colección de sub-módulos (hijos).
    /// </summary>
    public ICollection<Modulo> Hijos { get; set; } = new List<Modulo>();

    /// <summary>
    /// Colección de permisos asociados a este módulo.
    /// </summary>
    public ICollection<Permiso> Permisos { get; set; } = new List<Permiso>();
}