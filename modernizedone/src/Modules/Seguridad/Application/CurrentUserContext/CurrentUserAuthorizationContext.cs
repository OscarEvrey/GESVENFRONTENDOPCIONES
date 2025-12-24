namespace ModernizedOne.Modules.Seguridad.Application.CurrentUserContext;

/// <summary>
/// Authorization context resolved from the identity and local database semantics.
/// </summary>
public sealed record CurrentUserAuthorizationContext(
    int UsuarioId,
    string Email,
    string DisplayName,
    IReadOnlyCollection<int> Instalaciones,
    IReadOnlyCollection<string> Roles
);
