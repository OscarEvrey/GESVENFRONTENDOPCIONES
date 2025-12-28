using GesvenApi.Models.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class PermisoConfiguration : IEntityTypeConfiguration<Permiso>
{
    public void Configure(EntityTypeBuilder<Permiso> builder)
    {
        builder.ToTable("Permiso", "Seg");

        builder.HasKey(p => p.PermisoId);

        builder.Property(p => p.Nombre)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Clave)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Descripcion)
            .HasMaxLength(250);

        // Relación con Modulo
        builder.HasOne(p => p.Modulo)
            .WithMany(m => m.Permisos)
            .HasForeignKey(p => p.ModuloId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}