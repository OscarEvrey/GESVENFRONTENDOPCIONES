using GesvenApi.Models.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class MovimientoConfiguration : IEntityTypeConfiguration<Movimiento>
{
    public void Configure(EntityTypeBuilder<Movimiento> builder)
    {
        builder.ToTable("Movimiento", "Inv");
        builder.HasKey(e => e.MovimientoId);
        builder.Property(e => e.TipoMovimiento).IsRequired();
        builder.Property(e => e.Cantidad).HasPrecision(18, 4).IsRequired();
        builder.Property(e => e.SaldoFinal).HasPrecision(18, 4).IsRequired();
        builder.Property(e => e.CostoUnitario).HasPrecision(18, 4);
        builder.Property(e => e.Lote).HasMaxLength(50);
        builder.HasOne(e => e.Instalacion)
              .WithMany()
              .HasForeignKey(e => e.InstalacionId);
        builder.HasOne(e => e.Producto)
              .WithMany(e => e.Movimientos)
              .HasForeignKey(e => e.ProductoId);
    }
}
