using GesvenApi.Models.Ventas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class VentaConfiguration : IEntityTypeConfiguration<Venta>
{
    public void Configure(EntityTypeBuilder<Venta> builder)
    {
        builder.ToTable("Venta", "Ven");
        builder.HasKey(e => e.VentaId);
        builder.Property(e => e.Folio).HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Folio).IsUnique();
        builder.Property(e => e.MontoTotal).HasPrecision(18, 2);
        builder.Property(e => e.Comentarios).HasMaxLength(500);
        builder.HasOne(e => e.Instalacion)
              .WithMany()
              .HasForeignKey(e => e.InstalacionId);
        builder.HasOne(e => e.Cliente)
              .WithMany(e => e.Ventas)
              .HasForeignKey(e => e.ClienteId);
        builder.HasOne(e => e.Estatus)
              .WithMany()
              .HasForeignKey(e => e.EstatusId);
    }
}
