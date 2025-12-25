namespace GesvenApi.Exceptions;

/// <summary>
/// Represents an authorization failure.
/// </summary>
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message)
        : base(message)
    {
    }
}