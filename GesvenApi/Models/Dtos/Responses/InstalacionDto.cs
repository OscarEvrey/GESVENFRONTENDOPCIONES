namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// DTO para la respuesta de instalaciones.
/// </summary>
public class InstalacionDto
{
    public int InstalacionId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Empresa { get; set; } = string.Empty;
    public string Sucursal { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
}
