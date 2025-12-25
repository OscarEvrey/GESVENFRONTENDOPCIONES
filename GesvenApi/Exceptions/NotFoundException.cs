namespace GesvenApi.Exceptions;

/// <summary>
/// Represents a missing resource scenario.
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message)
        : base(message)
    {
    }
}
