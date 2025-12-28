using GesvenApi.Models.Auditoria;
using GesvenApi.Models.Base;
using GesvenApi.Models.Compras;
using GesvenApi.Models.Inventario;
using GesvenApi.Models.Organizacion;
using GesvenApi.Models.Seguridad;
using GesvenApi.Models.Ventas;
using GesvenApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Data;

/// <summary>
/// Contexto de base de datos para el sistema Gesven.
/// </summary>
public class GesvenDbContext : DbContext
{
    private readonly IUsuarioActualService? _usuarioActualService;

    public GesvenDbContext(DbContextOptions<GesvenDbContext> options, IUsuarioActualService? usuarioActualService = null)
        : base(options)
    {
        _usuarioActualService = usuarioActualService;
    }

    // Tablas de Auditoría
    public DbSet<EstatusGeneral> EstatusGenerales { get; set; }

    // Tablas de Seguridad
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Rol> Roles { get; set; }
    public DbSet<AccesoInstalacion> AccesosInstalacion { get; set; }

    // Tablas de Organización
    public DbSet<Empresa> Empresas { get; set; }
    public DbSet<Sucursal> Sucursales { get; set; }
    public DbSet<Instalacion> Instalaciones { get; set; }

    // Tablas de Inventario
    public DbSet<Marca> Marcas { get; set; }
    public DbSet<UnidadMedida> UnidadesMedida { get; set; }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Movimiento> Movimientos { get; set; }
    public DbSet<Transferencia> Transferencias { get; set; }
    public DbSet<TransferenciaDetalle> TransferenciasDetalle { get; set; }
    public DbSet<AjusteInventario> AjustesInventario { get; set; }

    // Tablas de Compras
    public DbSet<Proveedor> Proveedores { get; set; }
    public DbSet<OrdenCompra> OrdenesCompra { get; set; }
    public DbSet<OrdenCompraDetalle> OrdenesCompraDetalle { get; set; }

    // Tablas de Ventas
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Venta> Ventas { get; set; }
    public DbSet<VentaDetalle> VentasDetalle { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
          base.OnModelCreating(modelBuilder);

          modelBuilder.ApplyConfigurationsFromAssembly(typeof(GesvenDbContext).Assembly);
        }

    /// <summary>
    /// Sobrescribe SaveChanges para aplicar auditoría automática.
    /// </summary>
    public override int SaveChanges()
    {
        AplicarAuditoria();
        return base.SaveChanges();
    }

    /// <summary>
    /// Sobrescribe SaveChangesAsync para aplicar auditoría automática.
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AplicarAuditoria();
        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Aplica automáticamente los campos de auditoría a las entidades modificadas.
    /// </summary>
    private void AplicarAuditoria()
    {
        var ahora = DateTime.UtcNow;
        var usuarioId = _usuarioActualService?.ObtenerUsuarioId() ?? UsuarioSistemaId;

        foreach (var entrada in ChangeTracker.Entries<EntidadAuditable>())
        {
            if (entrada.State == EntityState.Added)
            {
                entrada.Entity.CreadoEn = ahora;
                entrada.Entity.CreadoPor = usuarioId;
                entrada.Entity.ActualizadoEn = ahora;
                entrada.Entity.ActualizadoPor = usuarioId;
            }
            else if (entrada.State == EntityState.Modified)
            {
                entrada.Entity.ActualizadoEn = ahora;
                entrada.Entity.ActualizadoPor = usuarioId;
            }
        }
    }

}


