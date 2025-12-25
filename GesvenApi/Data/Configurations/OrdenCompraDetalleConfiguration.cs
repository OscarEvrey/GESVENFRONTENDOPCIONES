using GesvenApi.Models.Compras;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class OrdenCompraDetalleConfiguration : IEntityTypeConfiguration<OrdenCompraDetalle>
{
    public void Configure(EntityTypeBuilder<OrdenCompraDetalle> builder)
    {
        builder.ToTable("OrdenCompraDetalle", "Comp");
        builder.HasKey(e => e.DetalleId);
        builder.Property(e => e.CantidadSolicitada).HasPrecision(18, 4);
        builder.Property(e => e.CantidadRecibida).HasPrecision(18, 4);
        builder.Property(e => e.CostoUnitario).HasPrecision(18, 4);
        builder.HasOne(e => e.OrdenCompra)
              .WithMany(e => e.Detalles)
              .HasForeignKey(e => e.OrdenCompraId);
        builder.HasOne(e => e.Producto)
              .WithMany()
              .HasForeignKey(e => e.ProductoId);
    }
}
