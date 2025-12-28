namespace GesvenApi.Services.Interfaces;

/// <summary>
/// Provee el UsuarioId actual del request, con fallback a usuario del sistema.
/// </summary>
public interface IUsuarioActualService
{
    /// <summary>
    /// Obtiene el UsuarioId actual desde el contexto HTTP.
    /// </summary>
    int ObtenerUsuarioId();
}
