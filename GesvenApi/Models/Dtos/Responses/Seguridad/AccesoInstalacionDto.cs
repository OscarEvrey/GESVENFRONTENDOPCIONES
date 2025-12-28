namespace GesvenApi.Models.Dtos.Responses.Seguridad;

public class AccesoInstalacionDto
{
    public int AccesoId { get; set; }

    public int UsuarioId { get; set; }
    public string UsuarioNombreCompleto { get; set; } = string.Empty;
    public string UsuarioEmail { get; set; } = string.Empty;
    public string? UsuarioPuesto { get; set; }

    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;

    public int RolId { get; set; }
    public string RolNombre { get; set; } = string.Empty;

    public bool EsActivo { get; set; }
    public DateTime CreadoEn { get; set; }
    public int? CreadoPor { get; set; }
    public DateTime ActualizadoEn { get; set; }
    public int? ActualizadoPor { get; set; }
}