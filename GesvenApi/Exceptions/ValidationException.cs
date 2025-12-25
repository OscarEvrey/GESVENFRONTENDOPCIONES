namespace GesvenApi.Exceptions;

/// <summary>
/// Represents validation errors triggered by FluentValidation or manual checks.
/// </summary>
public class ValidationException : Exception
{
    public ValidationException(string message, IEnumerable<string>? errors = null)
        : base(message)
    {
        Errors = errors?.ToList() ?? [];
    }

    public IReadOnlyCollection<string> Errors { get; }
}
