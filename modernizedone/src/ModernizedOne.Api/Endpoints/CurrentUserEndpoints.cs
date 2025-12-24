using Microsoft.AspNetCore.Http.HttpResults;
using ModernizedOne.CrossCuttings.Contracts;
using ModernizedOne.CrossCuttings.Security.CurrentUser;
using ModernizedOne.Modules.Seguridad.Application.CurrentUserContext;

namespace ModernizedOne.Api.Endpoints;

/// <summary>
/// Endpoints related to the current user context.
/// </summary>
public static class CurrentUserEndpoints
{
    /// <summary>
    /// Maps endpoints that expose current user information.
    /// </summary>
    public static RouteGroupBuilder MapCurrentUserEndpoints(this RouteGroupBuilder group)
    {
        var currentUser = group.MapGroup("/current-user").WithTags("CurrentUser");

        currentUser.MapGet("/", async Task<Results<Ok<CurrentUser>, UnauthorizedHttpResult>> (ICurrentUserService currentUserService, CancellationToken cancellationToken) =>
        {
            var user = await currentUserService.GetAsync(cancellationToken);

            if (!user.IsAuthenticated)
            {
                return TypedResults.Unauthorized();
            }

            return TypedResults.Ok(user);
        })
        .WithName("GetCurrentUser")
        .WithSummary("Returns the current identity as seen by the application.")
        .WithOpenApi();

        currentUser.MapGet("/context", async Task<Results<Ok<ApiResponse<CurrentUserAuthorizationContext>>, UnauthorizedHttpResult, NotFound<ApiResponse<CurrentUserAuthorizationContext>>>> (ICurrentUserAuthorizationService authorizationService, CancellationToken cancellationToken) =>
        {
            CurrentUserAuthorizationContext? context;

            try
            {
                context = await authorizationService.ResolveAsync(cancellationToken);
            }
            catch (NotImplementedException)
            {
                return TypedResults.NotFound(ApiResponse<CurrentUserAuthorizationContext>.Failure(["Authorization resolver not available."], "Mapping not implemented."));
            }

            if (context is null)
            {
                return TypedResults.Unauthorized();
            }

            return TypedResults.Ok(ApiResponse<CurrentUserAuthorizationContext>.Success(context));
        })
        .WithName("GetAuthorizationContext")
        .WithSummary("Resolves the current user's local authorization context.")
        .WithOpenApi();

        currentUser.MapGet("/ping", () => Results.Ok(new
        {
            status = "ok",
            serverTimeUtc = DateTimeOffset.UtcNow
        }))
        .WithName("Ping")
        .WithSummary("Simple liveness check.")
        .WithOpenApi();

        return group;
    }
}
