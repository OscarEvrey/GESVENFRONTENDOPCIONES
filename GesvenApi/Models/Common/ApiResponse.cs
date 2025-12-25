namespace GesvenApi.Models.Common;

/// <summary>
/// Standard API response wrapper to align with existing RespuestaApi while enabling future extensions.
/// </summary>
/// <typeparam name="T">Payload type.</typeparam>
public class ApiResponse<T>
{
    public bool Exito { get; set; }

    public string Mensaje { get; set; } = string.Empty;

    public T? Datos { get; set; }

    public List<string> Errores { get; set; } = [];
}
