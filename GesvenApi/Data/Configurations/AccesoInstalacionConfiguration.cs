using GesvenApi.Models.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class AccesoInstalacionConfiguration : IEntityTypeConfiguration<AccesoInstalacion>
{
    public void Configure(EntityTypeBuilder<AccesoInstalacion> builder)
    {
        builder.ToTable("AccesoInstalacion", "Seg");

        builder.HasKey(a => a.AccesoId);

        builder.Property(a => a.EsActivo)
            .HasDefaultValue(true);

        // Relaciones
        builder.HasOne(a => a.Usuario)
            .WithMany() // Asumiendo que Usuario no tiene lista de Accesos, si tiene pon .WithMany(u => u.Accesos)
            .HasForeignKey(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Instalacion)
            .WithMany()
            .HasForeignKey(a => a.InstalacionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Rol)
            .WithMany()
            .HasForeignKey(a => a.RolId)
            .OnDelete(DeleteBehavior.Restrict);     
    }
}