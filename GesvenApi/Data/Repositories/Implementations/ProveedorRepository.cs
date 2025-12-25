using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Compras;

namespace GesvenApi.Data.Repositories.Implementations;

public class ProveedorRepository : Repository<Proveedor>, IProveedorRepository
{
    public ProveedorRepository(GesvenDbContext context) : base(context)
    {
    }
}
