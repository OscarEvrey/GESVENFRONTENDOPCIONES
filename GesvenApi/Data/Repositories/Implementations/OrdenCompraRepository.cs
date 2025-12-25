using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Compras;

namespace GesvenApi.Data.Repositories.Implementations;

public class OrdenCompraRepository : Repository<OrdenCompra>, IOrdenCompraRepository
{
    public OrdenCompraRepository(GesvenDbContext context) : base(context)
    {
    }
}
