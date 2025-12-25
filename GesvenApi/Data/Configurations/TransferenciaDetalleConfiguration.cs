using GesvenApi.Models.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class TransferenciaDetalleConfiguration : IEntityTypeConfiguration<TransferenciaDetalle>
{
    public void Configure(EntityTypeBuilder<TransferenciaDetalle> builder)
    {
        builder.ToTable("TransferenciaDetalle", "Inv");
        builder.HasKey(e => e.DetalleId);
        builder.Property(e => e.CantidadEnviada).HasPrecision(18, 4);
        builder.Property(e => e.CantidadRecibida).HasPrecision(18, 4);
        builder.HasOne(e => e.Transferencia)
              .WithMany(e => e.Detalles)
              .HasForeignKey(e => e.TransferenciaId);
        builder.HasOne(e => e.Producto)
              .WithMany()
              .HasForeignKey(e => e.ProductoId);
    }
}
