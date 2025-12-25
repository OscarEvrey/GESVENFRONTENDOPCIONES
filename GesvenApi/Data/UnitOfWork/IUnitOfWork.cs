using GesvenApi.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace GesvenApi.Data.UnitOfWork;

public interface IUnitOfWork : IAsyncDisposable
{
    IAjusteRepository Ajustes { get; }

    IClienteRepository Clientes { get; }

    IInstalacionRepository Instalaciones { get; }

    IMovimientoRepository Movimientos { get; }

    IOrdenCompraRepository OrdenesCompra { get; }

    IProductoRepository Productos { get; }

    IProveedorRepository Proveedores { get; }

    ITransferenciaRepository Transferencias { get; }

    IVentaRepository Ventas { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);

    Task CommitTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken = default);

    Task RollbackTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken = default);
}
