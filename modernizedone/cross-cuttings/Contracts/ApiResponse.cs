namespace ModernizedOne.CrossCuttings.Contracts;

/// <summary>
/// Standard API response wrapper matching legacy RespuestaApi semantics.
/// </summary>
/// <typeparam name="T">Payload type.</typeparam>
public sealed class ApiResponse<T>
{
    public bool Exito { get; init; }

    public string Mensaje { get; init; } = string.Empty;

    public T? Datos { get; init; }

    public List<string> Errores { get; init; } = [];

    public static ApiResponse<T> Success(T? data, string message = "") => new()
    {
        Exito = true,
        Datos = data,
        Mensaje = message
    };

    public static ApiResponse<T> Failure(IEnumerable<string> errors, string message = "") => new()
    {
        Exito = false,
        Errores = errors.ToList(),
        Mensaje = message
    };
}
