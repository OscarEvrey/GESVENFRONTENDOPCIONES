using System.Net;
using GesvenApi.Exceptions;
using GesvenApi.Models.Common;

namespace GesvenApi.Middleware;

/// <summary>
/// Centralized exception handling to keep responses consistent.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await EscribirRespuestaAsync(context, HttpStatusCode.BadRequest, ex.Message, ex.Errors);
        }
        catch (BusinessException ex)
        {
            await EscribirRespuestaAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (NotFoundException ex)
        {
            await EscribirRespuestaAsync(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (UnauthorizedException ex)
        {
            await EscribirRespuestaAsync(context, HttpStatusCode.Unauthorized, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception processing {Path}", context.Request.Path);
            await EscribirRespuestaAsync(context, HttpStatusCode.InternalServerError, "Ocurrió un error interno. Intente más tarde.");
        }
    }

    private static Task EscribirRespuestaAsync(HttpContext context, HttpStatusCode status, string message, IEnumerable<string>? errors = null)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var payload = new ErrorDetails
        {
            StatusCode = context.Response.StatusCode,
            Message = message,
            Errors = errors?.ToList() ?? []
        };

        return context.Response.WriteAsync(payload.ToString());
    }
}
