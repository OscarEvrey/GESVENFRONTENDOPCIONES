using GesvenApi.Models.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class AccesoInstalacionConfiguration : IEntityTypeConfiguration<AccesoInstalacion>
{
    public void Configure(EntityTypeBuilder<AccesoInstalacion> builder)
    {
        builder.ToTable("AccesoInstalacion", "Seg");
        builder.HasKey(e => e.AccesoId);

            builder.Property(e => e.EsActivo)
                  .HasDefaultValue(true);

            builder.Property(e => e.PermisoCompras).HasDefaultValue(false);
            builder.Property(e => e.PermisoVentas).HasDefaultValue(false);
            builder.Property(e => e.PermisoInventario).HasDefaultValue(false);
            builder.Property(e => e.PermisoFacturacion).HasDefaultValue(false);
            builder.Property(e => e.PermisoPagos).HasDefaultValue(false);
            builder.Property(e => e.PermisoAuditoria).HasDefaultValue(false);
            builder.Property(e => e.PermisoCatalogos).HasDefaultValue(false);

        builder.HasOne(e => e.Usuario)
              .WithMany(e => e.Accesos)
              .HasForeignKey(e => e.UsuarioId);
        builder.HasOne(e => e.Instalacion)
              .WithMany(e => e.Accesos)
              .HasForeignKey(e => e.InstalacionId);
        builder.HasOne(e => e.Rol)
              .WithMany()
              .HasForeignKey(e => e.RolId);

            builder.HasIndex(e => new { e.UsuarioId, e.InstalacionId })
                  .IsUnique();
    }
}