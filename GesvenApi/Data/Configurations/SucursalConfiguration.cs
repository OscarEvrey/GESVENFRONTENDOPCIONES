using GesvenApi.Models.Organizacion;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class SucursalConfiguration : IEntityTypeConfiguration<Sucursal>
{
    public void Configure(EntityTypeBuilder<Sucursal> builder)
    {
        builder.ToTable("Sucursal", "Org");
        builder.HasKey(e => e.SucursalId);
        builder.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
        builder.HasOne(e => e.Empresa)
              .WithMany(e => e.Sucursales)
              .HasForeignKey(e => e.EmpresaId);
    }
}
