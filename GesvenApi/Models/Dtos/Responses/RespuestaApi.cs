using GesvenApi.Models.Common;

namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// Wrapper de respuesta estándar manteniendo compatibilidad con el contrato actual.
/// </summary>
public class RespuestaApi<T> : ApiResponse<T>
{
}
