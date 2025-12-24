namespace ModernizedOne.Modules.Seguridad.Application.CurrentUserContext;

/// <summary>
/// Resolves the authorization context (local user, roles, installations) from the current identity.
/// </summary>
public interface ICurrentUserAuthorizationService
{
    Task<CurrentUserAuthorizationContext?> ResolveAsync(CancellationToken cancellationToken);
}
