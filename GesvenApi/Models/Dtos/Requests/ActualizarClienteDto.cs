namespace GesvenApi.Models.Dtos.Requests;

/// <summary>
/// DTO para actualizar un cliente.
/// </summary>
public class ActualizarClienteDto
{
    public string RFC { get; set; } = string.Empty;
    public string NombreCorto { get; set; } = string.Empty;
    public string RazonSocial { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Contacto { get; set; }
    public bool Activo { get; set; }
}
