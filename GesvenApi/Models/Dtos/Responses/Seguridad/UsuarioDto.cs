namespace GesvenApi.Models.Dtos.Responses.Seguridad;

public class UsuarioDto
{
    public int UsuarioId { get; set; }

    public string Email { get; set; } = string.Empty;

    public string NombreCompleto { get; set; } = string.Empty;

    public string? NumeroEmpleado { get; set; }

    public string? Puesto { get; set; }
}
