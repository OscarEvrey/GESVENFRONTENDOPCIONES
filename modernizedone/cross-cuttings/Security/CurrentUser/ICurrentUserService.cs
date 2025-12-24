namespace ModernizedOne.CrossCuttings.Security.CurrentUser;

/// <summary>
/// Abstraction to obtain the current user identity.
/// </summary>
/// <remarks>
/// In Development, this can be backed by a mock implementation.
/// In Production, this is typically sourced from Entra ID JWT claims.
/// </remarks>
public interface ICurrentUserService
{
    /// <summary>
    /// Gets the current user identity for the active request.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The current user identity (may be unauthenticated).</returns>
    ValueTask<CurrentUser> GetAsync(CancellationToken cancellationToken = default);
}
