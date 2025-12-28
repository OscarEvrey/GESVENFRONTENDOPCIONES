using AutoMapper;
using GesvenApi.Models.Compras;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Models.Dtos.Responses.Seguridad;
using GesvenApi.Models.Inventario;
using GesvenApi.Models.Organizacion;
using GesvenApi.Models.Seguridad;
using GesvenApi.Models.Ventas;

namespace GesvenApi.Mapping;

/// <summary>
/// Perfil central de AutoMapper para mapear entidades de dominio hacia DTOs de respuesta.
/// </summary>
public class GesvenMappingProfile : Profile
{
    /// <summary>
    /// Configura los mapeos entre entidades y DTOs de respuesta.
    /// </summary>
    public GesvenMappingProfile()
    {
        CreateMap<Producto, ProductoDto>()
            .ForMember(dest => dest.MarcaNombre, opt => opt.MapFrom(src => src.Marca != null ? src.Marca.Nombre : null))
            .ForMember(dest => dest.UnidadNombre, opt => opt.MapFrom(src => src.Unidad != null ? src.Unidad.Nombre : null))
            .ForMember(dest => dest.EstatusNombre, opt => opt.MapFrom(src => src.Estatus != null ? src.Estatus.Nombre : string.Empty));

        CreateMap<Cliente, ClienteDto>();

        CreateMap<Proveedor, ProveedorDto>();

        CreateMap<Movimiento, MovimientoDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto != null ? src.Producto.Nombre : string.Empty));

        CreateMap<OrdenCompraDetalle, DetalleOrdenCompraRespuestaDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto != null ? src.Producto.Nombre : string.Empty))
            .ForMember(dest => dest.Subtotal, opt => opt.MapFrom(src => src.CantidadSolicitada * src.CostoUnitario));

        CreateMap<OrdenCompra, OrdenCompraRespuestaDto>()
            .ForMember(dest => dest.InstalacionNombre, opt => opt.MapFrom(src => src.Instalacion != null ? src.Instalacion.Nombre : string.Empty))
            .ForMember(dest => dest.ProveedorNombre, opt => opt.MapFrom(src => src.Proveedor != null ? src.Proveedor.Nombre : string.Empty))
            .ForMember(dest => dest.Estatus, opt => opt.MapFrom(src => src.Estatus != null ? src.Estatus.Nombre : string.Empty));

        CreateMap<VentaDetalle, DetalleVentaRespuestaDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto != null ? src.Producto.Nombre : string.Empty));

        CreateMap<Venta, VentaRespuestaDto>()
            .ForMember(dest => dest.InstalacionNombre, opt => opt.MapFrom(src => src.Instalacion != null ? src.Instalacion.Nombre : string.Empty))
            .ForMember(dest => dest.ClienteNombre, opt => opt.MapFrom(src => src.Cliente != null ? src.Cliente.RazonSocial : string.Empty))
            .ForMember(dest => dest.Estatus, opt => opt.MapFrom(src => src.Estatus != null ? src.Estatus.Nombre : string.Empty));

        CreateMap<TransferenciaDetalle, DetalleTransferenciaRespuestaDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto != null ? src.Producto.Nombre : string.Empty));

        CreateMap<Transferencia, TransferenciaRespuestaDto>()
            .ForMember(dest => dest.InstalacionOrigenNombre, opt => opt.MapFrom(src => src.InstalacionOrigen != null ? src.InstalacionOrigen.Nombre : string.Empty))
            .ForMember(dest => dest.InstalacionDestinoNombre, opt => opt.MapFrom(src => src.InstalacionDestino != null ? src.InstalacionDestino.Nombre : string.Empty));

        CreateMap<AjusteInventario, AjusteRespuestaDto>()
            .ForMember(dest => dest.InstalacionNombre, opt => opt.MapFrom(src => src.Instalacion != null ? src.Instalacion.Nombre : string.Empty))
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto != null ? src.Producto.Nombre : string.Empty));

        CreateMap<Instalacion, InstalacionDto>()
            .ForMember(dest => dest.Empresa, opt => opt.MapFrom(src => src.Sucursal != null && src.Sucursal.Empresa != null ? src.Sucursal.Empresa.Nombre : string.Empty))
            .ForMember(dest => dest.Sucursal, opt => opt.MapFrom(src => src.Sucursal != null ? src.Sucursal.Nombre : string.Empty))
            .ForMember(dest => dest.Descripcion, opt => opt.MapFrom(src => src.Tipo.ToLower() == "almacen"
                ? $"Almacén de {src.Sucursal!.Empresa!.Nombre} en {src.Sucursal.Nombre}. Productos: refrescos y snacks."
                : $"Oficinas de {src.Sucursal!.Empresa!.Nombre} en {src.Sucursal.Nombre}. Productos: papelería y consumibles."));

        CreateMap<Usuario, UsuarioDto>();
        CreateMap<Rol, RolDto>();
    }
}
