namespace ModernizedOne.CrossCuttings.Security.CurrentUser;

/// <summary>
/// Development-only implementation of <see cref="ICurrentUserService"/>.
/// </summary>
/// <remarks>
/// This implementation is designed to avoid blocking development when Entra ID is not available.
/// </remarks>
public sealed class DevCurrentUserService : ICurrentUserService
{
    private readonly Func<CurrentUser> _userFactory;

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    /// <param name="userFactory">Factory function that returns the current user.</param>
    public DevCurrentUserService(Func<CurrentUser> userFactory)
    {
        _userFactory = userFactory;
    }

    /// <inheritdoc />
    public ValueTask<CurrentUser> GetAsync(CancellationToken cancellationToken = default)
    {
        var user = _userFactory();
        return ValueTask.FromResult(user);
    }
}
