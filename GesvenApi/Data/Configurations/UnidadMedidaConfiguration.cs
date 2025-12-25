using GesvenApi.Models.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class UnidadMedidaConfiguration : IEntityTypeConfiguration<UnidadMedida>
{
    public void Configure(EntityTypeBuilder<UnidadMedida> builder)
    {
        builder.ToTable("UnidadMedida", "Inv");
        builder.HasKey(e => e.UnidadId);
        builder.Property(e => e.Nombre).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Simbolo).HasMaxLength(10).IsRequired();
    }
}
