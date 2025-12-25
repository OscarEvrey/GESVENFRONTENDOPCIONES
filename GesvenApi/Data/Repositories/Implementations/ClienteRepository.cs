using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Ventas;

namespace GesvenApi.Data.Repositories.Implementations;

public class ClienteRepository : Repository<Cliente>, IClienteRepository
{
    public ClienteRepository(GesvenDbContext context) : base(context)
    {
    }
}
