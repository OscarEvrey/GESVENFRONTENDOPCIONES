namespace GesvenApi.Middleware;

/// <summary>
/// Basic request logging middleware for observability.
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var inicio = DateTimeOffset.UtcNow;
        await _next(context);
        var fin = DateTimeOffset.UtcNow;

        _logger.LogInformation(
            "HTTP {Method} {Path} => {StatusCode} ({Elapsed} ms)",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            (fin - inicio).TotalMilliseconds);
    }
}