namespace ModernizedOne.CrossCuttings.Security.CurrentUser;

/// <summary>
/// Represents the currently authenticated identity as seen by the application.
/// </summary>
/// <param name="IsAuthenticated">Whether the request is authenticated.</param>
/// <param name="EntraObjectId">The Entra ID object id (OID) claim, when available.</param>
/// <param name="Email">The email/username claim, when available.</param>
/// <param name="DisplayName">The display name claim, when available.</param>
/// <param name="UsuarioId">
/// The local database user id once the identity has been mapped to the local Usuarios table.
/// This is intentionally nullable because mapping is an authorization concern.
/// </param>
public sealed record CurrentUser(
    bool IsAuthenticated,
    string? EntraObjectId,
    string? Email,
    string? DisplayName,
    int? UsuarioId
);
