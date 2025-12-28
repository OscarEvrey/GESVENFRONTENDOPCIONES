namespace GesvenApi.Models.Dtos.Responses.Seguridad;

public class RolDto
{
    public int RolId { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public bool EsActivo { get; set; }
}
