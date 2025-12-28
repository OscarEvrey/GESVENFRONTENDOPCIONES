using GesvenApi.Models.Auditoria; // Ojo: Revisa si tu namespace es Models.Auditoria
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class EstatusGeneralConfiguration : IEntityTypeConfiguration<EstatusGeneral>
{
    public void Configure(EntityTypeBuilder<EstatusGeneral> builder)
    {
        builder.ToTable("EstatusGeneral", "Aud");

        builder.HasKey(e => e.EstatusId);

        builder.Property(e => e.Nombre)
            .IsRequired()
            .HasMaxLength(50);

        
        builder.HasOne(e => e.Modulo)
            .WithMany()
            .HasForeignKey(e => e.ModuloId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}