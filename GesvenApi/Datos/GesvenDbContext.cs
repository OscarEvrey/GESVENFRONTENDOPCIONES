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

        // Datos Semilla
        SembrarDatos(modelBuilder);
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

    /// <summary>
    /// Configura los datos semilla para la base de datos.
    /// </summary>
    private static void SembrarDatos(ModelBuilder modelBuilder)
    {
        // Estatus Generales
        modelBuilder.Entity<EstatusGeneral>().HasData(
            new EstatusGeneral { EstatusId = 1, Nombre = "Activo", Modulo = "General" },
            new EstatusGeneral { EstatusId = 2, Nombre = "Inactivo", Modulo = "General" },
            new EstatusGeneral { EstatusId = 3, Nombre = "Pendiente", Modulo = "Compras" },
            new EstatusGeneral { EstatusId = 4, Nombre = "Aprobada", Modulo = "Compras" },
            new EstatusGeneral { EstatusId = 5, Nombre = "Rechazada", Modulo = "Compras" },
            new EstatusGeneral { EstatusId = 6, Nombre = "Recibida", Modulo = "Compras" },
            // Estatus de Ventas
            new EstatusGeneral { EstatusId = 7, Nombre = "Pendiente", Modulo = "Ventas" },
            new EstatusGeneral { EstatusId = 8, Nombre = "Facturada", Modulo = "Ventas" },
            new EstatusGeneral { EstatusId = 9, Nombre = "Cancelada", Modulo = "Ventas" },
            // Estatus de Transferencias
            new EstatusGeneral { EstatusId = 10, Nombre = "EnTransito", Modulo = "Transferencias" },
            new EstatusGeneral { EstatusId = 11, Nombre = "Recibida", Modulo = "Transferencias" },
            new EstatusGeneral { EstatusId = 12, Nombre = "Cancelada", Modulo = "Transferencias" }
        );

        // Usuario del sistema
        var fechaSistema = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        modelBuilder.Entity<Usuario>().HasData(
            new Usuario
            {
                UsuarioId = 1,
                Email = "sistema@gesven.mx",
                NombreCompleto = "Usuario Sistema",
                NumeroEmpleado = "SYS001",
                Puesto = "Sistema",
                EstatusId = 1,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            }
        );

        // Rol de administrador
        modelBuilder.Entity<Rol>().HasData(
            new Rol
            {
                RolId = 1,
                Nombre = "Administrador",
                Descripcion = "Acceso completo al sistema",
                EsActivo = true,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            }
        );

        // Empresas
        modelBuilder.Entity<Empresa>().HasData(
            new Empresa
            {
                EmpresaId = 1,
                Nombre = "SCC",
                RFC = "SCC010101XXX",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Empresa
            {
                EmpresaId = 2,
                Nombre = "Vaxsa",
                RFC = "VAX010101YYY",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            }
        );

        // Sucursales
        modelBuilder.Entity<Sucursal>().HasData(
            new Sucursal
            {
                SucursalId = 1,
                EmpresaId = 1,
                Nombre = "Monterrey",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Sucursal
            {
                SucursalId = 2,
                EmpresaId = 2,
                Nombre = "Monterrey",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            }
        );

        // Las 4 Instalaciones Base
        modelBuilder.Entity<Instalacion>().HasData(
            new Instalacion
            {
                InstalacionId = 1,
                SucursalId = 1,
                Nombre = "Almacen-SCC-MTY",
                Tipo = "Almacen",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Instalacion
            {
                InstalacionId = 2,
                SucursalId = 1,
                Nombre = "Oficinas-SCC-MTY",
                Tipo = "Oficina",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Instalacion
            {
                InstalacionId = 3,
                SucursalId = 2,
                Nombre = "Almacen-Vaxsa-MTY",
                Tipo = "Almacen",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Instalacion
            {
                InstalacionId = 4,
                SucursalId = 2,
                Nombre = "Oficinas-Vaxsa-MTY",
                Tipo = "Oficina",
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            }
        );

        // Accesos del Usuario Sistema a todas las instalaciones
        modelBuilder.Entity<AccesoInstalacion>().HasData(
            new AccesoInstalacion
            {
                AccesoId = 1,
                UsuarioId = 1,
                InstalacionId = 1,
                RolId = 1,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new AccesoInstalacion
            {
                AccesoId = 2,
                UsuarioId = 1,
                InstalacionId = 2,
                RolId = 1,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new AccesoInstalacion
            {
                AccesoId = 3,
                UsuarioId = 1,
                InstalacionId = 3,
                RolId = 1,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new AccesoInstalacion
            {
                AccesoId = 4,
                UsuarioId = 1,
                InstalacionId = 4,
                RolId = 1,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            }
        );

        // Unidades de Medida
        modelBuilder.Entity<UnidadMedida>().HasData(
            new UnidadMedida { UnidadId = 1, Nombre = "Pieza", Simbolo = "Pza" },
            new UnidadMedida { UnidadId = 2, Nombre = "Kilogramo", Simbolo = "Kg" },
            new UnidadMedida { UnidadId = 3, Nombre = "Litro", Simbolo = "L" },
            new UnidadMedida { UnidadId = 4, Nombre = "Paquete", Simbolo = "Paq" },
            new UnidadMedida { UnidadId = 5, Nombre = "Caja", Simbolo = "Cja" },
            new UnidadMedida { UnidadId = 6, Nombre = "Bolsa", Simbolo = "Bls" },
            new UnidadMedida { UnidadId = 7, Nombre = "Frasco", Simbolo = "Fco" }
        );

        // Marcas
        modelBuilder.Entity<Marca>().HasData(
            new Marca { MarcaId = 1, Nombre = "Coca-Cola", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 2, Nombre = "Pepsi", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 3, Nombre = "Sabritas", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 4, Nombre = "Barcel", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 5, Nombre = "Jumex", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 6, Nombre = "BIC", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 7, Nombre = "HP", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 8, Nombre = "Nescafé", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Marca { MarcaId = 9, Nombre = "Genérico", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 }
        );

        // Proveedores
        modelBuilder.Entity<Proveedor>().HasData(
            new Proveedor { ProveedorId = 1, Nombre = "Aceros del Norte SA", RFC = "ANO010101AAA", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Proveedor { ProveedorId = 2, Nombre = "Distribuidora de Papelería Omega", RFC = "DPO020202BBB", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Proveedor { ProveedorId = 3, Nombre = "Comercializadora de Bebidas del Golfo", RFC = "CBG030303CCC", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Proveedor { ProveedorId = 4, Nombre = "Suministros Industriales MTY", RFC = "SIM040404DDD", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Proveedor { ProveedorId = 5, Nombre = "Alimentos y Snacks del Pacífico", RFC = "ASP050505EEE", CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 }
        );

        // Productos de Almacén (Refrescos y Snacks)
        modelBuilder.Entity<Producto>().HasData(
            // Productos para Almacen-SCC-MTY (InstalacionId = 1)
            new Producto { ProductoId = 1, Nombre = "Coca-Cola 600ml", MarcaId = 1, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 18.50m, StockMinimo = 500, Codigo = "REF-001", Categoria = "Refrescos", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 2, Nombre = "Pepsi 600ml", MarcaId = 2, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 17.50m, StockMinimo = 400, Codigo = "REF-002", Categoria = "Refrescos", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 3, Nombre = "Sprite 600ml", MarcaId = 1, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 17.00m, StockMinimo = 300, Codigo = "REF-003", Categoria = "Refrescos", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 4, Nombre = "Fanta Naranja 600ml", MarcaId = 1, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 17.00m, StockMinimo = 200, Codigo = "REF-004", Categoria = "Refrescos", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 5, Nombre = "Agua Ciel 1L", MarcaId = 1, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 12.00m, StockMinimo = 800, Codigo = "REF-005", Categoria = "Agua", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 6, Nombre = "Sabritas Original 45g", MarcaId = 3, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 15.00m, StockMinimo = 300, Codigo = "SNK-001", Categoria = "Snacks", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 7, Nombre = "Doritos Nacho 62g", MarcaId = 3, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 18.50m, StockMinimo = 200, Codigo = "SNK-002", Categoria = "Snacks", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 8, Nombre = "Cheetos Flamin Hot 52g", MarcaId = 3, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 16.00m, StockMinimo = 150, Codigo = "SNK-003", Categoria = "Snacks", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 9, Nombre = "Ruffles Queso 45g", MarcaId = 3, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 15.50m, StockMinimo = 200, Codigo = "SNK-004", Categoria = "Snacks", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 10, Nombre = "Takis Fuego 68g", MarcaId = 4, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 19.00m, StockMinimo = 150, Codigo = "SNK-005", Categoria = "Snacks", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 11, Nombre = "Jumex Mango 335ml", MarcaId = 5, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 14.50m, StockMinimo = 200, Codigo = "REF-006", Categoria = "Jugos", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 12, Nombre = "Del Valle Naranja 1L", MarcaId = 1, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 28.00m, StockMinimo = 100, Codigo = "REF-007", Categoria = "Jugos", InstalacionId = 1, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },

            // Productos para Oficinas-SCC-MTY (InstalacionId = 2)
            new Producto { ProductoId = 13, Nombre = "Hojas Blancas Carta (500)", MarcaId = 9, UnidadId = 4, EsInventariable = true, EstatusId = 1, PrecioUnitario = 95.00m, StockMinimo = 20, Codigo = "PAP-001", Categoria = "Papelería", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 14, Nombre = "Plumas BIC Azul (12)", MarcaId = 6, UnidadId = 5, EsInventariable = true, EstatusId = 1, PrecioUnitario = 48.00m, StockMinimo = 10, Codigo = "PAP-002", Categoria = "Papelería", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 15, Nombre = "Lápices #2 (12)", MarcaId = 9, UnidadId = 5, EsInventariable = true, EstatusId = 1, PrecioUnitario = 35.00m, StockMinimo = 15, Codigo = "PAP-003", Categoria = "Papelería", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 16, Nombre = "Folders Carta (25)", MarcaId = 9, UnidadId = 4, EsInventariable = true, EstatusId = 1, PrecioUnitario = 85.00m, StockMinimo = 10, Codigo = "PAP-004", Categoria = "Papelería", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 17, Nombre = "Clips Jumbo (100)", MarcaId = 9, UnidadId = 5, EsInventariable = true, EstatusId = 1, PrecioUnitario = 25.00m, StockMinimo = 5, Codigo = "PAP-005", Categoria = "Papelería", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 18, Nombre = "Toner HP 85A", MarcaId = 7, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 650.00m, StockMinimo = 5, Codigo = "CON-001", Categoria = "Consumibles", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 19, Nombre = "Cartucho Canon PG-245", MarcaId = 9, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 380.00m, StockMinimo = 5, Codigo = "CON-002", Categoria = "Consumibles", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 20, Nombre = "Cinta para Empaque (6)", MarcaId = 9, UnidadId = 4, EsInventariable = true, EstatusId = 1, PrecioUnitario = 120.00m, StockMinimo = 10, Codigo = "CON-003", Categoria = "Consumibles", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 21, Nombre = "Post-it Colores (5)", MarcaId = 9, UnidadId = 4, EsInventariable = true, EstatusId = 1, PrecioUnitario = 75.00m, StockMinimo = 8, Codigo = "PAP-006", Categoria = "Papelería", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 22, Nombre = "Café Nescafé Clásico 200g", MarcaId = 8, UnidadId = 7, EsInventariable = true, EstatusId = 1, PrecioUnitario = 145.00m, StockMinimo = 5, Codigo = "CON-004", Categoria = "Consumibles", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 23, Nombre = "Azúcar 1kg", MarcaId = 9, UnidadId = 6, EsInventariable = true, EstatusId = 1, PrecioUnitario = 35.00m, StockMinimo = 3, Codigo = "CON-005", Categoria = "Consumibles", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 24, Nombre = "Vasos Desechables (50)", MarcaId = 9, UnidadId = 4, EsInventariable = true, EstatusId = 1, PrecioUnitario = 45.00m, StockMinimo = 4, Codigo = "CON-006", Categoria = "Consumibles", InstalacionId = 2, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },

            // Productos para Almacen-Vaxsa-MTY (InstalacionId = 3) - duplicados similares
            new Producto { ProductoId = 25, Nombre = "Coca-Cola 600ml", MarcaId = 1, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 18.50m, StockMinimo = 500, Codigo = "REF-001", Categoria = "Refrescos", InstalacionId = 3, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 26, Nombre = "Pepsi 600ml", MarcaId = 2, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 17.50m, StockMinimo = 400, Codigo = "REF-002", Categoria = "Refrescos", InstalacionId = 3, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 27, Nombre = "Sabritas Original 45g", MarcaId = 3, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 15.00m, StockMinimo = 300, Codigo = "SNK-001", Categoria = "Snacks", InstalacionId = 3, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 28, Nombre = "Doritos Nacho 62g", MarcaId = 3, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 18.50m, StockMinimo = 200, Codigo = "SNK-002", Categoria = "Snacks", InstalacionId = 3, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 29, Nombre = "Agua Ciel 1L", MarcaId = 1, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 12.00m, StockMinimo = 800, Codigo = "REF-005", Categoria = "Agua", InstalacionId = 3, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },

            // Productos para Oficinas-Vaxsa-MTY (InstalacionId = 4) - duplicados similares
            new Producto { ProductoId = 30, Nombre = "Hojas Blancas Carta (500)", MarcaId = 9, UnidadId = 4, EsInventariable = true, EstatusId = 1, PrecioUnitario = 95.00m, StockMinimo = 20, Codigo = "PAP-001", Categoria = "Papelería", InstalacionId = 4, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 31, Nombre = "Plumas BIC Azul (12)", MarcaId = 6, UnidadId = 5, EsInventariable = true, EstatusId = 1, PrecioUnitario = 48.00m, StockMinimo = 10, Codigo = "PAP-002", Categoria = "Papelería", InstalacionId = 4, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 32, Nombre = "Toner HP 85A", MarcaId = 7, UnidadId = 1, EsInventariable = true, EstatusId = 1, PrecioUnitario = 650.00m, StockMinimo = 5, Codigo = "CON-001", Categoria = "Consumibles", InstalacionId = 4, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 },
            new Producto { ProductoId = 33, Nombre = "Café Nescafé Clásico 200g", MarcaId = 8, UnidadId = 7, EsInventariable = true, EstatusId = 1, PrecioUnitario = 145.00m, StockMinimo = 5, Codigo = "CON-004", Categoria = "Consumibles", InstalacionId = 4, CreadoEn = fechaSistema, CreadoPor = 1, ActualizadoEn = fechaSistema, ActualizadoPor = 1 }
        );

        // Movimientos de inventario (stock inicial)
        modelBuilder.Entity<Movimiento>().HasData(
            // Stock inicial para Almacen-SCC-MTY
            new Movimiento { MovimientoId = 1, InstalacionId = 1, ProductoId = 1, TipoMovimiento = 'E', Cantidad = 2500, SaldoFinal = 2500, CostoUnitario = 12.50m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 2, InstalacionId = 1, ProductoId = 2, TipoMovimiento = 'E', Cantidad = 1800, SaldoFinal = 1800, CostoUnitario = 11.80m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 3, InstalacionId = 1, ProductoId = 3, TipoMovimiento = 'E', Cantidad = 150, SaldoFinal = 150, CostoUnitario = 11.50m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 4, InstalacionId = 1, ProductoId = 5, TipoMovimiento = 'E', Cantidad = 3200, SaldoFinal = 3200, CostoUnitario = 8.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 5, InstalacionId = 1, ProductoId = 6, TipoMovimiento = 'E', Cantidad = 1500, SaldoFinal = 1500, CostoUnitario = 9.50m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 6, InstalacionId = 1, ProductoId = 7, TipoMovimiento = 'E', Cantidad = 800, SaldoFinal = 800, CostoUnitario = 12.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 7, InstalacionId = 1, ProductoId = 8, TipoMovimiento = 'E', Cantidad = 50, SaldoFinal = 50, CostoUnitario = 10.50m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 8, InstalacionId = 1, ProductoId = 9, TipoMovimiento = 'E', Cantidad = 650, SaldoFinal = 650, CostoUnitario = 10.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 9, InstalacionId = 1, ProductoId = 10, TipoMovimiento = 'E', Cantidad = 420, SaldoFinal = 420, CostoUnitario = 12.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 10, InstalacionId = 1, ProductoId = 11, TipoMovimiento = 'E', Cantidad = 980, SaldoFinal = 980, CostoUnitario = 10.00m, CreadoEn = fechaSistema, CreadoPor = 1 },

            // Stock inicial para Oficinas-SCC-MTY
            new Movimiento { MovimientoId = 11, InstalacionId = 2, ProductoId = 13, TipoMovimiento = 'E', Cantidad = 85, SaldoFinal = 85, CostoUnitario = 75.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 12, InstalacionId = 2, ProductoId = 14, TipoMovimiento = 'E', Cantidad = 45, SaldoFinal = 45, CostoUnitario = 36.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 13, InstalacionId = 2, ProductoId = 15, TipoMovimiento = 'E', Cantidad = 8, SaldoFinal = 8, CostoUnitario = 28.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 14, InstalacionId = 2, ProductoId = 16, TipoMovimiento = 'E', Cantidad = 32, SaldoFinal = 32, CostoUnitario = 65.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 15, InstalacionId = 2, ProductoId = 18, TipoMovimiento = 'E', Cantidad = 12, SaldoFinal = 12, CostoUnitario = 520.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 16, InstalacionId = 2, ProductoId = 19, TipoMovimiento = 'E', Cantidad = 3, SaldoFinal = 3, CostoUnitario = 300.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 17, InstalacionId = 2, ProductoId = 20, TipoMovimiento = 'E', Cantidad = 28, SaldoFinal = 28, CostoUnitario = 95.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 18, InstalacionId = 2, ProductoId = 21, TipoMovimiento = 'E', Cantidad = 22, SaldoFinal = 22, CostoUnitario = 55.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 19, InstalacionId = 2, ProductoId = 22, TipoMovimiento = 'E', Cantidad = 15, SaldoFinal = 15, CostoUnitario = 115.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 20, InstalacionId = 2, ProductoId = 23, TipoMovimiento = 'E', Cantidad = 6, SaldoFinal = 6, CostoUnitario = 28.00m, CreadoEn = fechaSistema, CreadoPor = 1 },

            // Stock inicial para Almacen-Vaxsa-MTY
            new Movimiento { MovimientoId = 21, InstalacionId = 3, ProductoId = 25, TipoMovimiento = 'E', Cantidad = 1800, SaldoFinal = 1800, CostoUnitario = 12.50m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 22, InstalacionId = 3, ProductoId = 26, TipoMovimiento = 'E', Cantidad = 1200, SaldoFinal = 1200, CostoUnitario = 11.80m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 23, InstalacionId = 3, ProductoId = 27, TipoMovimiento = 'E', Cantidad = 900, SaldoFinal = 900, CostoUnitario = 9.50m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 24, InstalacionId = 3, ProductoId = 28, TipoMovimiento = 'E', Cantidad = 550, SaldoFinal = 550, CostoUnitario = 12.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 25, InstalacionId = 3, ProductoId = 29, TipoMovimiento = 'E', Cantidad = 2500, SaldoFinal = 2500, CostoUnitario = 8.00m, CreadoEn = fechaSistema, CreadoPor = 1 },

            // Stock inicial para Oficinas-Vaxsa-MTY
            new Movimiento { MovimientoId = 26, InstalacionId = 4, ProductoId = 30, TipoMovimiento = 'E', Cantidad = 60, SaldoFinal = 60, CostoUnitario = 75.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 27, InstalacionId = 4, ProductoId = 31, TipoMovimiento = 'E', Cantidad = 30, SaldoFinal = 30, CostoUnitario = 36.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 28, InstalacionId = 4, ProductoId = 32, TipoMovimiento = 'E', Cantidad = 8, SaldoFinal = 8, CostoUnitario = 520.00m, CreadoEn = fechaSistema, CreadoPor = 1 },
            new Movimiento { MovimientoId = 29, InstalacionId = 4, ProductoId = 33, TipoMovimiento = 'E', Cantidad = 10, SaldoFinal = 10, CostoUnitario = 115.00m, CreadoEn = fechaSistema, CreadoPor = 1 }
        );

        // Clientes
        modelBuilder.Entity<Cliente>().HasData(
            new Cliente
            {
                ClienteId = 1,
                RFC = "CNO920815AB0",
                NombreCorto = "COM NORTE",
                RazonSocial = "Comercializadora del Norte SA de CV",
                Email = "compras@comnorte.com",
                Telefono = "81-1234-5678",
                Direccion = "Av. Constitución 1500, Col. Centro",
                Ciudad = "Monterrey, NL",
                CodigoPostal = "64000",
                Contacto = "Lic. Carlos Méndez",
                Saldo = 15000.00m,
                Activo = true,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Cliente
            {
                ClienteId = 2,
                RFC = "DRE881023CD5",
                NombreCorto = "REGIO EXPRESS",
                RazonSocial = "Distribuidora Regio Express SA",
                Email = "ventas@regioexpress.mx",
                Telefono = "81-8765-4321",
                Direccion = "Blvd. Díaz Ordaz 234, Col. Santa María",
                Ciudad = "San Pedro Garza García, NL",
                CodigoPostal = "66220",
                Contacto = "Ing. María González",
                Saldo = 8500.00m,
                Activo = true,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Cliente
            {
                ClienteId = 3,
                RFC = "TDM950612GH3",
                NombreCorto = "DON MANUEL",
                RazonSocial = "Tiendas Don Manuel S de RL",
                Email = "admin@donmanuel.com",
                Telefono = "81-2345-6789",
                Direccion = "Calle Morelos 567, Col. Obrera",
                Ciudad = "Monterrey, NL",
                CodigoPostal = "64010",
                Contacto = "Manuel Rodríguez",
                Saldo = 0m,
                Activo = true,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Cliente
            {
                ClienteId = 4,
                RFC = "ALE780930JK1",
                NombreCorto = "LA ESPERANZA",
                RazonSocial = "Abarrotes La Esperanza SA",
                Email = "compras@laesperanza.mx",
                Telefono = "81-3456-7890",
                Direccion = "Av. Ruiz Cortines 890, Col. Cumbres",
                Ciudad = "Monterrey, NL",
                CodigoPostal = "64610",
                Contacto = "Sra. Patricia López",
                Saldo = 3200.00m,
                Activo = false,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            },
            new Cliente
            {
                ClienteId = 5,
                RFC = "SFU910215LM9",
                NombreCorto = "FAMILIA UNIDA",
                RazonSocial = "Supermercados Familia Unida SA de CV",
                Email = "compras@familiaunida.com",
                Telefono = "81-9876-5432",
                Direccion = "Av. Lincoln 1234, Col. Mitras",
                Ciudad = "Monterrey, NL",
                CodigoPostal = "64320",
                Contacto = "Ing. Roberto Sánchez",
                Saldo = 0m,
                Activo = true,
                CreadoEn = fechaSistema,
                CreadoPor = 1,
                ActualizadoEn = fechaSistema,
                ActualizadoPor = 1
            }
        );
    }
}
