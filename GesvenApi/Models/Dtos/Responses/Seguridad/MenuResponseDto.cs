namespace GesvenApi.Models.Dtos.Responses.Seguridad;

public class MenuResponseDto
{
    public UsuarioResumenDto Usuario { get; set; } = new();
    public List<ModuloDto> Menu { get; set; } = new();
    public List<string> Permisos { get; set; } = new();
}

public class UsuarioResumenDto
{
    public int UsuarioId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int RolId { get; set; }
    public string RolNombre { get; set; } = string.Empty;
}

public class ModuloDto
{
    public int ModuloId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Ruta { get; set; }
    public string? Icono { get; set; }
    public int Orden { get; set; }
    public int? PadreId { get; set; }
    public List<ModuloDto> Hijos { get; set; } = new();
}