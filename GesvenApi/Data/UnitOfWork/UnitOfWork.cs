using GesvenApi.Data.Repositories.Implementations;
using GesvenApi.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace GesvenApi.Data.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly GesvenDbContext _context;

    public UnitOfWork(
        GesvenDbContext context,
        IAjusteRepository ajustes,
        IClienteRepository clientes,
        IInstalacionRepository instalaciones,
        IMovimientoRepository movimientos,
        IOrdenCompraRepository ordenesCompra,
        IProductoRepository productos,
        IProveedorRepository proveedores,
        ITransferenciaRepository transferencias,
        IVentaRepository ventas)
    {
        _context = context;
        Ajustes = ajustes;
        Clientes = clientes;
        Instalaciones = instalaciones;
        Movimientos = movimientos;
        OrdenesCompra = ordenesCompra;
        Productos = productos;
        Proveedores = proveedores;
        Transferencias = transferencias;
        Ventas = ventas;
    }

    public IAjusteRepository Ajustes { get; }

    public IClienteRepository Clientes { get; }

    public IInstalacionRepository Instalaciones { get; }

    public IMovimientoRepository Movimientos { get; }

    public IOrdenCompraRepository OrdenesCompra { get; }

    public IProductoRepository Productos { get; }

    public IProveedorRepository Proveedores { get; }

    public ITransferenciaRepository Transferencias { get; }

    public IVentaRepository Ventas { get; }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        return _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public Task CommitTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken = default)
    {
        return transaction.CommitAsync(cancellationToken);
    }

    public Task RollbackTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken = default)
    {
        return transaction.RollbackAsync(cancellationToken);
    }

    public ValueTask DisposeAsync()
    {
        return _context.DisposeAsync();
    }
}