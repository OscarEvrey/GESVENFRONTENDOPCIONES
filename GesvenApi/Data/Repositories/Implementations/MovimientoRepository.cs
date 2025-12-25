using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Inventario;

namespace GesvenApi.Data.Repositories.Implementations;

public class MovimientoRepository : Repository<Movimiento>, IMovimientoRepository
{
    public MovimientoRepository(GesvenDbContext context) : base(context)
    {
    }
}
