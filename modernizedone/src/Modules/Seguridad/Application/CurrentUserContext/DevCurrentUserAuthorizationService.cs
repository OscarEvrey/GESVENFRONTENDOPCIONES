using Microsoft.Extensions.Options;
using ModernizedOne.CrossCuttings.Security.CurrentUser;

namespace ModernizedOne.Modules.Seguridad.Application.CurrentUserContext;

/// <summary>
/// Dev-only resolver that maps identity to a configured local user.
/// </summary>
public sealed class DevCurrentUserAuthorizationService(ICurrentUserService currentUserService, IOptions<DevAuthorizationOptions> options) : ICurrentUserAuthorizationService
{
    private readonly ICurrentUserService _currentUserService = currentUserService;
    private readonly DevAuthorizationOptions _options = options.Value;

    public async Task<CurrentUserAuthorizationContext?> ResolveAsync(CancellationToken cancellationToken)
    {
        var identity = await _currentUserService.GetAsync(cancellationToken);

        if (!identity.IsAuthenticated)
        {
            return null;
        }

        var match = _options.Users.FirstOrDefault(u =>
            (!string.IsNullOrWhiteSpace(identity.Email) && string.Equals(u.Email, identity.Email, StringComparison.OrdinalIgnoreCase)) ||
            (!string.IsNullOrWhiteSpace(identity.EntraObjectId) && string.Equals(u.EntraObjectId, identity.EntraObjectId, StringComparison.OrdinalIgnoreCase)));

        if (match is null)
        {
            return null;
        }

        return new CurrentUserAuthorizationContext(
            UsuarioId: match.UsuarioId,
            Email: match.Email ?? identity.Email ?? string.Empty,
            DisplayName: identity.DisplayName ?? match.DisplayName,
            Instalaciones: match.Instalaciones,
            Roles: match.Roles);
    }
}
