using GesvenApi.Models.Ventas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GesvenApi.Data.Configurations;

public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> builder)
    {
        builder.ToTable("Cliente", "Ven");
        builder.HasKey(e => e.ClienteId);
        builder.Property(e => e.RFC).HasMaxLength(13).IsRequired();
        builder.HasIndex(e => e.RFC).IsUnique();
        builder.Property(e => e.NombreCorto).HasMaxLength(50).IsRequired();
        builder.Property(e => e.RazonSocial).HasMaxLength(200).IsRequired();
        builder.Property(e => e.Email).HasMaxLength(255);
        builder.Property(e => e.Telefono).HasMaxLength(30);
        builder.Property(e => e.Direccion).HasMaxLength(300);
        builder.Property(e => e.Ciudad).HasMaxLength(100);
        builder.Property(e => e.CodigoPostal).HasMaxLength(10);
        builder.Property(e => e.Contacto).HasMaxLength(150);
        builder.Property(e => e.Saldo).HasPrecision(18, 2);
    }
}
