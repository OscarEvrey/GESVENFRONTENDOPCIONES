using GesvenApi.Models.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class RolConfiguration : IEntityTypeConfiguration<Rol>
{
    public void Configure(EntityTypeBuilder<Rol> builder)
    {
        builder.ToTable("Rol", "Seg");

        builder.HasKey(r => r.RolId);

        builder.Property(r => r.Nombre)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(r => r.Descripcion)
            .HasMaxLength(200);
            
        // Configuración explícita de la colección (opcional pero recomendada)
        builder.HasMany(r => r.RolPermisos)
            .WithOne(rp => rp.Rol)
            .HasForeignKey(rp => rp.RolId);
    }
}