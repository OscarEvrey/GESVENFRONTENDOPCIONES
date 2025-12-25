using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Inventario;

namespace GesvenApi.Data.Repositories.Implementations;

public class ProductoRepository : Repository<Producto>, IProductoRepository
{
    public ProductoRepository(GesvenDbContext context) : base(context)
    {
    }
}
