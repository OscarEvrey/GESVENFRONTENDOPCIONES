using GesvenApi.Models.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class MarcaConfiguration : IEntityTypeConfiguration<Marca>
{
    public void Configure(EntityTypeBuilder<Marca> builder)
    {
        builder.ToTable("Marca", "Inv");
        builder.HasKey(e => e.MarcaId);
        builder.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
    }
}
