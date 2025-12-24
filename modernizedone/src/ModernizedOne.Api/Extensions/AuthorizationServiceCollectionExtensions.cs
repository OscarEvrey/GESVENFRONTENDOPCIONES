using Microsoft.Extensions.Options;
using ModernizedOne.Modules.Seguridad.Application.CurrentUserContext;

namespace ModernizedOne.Api.Extensions;

/// <summary>
/// DI helpers for authorization context resolution.
/// </summary>
public static class AuthorizationServiceCollectionExtensions
{
    public static IServiceCollection AddAuthorizationContext(this IServiceCollection services, IWebHostEnvironment environment, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(environment);
        ArgumentNullException.ThrowIfNull(configuration);

        services.AddOptions<DevAuthorizationOptions>()
            .Bind(configuration.GetSection("DevAuthorization"))
            .ValidateDataAnnotations();

        if (environment.IsDevelopment())
        {
            services.AddScoped<ICurrentUserAuthorizationService, DevCurrentUserAuthorizationService>();
        }
        else
        {
            services.AddScoped<ICurrentUserAuthorizationService, NotImplementedAuthorizationService>();
        }

        return services;
    }
}

internal sealed class NotImplementedAuthorizationService : ICurrentUserAuthorizationService
{
    public Task<CurrentUserAuthorizationContext?> ResolveAsync(CancellationToken cancellationToken)
    {
        throw new NotImplementedException("Production authorization resolver not yet implemented.");
    }
}
