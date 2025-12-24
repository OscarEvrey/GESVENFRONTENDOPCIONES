using Microsoft.Extensions.Options;
using ModernizedOne.CrossCuttings.Security.CurrentUser;

namespace ModernizedOne.Api.Extensions;

/// <summary>
/// DI helpers for current user resolution.
/// </summary>
public static class CurrentUserServiceCollectionExtensions
{
    /// <summary>
    /// Registers the current user provider choosing the implementation per environment.
    /// </summary>
    public static IServiceCollection AddCurrentUserProvider(this IServiceCollection services, IWebHostEnvironment environment)
    {
        ArgumentNullException.ThrowIfNull(environment);

        services.AddHttpContextAccessor();

        services.AddScoped<ICurrentUserService>(sp =>
        {
            var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();

            if (!environment.IsDevelopment())
            {
                return new EntraCurrentUserService(() => httpContextAccessor.HttpContext?.User);
            }

            var options = sp.GetRequiredService<IOptions<DevCurrentUserOptions>>().Value;

            return new DevCurrentUserService(() => BuildDevUser(httpContextAccessor.HttpContext, options));
        });

        return services;
    }

    /// <summary>
    /// Binds configuration to development current user options.
    /// </summary>
    public static IServiceCollection AddDevCurrentUserOptions(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        services.AddOptions<DevCurrentUserOptions>()
            .Bind(configuration.GetSection("DevAuthentication"))
            .ValidateDataAnnotations();

        return services;
    }

    private static CurrentUser BuildDevUser(HttpContext? httpContext, DevCurrentUserOptions options)
    {
        if (!options.Enabled)
        {
            return new CurrentUser(IsAuthenticated: false, EntraObjectId: null, Email: null, DisplayName: null, UsuarioId: null);
        }

        var headers = httpContext?.Request?.Headers;

        string? ResolveHeader(string key)
        {
            if (headers is null)
            {
                return null;
            }

            return headers.TryGetValue(key, out var values) ? values.FirstOrDefault() : null;
        }

        var email = ResolveHeader("X-Dev-Email") ?? options.Email;
        var displayName = ResolveHeader("X-Dev-DisplayName") ?? options.DisplayName ?? email;
        var entraObjectId = ResolveHeader("X-Dev-Oid") ?? options.EntraObjectId;
        var usuarioIdHeader = ResolveHeader("X-Dev-UsuarioId");

        int? resolvedUsuarioId = options.UsuarioId;

        if (int.TryParse(usuarioIdHeader, out var parsedUsuarioId))
        {
            resolvedUsuarioId = parsedUsuarioId;
        }

        return new CurrentUser(
            IsAuthenticated: !string.IsNullOrWhiteSpace(email) || !string.IsNullOrWhiteSpace(entraObjectId),
            EntraObjectId: entraObjectId,
            Email: email,
            DisplayName: displayName,
            UsuarioId: resolvedUsuarioId);
    }
}
