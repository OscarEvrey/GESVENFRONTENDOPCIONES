using GesvenApi.Models.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class AjusteInventarioConfiguration : IEntityTypeConfiguration<AjusteInventario>
{
    public void Configure(EntityTypeBuilder<AjusteInventario> builder)
    {
        builder.ToTable("AjusteInventario", "Inv");
        builder.HasKey(e => e.AjusteId);
        builder.Property(e => e.TipoAjuste).IsRequired();
        builder.Property(e => e.Cantidad).HasPrecision(18, 4).IsRequired();
        builder.Property(e => e.StockAnterior).HasPrecision(18, 4).IsRequired();
        builder.Property(e => e.StockNuevo).HasPrecision(18, 4).IsRequired();
        builder.Property(e => e.Motivo).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Observaciones).HasMaxLength(500);
        builder.HasOne(e => e.Instalacion)
              .WithMany()
              .HasForeignKey(e => e.InstalacionId);
        builder.HasOne(e => e.Producto)
              .WithMany()
              .HasForeignKey(e => e.ProductoId);
    }
}