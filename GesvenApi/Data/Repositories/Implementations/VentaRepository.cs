using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Ventas;

namespace GesvenApi.Data.Repositories.Implementations;

public class VentaRepository : Repository<Venta>, IVentaRepository
{
    public VentaRepository(GesvenDbContext context) : base(context)
    {
    }
}