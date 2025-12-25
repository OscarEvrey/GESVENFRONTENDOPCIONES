using GesvenApi.Models.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
{
    public void Configure(EntityTypeBuilder<Producto> builder)
    {
        builder.ToTable("Producto", "Inv");
        builder.HasKey(e => e.ProductoId);
        builder.Property(e => e.Nombre).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Codigo).HasMaxLength(50);
        builder.Property(e => e.Categoria).HasMaxLength(100);
        builder.Property(e => e.PrecioUnitario).HasPrecision(18, 4);
        builder.Property(e => e.StockMinimo).HasPrecision(18, 4);
        builder.Property(e => e.EstatusId).IsRequired();
        builder.HasOne(e => e.Marca)
              .WithMany(e => e.Productos)
              .HasForeignKey(e => e.MarcaId);
        builder.HasOne(e => e.Unidad)
              .WithMany(e => e.Productos)
              .HasForeignKey(e => e.UnidadId);
        builder.HasOne(e => e.Estatus)
              .WithMany()
              .HasForeignKey(e => e.EstatusId);
    }
}
