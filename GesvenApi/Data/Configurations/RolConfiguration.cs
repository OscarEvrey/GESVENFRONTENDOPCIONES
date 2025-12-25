using GesvenApi.Models.Seguridad;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class RolConfiguration : IEntityTypeConfiguration<Rol>
{
    public void Configure(EntityTypeBuilder<Rol> builder)
    {
        builder.ToTable("Rol", "Seg");
        builder.HasKey(e => e.RolId);
        builder.Property(e => e.Nombre).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Descripcion).HasMaxLength(200);
    }
}
