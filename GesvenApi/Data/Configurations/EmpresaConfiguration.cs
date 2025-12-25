using GesvenApi.Models.Organizacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class EmpresaConfiguration : IEntityTypeConfiguration<Empresa>
{
    public void Configure(EntityTypeBuilder<Empresa> builder)
    {
        builder.ToTable("Empresa", "Org");
        builder.HasKey(e => e.EmpresaId);
        builder.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
        builder.Property(e => e.RFC).HasMaxLength(13);
        builder.HasIndex(e => e.RFC).IsUnique();
    }
}
