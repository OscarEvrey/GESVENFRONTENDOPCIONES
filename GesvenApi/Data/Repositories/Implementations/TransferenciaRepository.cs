using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Inventario;

namespace GesvenApi.Data.Repositories.Implementations;

public class TransferenciaRepository : Repository<Transferencia>, ITransferenciaRepository
{
    public TransferenciaRepository(GesvenDbContext context) : base(context)
    {
    }
}
