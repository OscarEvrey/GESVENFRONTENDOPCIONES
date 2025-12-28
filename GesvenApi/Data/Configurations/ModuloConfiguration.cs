using GesvenApi.Models.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class ModuloConfiguration : IEntityTypeConfiguration<Modulo>
{
    public void Configure(EntityTypeBuilder<Modulo> builder)
    {
        // Mapeo a esquema [Seg]
        builder.ToTable("Modulo", "Seg");

        builder.HasKey(m => m.ModuloId);

        builder.Property(m => m.Nombre)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.Ruta)
            .HasMaxLength(100);

        builder.Property(m => m.Icono)
            .HasMaxLength(50);
            
        builder.Property(m => m.EstadoDesarrollo)
            .HasMaxLength(20)
            .HasDefaultValue("Disponible");

        // Relación Recursiva (Padre - Hijos)
        builder.HasOne(m => m.Padre)
            .WithMany(m => m.Hijos)
            .HasForeignKey(m => m.PadreId)
            .OnDelete(DeleteBehavior.Restrict); // No borrar padre si tiene hijos
    }
}