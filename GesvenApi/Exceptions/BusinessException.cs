namespace GesvenApi.Exceptions;

/// <summary>
/// Represents a domain/business rule violation.
/// </summary>
public class BusinessException : Exception
{
    public BusinessException(string message)
        : base(message)
    {
    }

    public BusinessException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
