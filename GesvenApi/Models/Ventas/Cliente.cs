using GesvenApi.Models.Base;

namespace GesvenApi.Models.Ventas;

/// <summary>
/// Representa un cliente del sistema.
/// </summary>
public class Cliente : EntidadAuditable
{
    /// <summary>
    /// Identificador único del cliente.
    /// </summary>
    public int ClienteId { get; set; }

    /// <summary>
    /// RFC del cliente (12 o 13 caracteres alfanuméricos).
    /// </summary>
    public string RFC { get; set; } = string.Empty;

    /// <summary>
    /// Nombre corto o alias del cliente.
    /// </summary>
    public string NombreCorto { get; set; } = string.Empty;

    /// <summary>
    /// Razón social completa.
    /// </summary>
    public string RazonSocial { get; set; } = string.Empty;

    /// <summary>
    /// Correo electrónico de contacto.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Teléfono de contacto.
    /// </summary>
    public string? Telefono { get; set; }

    /// <summary>
    /// Dirección fiscal.
    /// </summary>
    public string? Direccion { get; set; }

    /// <summary>
    /// Ciudad.
    /// </summary>
    public string? Ciudad { get; set; }

    /// <summary>
    /// Código postal.
    /// </summary>
    public string? CodigoPostal { get; set; }

    /// <summary>
    /// Nombre del contacto principal.
    /// </summary>
    public string? Contacto { get; set; }

    /// <summary>
    /// Saldo pendiente del cliente.
    /// </summary>
    public decimal Saldo { get; set; }

    /// <summary>
    /// Indica si el cliente está activo.
    /// </summary>
    public bool Activo { get; set; } = true;

    // Navegación
    public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
}

