using GesvenApi.Models.Auditoria;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class EstatusGeneralConfiguration : IEntityTypeConfiguration<EstatusGeneral>
{
    public void Configure(EntityTypeBuilder<EstatusGeneral> builder)
    {
        builder.ToTable("EstatusGeneral", "Aud");
        builder.HasKey(e => e.EstatusId);
        builder.Property(e => e.Nombre).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Modulo).HasMaxLength(50).IsRequired();
    }
}