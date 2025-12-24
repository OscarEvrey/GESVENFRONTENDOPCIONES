namespace ModernizedOne.Modules.Seguridad.Application.CurrentUserContext;

/// <summary>
/// Development-only user directory seeded from configuration.
/// </summary>
public sealed class DevAuthorizationOptions
{
    public List<DevUserMapping> Users { get; init; } = new();
}

public sealed class DevUserMapping
{
    public string? Email { get; init; }
    public string? EntraObjectId { get; init; }
    public int UsuarioId { get; init; }
    public string DisplayName { get; init; } = string.Empty;
    public List<int> Instalaciones { get; init; } = [];
    public List<string> Roles { get; init; } = [];
}
