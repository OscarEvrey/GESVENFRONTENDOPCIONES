namespace GesvenApi.Models.Dtos.Responses;

/// <summary>
/// Result set with pagination metadata.
/// </summary>
public class PagedResultDto<T>
{
    public required List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
