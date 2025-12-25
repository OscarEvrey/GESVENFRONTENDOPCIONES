using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Models.Organizacion;

namespace GesvenApi.Data.Repositories.Implementations;

public class InstalacionRepository : Repository<Instalacion>, IInstalacionRepository
{
    public InstalacionRepository(GesvenDbContext context) : base(context)
    {
    }
}
