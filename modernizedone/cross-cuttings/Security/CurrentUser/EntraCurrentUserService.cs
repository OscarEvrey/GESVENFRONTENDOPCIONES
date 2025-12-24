using System.Security.Claims;

namespace ModernizedOne.CrossCuttings.Security.CurrentUser;

/// <summary>
/// Production-oriented implementation of <see cref="ICurrentUserService"/> that reads identity from claims.
/// </summary>
/// <remarks>
/// This class intentionally does not perform local authorization lookup.
/// Mapping to the local Usuarios table is a separate application concern.
/// </remarks>
public sealed class EntraCurrentUserService : ICurrentUserService
{
    private readonly Func<ClaimsPrincipal?> _principalAccessor;

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    /// <param name="principalAccessor">Accessor for the current request principal.</param>
    public EntraCurrentUserService(Func<ClaimsPrincipal?> principalAccessor)
    {
        _principalAccessor = principalAccessor;
    }

    /// <inheritdoc />
    public ValueTask<CurrentUser> GetAsync(CancellationToken cancellationToken = default)
    {
        var principal = _principalAccessor();

        if (principal?.Identity?.IsAuthenticated is not true)
        {
            return ValueTask.FromResult(new CurrentUser(
                IsAuthenticated: false,
                EntraObjectId: null,
                Email: null,
                DisplayName: null,
                UsuarioId: null));
        }

        var entraObjectId = principal.FindFirstValue("oid") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = principal.FindFirstValue("preferred_username")
            ?? principal.FindFirstValue(ClaimTypes.Upn)
            ?? principal.FindFirstValue(ClaimTypes.Email);
        var displayName = principal.FindFirstValue("name") ?? principal.FindFirstValue(ClaimTypes.Name);

        return ValueTask.FromResult(new CurrentUser(
            IsAuthenticated: true,
            EntraObjectId: entraObjectId,
            Email: email,
            DisplayName: displayName,
            UsuarioId: null));
    }
}
