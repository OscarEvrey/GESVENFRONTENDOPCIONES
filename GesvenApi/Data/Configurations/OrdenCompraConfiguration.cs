using GesvenApi.Models.Compras;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class OrdenCompraConfiguration : IEntityTypeConfiguration<OrdenCompra>
{
    public void Configure(EntityTypeBuilder<OrdenCompra> builder)
    {
        builder.ToTable("OrdenCompra", "Comp");
        builder.HasKey(e => e.OrdenCompraId);
        builder.Property(e => e.MontoTotal).HasPrecision(18, 2);
        builder.Property(e => e.Comentarios).HasMaxLength(500);
        builder.Property(e => e.MotivoRechazo).HasMaxLength(500);
        builder.HasOne(e => e.Instalacion)
              .WithMany()
              .HasForeignKey(e => e.InstalacionId);
        builder.HasOne(e => e.Proveedor)
              .WithMany(e => e.OrdenesCompra)
              .HasForeignKey(e => e.ProveedorId);
        builder.HasOne(e => e.Estatus)
              .WithMany()
              .HasForeignKey(e => e.EstatusId);
    }
}
