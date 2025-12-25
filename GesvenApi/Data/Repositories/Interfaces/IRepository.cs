using System.Linq.Expressions;

namespace GesvenApi.Data.Repositories.Interfaces;

/// <summary>
/// Generic repository contract for basic CRUD and querying operations.
/// </summary>
/// <typeparam name="T">Entity type.</typeparam>
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

    Task AddAsync(T entity, CancellationToken cancellationToken = default);

    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);

    void Update(T entity);

    void Remove(T entity);
}
