using GesvenApi.Data.Repositories.Implementations;
using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi.Data.UnitOfWork;
using GesvenApi.Services.Implementations;
using GesvenApi.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace GesvenApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IAjusteRepository, AjusteRepository>();
        services.AddScoped<IClienteRepository, ClienteRepository>();
        services.AddScoped<IInstalacionRepository, InstalacionRepository>();
        services.AddScoped<IMovimientoRepository, MovimientoRepository>();
        services.AddScoped<IOrdenCompraRepository, OrdenCompraRepository>();
        services.AddScoped<IProductoRepository, ProductoRepository>();
        services.AddScoped<IProveedorRepository, ProveedorRepository>();
        services.AddScoped<ITransferenciaRepository, TransferenciaRepository>();
        services.AddScoped<IVentaRepository, VentaRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }

    public static IServiceCollection AddGesvenServices(this IServiceCollection services)
    {
        services.AddScoped<IEstatusLookupService, EstatusLookupService>();
        services.AddScoped<IUsuarioActualService, UsuarioActualService>();
        return services;
    }
}
