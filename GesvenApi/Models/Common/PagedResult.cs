namespace GesvenApi.Models.Common;

/// <summary>
/// Simple paged result container for future list endpoints.
/// </summary>
/// <typeparam name="T">Item type.</typeparam>
public class PagedResult<T>
{
    public IReadOnlyCollection<T> Items { get; init; } = Array.Empty<T>();

    public int PageNumber { get; init; }

    public int PageSize { get; init; }

    public int TotalCount { get; init; }
}
