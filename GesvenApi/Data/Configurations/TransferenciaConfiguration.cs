using GesvenApi.Models.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class TransferenciaConfiguration : IEntityTypeConfiguration<Transferencia>
{
    public void Configure(EntityTypeBuilder<Transferencia> builder)
    {
        builder.ToTable("Transferencia", "Inv");
        builder.HasKey(e => e.TransferenciaId);
        builder.Property(e => e.Folio).HasMaxLength(50).IsRequired();
        builder.HasIndex(e => e.Folio).IsUnique();
        builder.Property(e => e.Estatus).HasMaxLength(20).IsRequired();
        builder.Property(e => e.Comentarios).HasMaxLength(500);
        builder.HasOne(e => e.InstalacionOrigen)
              .WithMany()
              .HasForeignKey(e => e.InstalacionOrigenId)
              .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.InstalacionDestino)
              .WithMany()
              .HasForeignKey(e => e.InstalacionDestinoId)
              .OnDelete(DeleteBehavior.Restrict);
    }
}
