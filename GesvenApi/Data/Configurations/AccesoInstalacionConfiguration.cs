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
        builder.HasOne(e => e.Usuario)
              .WithMany(e => e.Accesos)
              .HasForeignKey(e => e.UsuarioId);
        builder.HasOne(e => e.Instalacion)
              .WithMany(e => e.Accesos)
              .HasForeignKey(e => e.InstalacionId);
        builder.HasOne(e => e.Rol)
              .WithMany()
              .HasForeignKey(e => e.RolId);
    }
}