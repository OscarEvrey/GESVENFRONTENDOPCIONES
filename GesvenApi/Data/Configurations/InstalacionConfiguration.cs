using GesvenApi.Models.Organizacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class InstalacionConfiguration : IEntityTypeConfiguration<Instalacion>
{
    public void Configure(EntityTypeBuilder<Instalacion> builder)
    {
        builder.ToTable("Instalacion", "Org");
        builder.HasKey(e => e.InstalacionId);
        builder.Property(e => e.Nombre).HasMaxLength(150).IsRequired();
        builder.Property(e => e.Tipo).HasMaxLength(50).IsRequired();
        builder.HasOne(e => e.Sucursal)
              .WithMany(e => e.Instalaciones)
              .HasForeignKey(e => e.SucursalId);
    }
}
