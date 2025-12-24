using Microsoft.Extensions.Options;
using ModernizedOne.CrossCuttings.Security.CurrentUser;
using ModernizedOne.Modules.Seguridad.Application.CurrentUserContext;
using Xunit;

namespace ModernizedOne.CrossCuttings.Tests;

public class DevCurrentUserAuthorizationServiceTests
{
    [Fact(DisplayName = "ResolveAsync_WhenEmailMatches_ReturnsContext"), Trait("Category", "Authorization")]
    public async Task ResolveAsync_WhenEmailMatches_ReturnsContext()
    {
        var identity = new CurrentUser(true, EntraObjectId: null, Email: "dev@example.com", DisplayName: "Dev User", UsuarioId: null);
        var currentUserService = new StubCurrentUserService(identity);
        var options = Options.Create(new DevAuthorizationOptions
        {
            Users =
            [
                new DevUserMapping
                {
                    Email = "dev@example.com",
                    UsuarioId = 7,
                    DisplayName = "Mapped User",
                    Instalaciones = [10, 20],
                    Roles = ["Admin"]
                }
            ]
        });

        var service = new DevCurrentUserAuthorizationService(currentUserService, options);

        var result = await service.ResolveAsync(CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(7, result!.UsuarioId);
        Assert.Equal("dev@example.com", result.Email);
        Assert.Equal("Dev User", result.DisplayName);
        Assert.Contains(10, result.Instalaciones);
        Assert.Contains("Admin", result.Roles);
    }

    [Fact(DisplayName = "ResolveAsync_WhenNoMatch_ReturnsNull"), Trait("Category", "Authorization")]
    public async Task ResolveAsync_WhenNoMatch_ReturnsNull()
    {
        var identity = new CurrentUser(true, EntraObjectId: "oid", Email: "missing@example.com", DisplayName: "Dev User", UsuarioId: null);
        var currentUserService = new StubCurrentUserService(identity);
        var options = Options.Create(new DevAuthorizationOptions { Users = [] });

        var service = new DevCurrentUserAuthorizationService(currentUserService, options);

        var result = await service.ResolveAsync(CancellationToken.None);

        Assert.Null(result);
    }

    private sealed class StubCurrentUserService(CurrentUser user) : ICurrentUserService
    {
        public ValueTask<CurrentUser> GetAsync(CancellationToken cancellationToken = default) => ValueTask.FromResult(user);
    }
}
