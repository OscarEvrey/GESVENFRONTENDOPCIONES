using System.ComponentModel.DataAnnotations;

namespace ModernizedOne.CrossCuttings.Security.CurrentUser;

/// <summary>
/// Options to configure the development-only current user behavior.
/// </summary>
public sealed class DevCurrentUserOptions
{
    /// <summary>
    /// Whether the mock authentication is enabled in the development environment.
    /// </summary>
    [Required]
    public bool Enabled { get; init; } = true;

    /// <summary>
    /// Default email used when no header override is provided.
    /// </summary>
    [EmailAddress]
    public string? Email { get; init; }

    /// <summary>
    /// Default display name used when no header override is provided.
    /// </summary>
    public string? DisplayName { get; init; }

    /// <summary>
    /// Optional Entra Object Id to simulate identity mapping.
    /// </summary>
    public string? EntraObjectId { get; init; }

    /// <summary>
    /// Optional local user identifier to simulate database mapping.
    /// </summary>
    public int? UsuarioId { get; init; }
}
