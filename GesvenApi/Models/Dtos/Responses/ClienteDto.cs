namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para exponer un cliente.
/// </summary>
public class ClienteDto
{
    public int ClienteId { get; set; }
    public string RFC { get; set; } = string.Empty;
    public string NombreCorto { get; set; } = string.Empty;
    public string RazonSocial { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Contacto { get; set; }
    public decimal Saldo { get; set; }
    public bool Activo { get; set; }
}
