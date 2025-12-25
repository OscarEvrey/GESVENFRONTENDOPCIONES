using GesvenApi.Models.Ventas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class VentaDetalleConfiguration : IEntityTypeConfiguration<VentaDetalle>
{
    public void Configure(EntityTypeBuilder<VentaDetalle> builder)
    {
        builder.ToTable("VentaDetalle", "Ven");
        builder.HasKey(e => e.DetalleId);
        builder.Property(e => e.Cantidad).HasPrecision(18, 4);
        builder.Property(e => e.PrecioUnitario).HasPrecision(18, 4);
        builder.Property(e => e.Descuento).HasPrecision(5, 2);
        builder.Property(e => e.Subtotal).HasPrecision(18, 2);
        builder.HasOne(e => e.Venta)
              .WithMany(e => e.Detalles)
              .HasForeignKey(e => e.VentaId);
        builder.HasOne(e => e.Producto)
              .WithMany()
              .HasForeignKey(e => e.ProductoId);
    }
}