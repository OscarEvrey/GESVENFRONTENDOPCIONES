using Microsoft.AspNetCore.Http;
using GesvenApi.Services.Interfaces;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Services.Implementations;

public class UsuarioActualService : IUsuarioActualService
{
    private const string HeaderUsuarioId = "X-Gesven-UsuarioId";
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UsuarioActualService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int ObtenerUsuarioId()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            return UsuarioSistemaId;
        }

        if (!httpContext.Request.Headers.TryGetValue(HeaderUsuarioId, out var usuarioIdHeader))
        {
            return UsuarioSistemaId;
        }

        return int.TryParse(usuarioIdHeader.FirstOrDefault(), out var parsed) && parsed > 0
            ? parsed
            : UsuarioSistemaId;
    }
}
