namespace GesvenApi.Models.Dtos.Requests.Seguridad;

public class CrearAccesoInstalacionDto
{
    public int UsuarioId { get; set; }
    public int InstalacionId { get; set; }
    public int RolId { get; set; }

    public bool EsActivo { get; set; } = true;
}