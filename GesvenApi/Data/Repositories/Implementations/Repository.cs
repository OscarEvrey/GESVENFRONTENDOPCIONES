using System.Linq.Expressions;
using GesvenApi.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Data.Repositories.Implementations;

/// <summary>
/// Generic repository implementation backed by Entity Framework Core.
/// </summary>
/// <typeparam name="T">Entity type.</typeparam>
public class Repository<T> : IRepository<T> where T : class
{
    private readonly GesvenDbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(GesvenDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return _dbSet.FindAsync([id], cancellationToken).AsTask();
    }

    public async Task<IReadOnlyCollection<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
        return items;
    }

    public async Task<IReadOnlyCollection<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        var items = await _dbSet.AsNoTracking().Where(predicate).ToListAsync(cancellationToken);
        return items;
    }

    public Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        return _dbSet.AddAsync(entity, cancellationToken).AsTask();
    }

    public Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        return _dbSet.AddRangeAsync(entities, cancellationToken);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Remove(T entity)
    {
        _dbSet.Remove(entity);
    }
}