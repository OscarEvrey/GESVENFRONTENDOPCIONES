using GesvenApi.Models.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("Usuario", "Seg");
        builder.HasKey(e => e.UsuarioId);
        builder.HasIndex(e => e.Email).IsUnique();
        builder.Property(e => e.Email).HasMaxLength(255).IsRequired();
        builder.Property(e => e.NombreCompleto).HasMaxLength(200).IsRequired();
        builder.Property(e => e.NumeroEmpleado).HasMaxLength(50);
        builder.Property(e => e.Puesto).HasMaxLength(100);
    }
}
