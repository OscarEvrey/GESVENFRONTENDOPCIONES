using GesvenApi.Models.Compras;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class ProveedorConfiguration : IEntityTypeConfiguration<Proveedor>
{
    public void Configure(EntityTypeBuilder<Proveedor> builder)
    {
        builder.ToTable("Proveedor", "Comp");
        builder.HasKey(e => e.ProveedorId);
        builder.Property(e => e.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(e => e.RFC).HasMaxLength(13);
        builder.HasIndex(e => e.RFC).IsUnique();
    }
}
