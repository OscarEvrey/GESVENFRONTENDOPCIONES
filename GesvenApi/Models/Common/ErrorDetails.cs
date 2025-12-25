using System.Text.Json;

namespace GesvenApi.Models.Common;

/// <summary>
/// Serializable error details payload for consistent error responses.
/// </summary>
public class ErrorDetails
{
    public int StatusCode { get; set; }

    public string Message { get; set; } = string.Empty;

    public List<string> Errors { get; set; } = [];

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}