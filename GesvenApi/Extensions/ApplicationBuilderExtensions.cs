using GesvenApi.Middleware;
using Microsoft.AspNetCore.Builder;

namespace GesvenApi.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<RequestLoggingMiddleware>();
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        return app;
    }
}