using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Inventario;

namespace GesvenApi.Data.Repositories.Implementations;

public class AjusteRepository : Repository<AjusteInventario>, IAjusteRepository
{
    public AjusteRepository(GesvenDbContext context) : base(context)
    {
    }
}
