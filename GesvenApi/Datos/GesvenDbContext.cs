using GesvenApi.Modelos.Auditoria;
using GesvenApi.Modelos.Base;
using GesvenApi.Modelos.Compras;
using GesvenApi.Modelos.Inventario;
using GesvenApi.Modelos.Organizacion;
using GesvenApi.Modelos.Seguridad;
using GesvenApi.Modelos.Ventas;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Datos;

/// <summary>
/// Contexto de base de datos para el sistema Gesven.
/// </summary>
public class GesvenDbContext : DbContext
{
    public GesvenDbContext(DbContextOptions<GesvenDbContext> options) : base(options)
    {
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

        // Configuración de EstatusGeneral
        modelBuilder.Entity<EstatusGeneral>(entity =>
        {
            entity.ToTable("EstatusGeneral", "Aud");
            entity.HasKey(e => e.EstatusId);
            entity.Property(e => e.Nombre).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Modulo).HasMaxLength(50).IsRequired();
        });

        // Configuración de Usuario
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("Usuario", "Seg");
            entity.HasKey(e => e.UsuarioId);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.Property(e => e.NombreCompleto).HasMaxLength(200).IsRequired();
            entity.Property(e => e.NumeroEmpleado).HasMaxLength(50);
            entity.Property(e => e.Puesto).HasMaxLength(100);
        });

        // Configuración de Rol
        modelBuilder.Entity<Rol>(entity =>
        {
            entity.ToTable("Rol", "Seg");
            entity.HasKey(e => e.RolId);
            entity.Property(e => e.Nombre).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Descripcion).HasMaxLength(200);
        });

        // Configuración de Empresa
        modelBuilder.Entity<Empresa>(entity =>
        {
            entity.ToTable("Empresa", "Org");
            entity.HasKey(e => e.EmpresaId);
            entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
            entity.Property(e => e.RFC).HasMaxLength(13);
            entity.HasIndex(e => e.RFC).IsUnique();
        });

        // Configuración de Sucursal
        modelBuilder.Entity<Sucursal>(entity =>
        {
            entity.ToTable("Sucursal", "Org");
            entity.HasKey(e => e.SucursalId);
            entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
            entity.HasOne(e => e.Empresa)
                  .WithMany(e => e.Sucursales)
                  .HasForeignKey(e => e.EmpresaId);
        });

        // Configuración de Instalacion
        modelBuilder.Entity<Instalacion>(entity =>
        {
            entity.ToTable("Instalacion", "Org");
            entity.HasKey(e => e.InstalacionId);
            entity.Property(e => e.Nombre).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Tipo).HasMaxLength(50).IsRequired();
            entity.HasOne(e => e.Sucursal)
                  .WithMany(e => e.Instalaciones)
                  .HasForeignKey(e => e.SucursalId);
        });

        // Configuración de AccesoInstalacion
        modelBuilder.Entity<AccesoInstalacion>(entity =>
        {
            entity.ToTable("AccesoInstalacion", "Seg");
            entity.HasKey(e => e.AccesoId);
            entity.HasOne(e => e.Usuario)
                  .WithMany(e => e.Accesos)
                  .HasForeignKey(e => e.UsuarioId);
            entity.HasOne(e => e.Instalacion)
                  .WithMany(e => e.Accesos)
                  .HasForeignKey(e => e.InstalacionId);
            entity.HasOne(e => e.Rol)
                  .WithMany()
                  .HasForeignKey(e => e.RolId);
        });

        // Configuración de Marca
        modelBuilder.Entity<Marca>(entity =>
        {
            entity.ToTable("Marca", "Inv");
            entity.HasKey(e => e.MarcaId);
            entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
        });

        // Configuración de UnidadMedida
        modelBuilder.Entity<UnidadMedida>(entity =>
        {
            entity.ToTable("UnidadMedida", "Inv");
            entity.HasKey(e => e.UnidadId);
            entity.Property(e => e.Nombre).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Simbolo).HasMaxLength(10).IsRequired();
        });

        // Configuración de Producto
        modelBuilder.Entity<Producto>(entity =>
        {
            entity.ToTable("Producto", "Inv");
            entity.HasKey(e => e.ProductoId);
            entity.Property(e => e.Nombre).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Codigo).HasMaxLength(50);
            entity.Property(e => e.Categoria).HasMaxLength(100);
            entity.Property(e => e.PrecioUnitario).HasPrecision(18, 4);
            entity.Property(e => e.StockMinimo).HasPrecision(18, 4);
            entity.HasOne(e => e.Marca)
                  .WithMany(e => e.Productos)
                  .HasForeignKey(e => e.MarcaId);
            entity.HasOne(e => e.Unidad)
                  .WithMany(e => e.Productos)
                  .HasForeignKey(e => e.UnidadId);
        });

        // Configuración de Movimiento
        modelBuilder.Entity<Movimiento>(entity =>
        {
            entity.ToTable("Movimiento", "Inv");
            entity.HasKey(e => e.MovimientoId);
            entity.Property(e => e.TipoMovimiento).IsRequired();
            entity.Property(e => e.Cantidad).HasPrecision(18, 4).IsRequired();
            entity.Property(e => e.SaldoFinal).HasPrecision(18, 4).IsRequired();
            entity.Property(e => e.CostoUnitario).HasPrecision(18, 4);
            entity.Property(e => e.Lote).HasMaxLength(50);
            entity.HasOne(e => e.Instalacion)
                  .WithMany()
                  .HasForeignKey(e => e.InstalacionId);
            entity.HasOne(e => e.Producto)
                  .WithMany(e => e.Movimientos)
                  .HasForeignKey(e => e.ProductoId);
        });

        // Configuración de Proveedor
        modelBuilder.Entity<Proveedor>(entity =>
        {
            entity.ToTable("Proveedor", "Comp");
            entity.HasKey(e => e.ProveedorId);
            entity.Property(e => e.Nombre).HasMaxLength(200).IsRequired();
            entity.Property(e => e.RFC).HasMaxLength(13);
            entity.HasIndex(e => e.RFC).IsUnique();
        });

        // Configuración de OrdenCompra
        modelBuilder.Entity<OrdenCompra>(entity =>
        {
            entity.ToTable("OrdenCompra", "Comp");
            entity.HasKey(e => e.OrdenCompraId);
            entity.Property(e => e.MontoTotal).HasPrecision(18, 2);
            entity.Property(e => e.Comentarios).HasMaxLength(500);
            entity.Property(e => e.MotivoRechazo).HasMaxLength(500);
            entity.HasOne(e => e.Instalacion)
                  .WithMany()
                  .HasForeignKey(e => e.InstalacionId);
            entity.HasOne(e => e.Proveedor)
                  .WithMany(e => e.OrdenesCompra)
                  .HasForeignKey(e => e.ProveedorId);
            entity.HasOne(e => e.Estatus)
                  .WithMany()
                  .HasForeignKey(e => e.EstatusId);
        });

        // Configuración de OrdenCompraDetalle
        modelBuilder.Entity<OrdenCompraDetalle>(entity =>
        {
            entity.ToTable("OrdenCompraDetalle", "Comp");
            entity.HasKey(e => e.DetalleId);
            entity.Property(e => e.CantidadSolicitada).HasPrecision(18, 4);
            entity.Property(e => e.CantidadRecibida).HasPrecision(18, 4);
            entity.Property(e => e.CostoUnitario).HasPrecision(18, 4);
            entity.HasOne(e => e.OrdenCompra)
                  .WithMany(e => e.Detalles)
                  .HasForeignKey(e => e.OrdenCompraId);
            entity.HasOne(e => e.Producto)
                  .WithMany()
                  .HasForeignKey(e => e.ProductoId);
        });

        // Configuración de Transferencia
        modelBuilder.Entity<Transferencia>(entity =>
        {
            entity.ToTable("Transferencia", "Inv");
            entity.HasKey(e => e.TransferenciaId);
            entity.Property(e => e.Folio).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Folio).IsUnique();
            entity.Property(e => e.Estatus).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Comentarios).HasMaxLength(500);
            entity.HasOne(e => e.InstalacionOrigen)
                  .WithMany()
                  .HasForeignKey(e => e.InstalacionOrigenId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.InstalacionDestino)
                  .WithMany()
                  .HasForeignKey(e => e.InstalacionDestinoId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Configuración de TransferenciaDetalle
        modelBuilder.Entity<TransferenciaDetalle>(entity =>
        {
            entity.ToTable("TransferenciaDetalle", "Inv");
            entity.HasKey(e => e.DetalleId);
            entity.Property(e => e.CantidadEnviada).HasPrecision(18, 4);
            entity.Property(e => e.CantidadRecibida).HasPrecision(18, 4);
            entity.HasOne(e => e.Transferencia)
                  .WithMany(e => e.Detalles)
                  .HasForeignKey(e => e.TransferenciaId);
            entity.HasOne(e => e.Producto)
                  .WithMany()
                  .HasForeignKey(e => e.ProductoId);
        });

        // Configuración de AjusteInventario
        modelBuilder.Entity<AjusteInventario>(entity =>
        {
            entity.ToTable("AjusteInventario", "Inv");
            entity.HasKey(e => e.AjusteId);
            entity.Property(e => e.TipoAjuste).IsRequired();
            entity.Property(e => e.Cantidad).HasPrecision(18, 4).IsRequired();
            entity.Property(e => e.StockAnterior).HasPrecision(18, 4).IsRequired();
            entity.Property(e => e.StockNuevo).HasPrecision(18, 4).IsRequired();
            entity.Property(e => e.Motivo).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Observaciones).HasMaxLength(500);
            entity.HasOne(e => e.Instalacion)
                  .WithMany()
                  .HasForeignKey(e => e.InstalacionId);
            entity.HasOne(e => e.Producto)
                  .WithMany()
                  .HasForeignKey(e => e.ProductoId);
        });

        // Configuración de Cliente
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Cliente", "Ven");
            entity.HasKey(e => e.ClienteId);
            entity.Property(e => e.RFC).HasMaxLength(13).IsRequired();
            entity.HasIndex(e => e.RFC).IsUnique();
            entity.Property(e => e.NombreCorto).HasMaxLength(50).IsRequired();
            entity.Property(e => e.RazonSocial).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Telefono).HasMaxLength(30);
            entity.Property(e => e.Direccion).HasMaxLength(300);
            entity.Property(e => e.Ciudad).HasMaxLength(100);
            entity.Property(e => e.CodigoPostal).HasMaxLength(10);
            entity.Property(e => e.Contacto).HasMaxLength(150);
            entity.Property(e => e.Saldo).HasPrecision(18, 2);
        });

        // Configuración de Venta
        modelBuilder.Entity<Venta>(entity =>
        {
            entity.ToTable("Venta", "Ven");
            entity.HasKey(e => e.VentaId);
            entity.Property(e => e.Folio).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Folio).IsUnique();
            entity.Property(e => e.MontoTotal).HasPrecision(18, 2);
            entity.Property(e => e.Comentarios).HasMaxLength(500);
            entity.HasOne(e => e.Instalacion)
                  .WithMany()
                  .HasForeignKey(e => e.InstalacionId);
            entity.HasOne(e => e.Cliente)
                  .WithMany(e => e.Ventas)
                  .HasForeignKey(e => e.ClienteId);
            entity.HasOne(e => e.Estatus)
                  .WithMany()
                  .HasForeignKey(e => e.EstatusId);
        });

        // Configuración de VentaDetalle
        modelBuilder.Entity<VentaDetalle>(entity =>
        {
            entity.ToTable("VentaDetalle", "Ven");
            entity.HasKey(e => e.DetalleId);
            entity.Property(e => e.Cantidad).HasPrecision(18, 4);
            entity.Property(e => e.PrecioUnitario).HasPrecision(18, 4);
            entity.Property(e => e.Descuento).HasPrecision(5, 2);
            entity.Property(e => e.Subtotal).HasPrecision(18, 2);
            entity.HasOne(e => e.Venta)
                  .WithMany(e => e.Detalles)
                  .HasForeignKey(e => e.VentaId);
            entity.HasOne(e => e.Producto)
                  .WithMany()
                  .HasForeignKey(e => e.ProductoId);
        });
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

        foreach (var entrada in ChangeTracker.Entries<EntidadAuditable>())
        {
            if (entrada.State == EntityState.Added)
            {
                entrada.Entity.CreadoEn = ahora;
                entrada.Entity.CreadoPor = UsuarioSistemaId;
                entrada.Entity.ActualizadoEn = ahora;
                entrada.Entity.ActualizadoPor = UsuarioSistemaId;
            }
            else if (entrada.State == EntityState.Modified)
            {
                entrada.Entity.ActualizadoEn = ahora;
                entrada.Entity.ActualizadoPor = UsuarioSistemaId;
            }
        }
    }

}

