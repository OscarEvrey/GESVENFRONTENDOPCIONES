namespace GesvenApi.DTOs;

/// <summary>
/// DTO para la respuesta de instalaciones.
/// </summary>
public class InstalacionDto
{
    public int InstalacionId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Empresa { get; set; } = string.Empty;
    public string Sucursal { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
}

/// <summary>
/// DTO para la respuesta de productos de inventario.
/// </summary>
public class ProductoInventarioDto
{
    public int ProductoId { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string Unidad { get; set; } = string.Empty;
    public decimal StockActual { get; set; }
    public decimal StockMinimo { get; set; }
    public decimal PrecioUnitario { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
}

/// <summary>
/// DTO para crear una orden de compra.
/// </summary>
public class CrearOrdenCompraDto
{
    /// <summary>Identificador de la instalación destino.</summary>
    public int InstalacionId { get; set; }

    /// <summary>Identificador del proveedor.</summary>
    public int ProveedorId { get; set; }

    /// <summary>Comentarios opcionales de la orden.</summary>
    public string? Comentarios { get; set; }

    /// <summary>Líneas de productos de la orden.</summary>
    public List<LineaOrdenCompraDto> Lineas { get; set; } = [];
}

/// <summary>
/// DTO para una línea de orden de compra.
/// </summary>
public class LineaOrdenCompraDto
{
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
    public decimal CostoUnitario { get; set; }
}

/// <summary>
/// DTO para la respuesta de una orden de compra creada.
/// </summary>
public class OrdenCompraRespuestaDto
{
    /// <summary>Identificador de la orden de compra.</summary>
    public int OrdenCompraId { get; set; }

    /// <summary>Identificador de la instalación.</summary>
    public int InstalacionId { get; set; }

    /// <summary>Nombre de la instalación.</summary>
    public string InstalacionNombre { get; set; } = string.Empty;

    /// <summary>Identificador del proveedor.</summary>
    public int ProveedorId { get; set; }

    /// <summary>Nombre del proveedor.</summary>
    public string ProveedorNombre { get; set; } = string.Empty;

    /// <summary>Estatus actual de la orden.</summary>
    public string Estatus { get; set; } = string.Empty;

    /// <summary>Monto total de la orden.</summary>
    public decimal MontoTotal { get; set; }

    /// <summary>Comentarios de la orden.</summary>
    public string? Comentarios { get; set; }

    /// <summary>Fecha de creación de la orden.</summary>
    public DateTime CreadoEn { get; set; }

    /// <summary>Detalles de los productos de la orden.</summary>
    public List<DetalleOrdenCompraRespuestaDto> Detalles { get; set; } = [];
}

/// <summary>
/// DTO para el detalle de una orden de compra en la respuesta.
/// </summary>
public class DetalleOrdenCompraRespuestaDto
{
    public int DetalleId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public decimal CantidadSolicitada { get; set; }
    public decimal CostoUnitario { get; set; }
    public decimal Subtotal { get; set; }
}

/// <summary>
/// Respuesta estándar de la API.
/// </summary>
/// <typeparam name="T">El tipo de datos contenidos en la respuesta.</typeparam>
public class RespuestaApi<T>
{
    /// <summary>Indica si la operación fue exitosa.</summary>
    public bool Exito { get; set; }

    /// <summary>Mensaje descriptivo del resultado.</summary>
    public string Mensaje { get; set; } = string.Empty;

    /// <summary>Datos de la respuesta.</summary>
    public T? Datos { get; set; }

    /// <summary>Lista de errores si la operación falló.</summary>
    public List<string> Errores { get; set; } = [];
}

/// <summary>
/// DTO para proveedor.
/// </summary>
public class ProveedorDto
{
    public int ProveedorId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? RFC { get; set; }
}

/// <summary>
/// DTO para producto simplificado (para selectores).
/// </summary>
public class ProductoSimpleDto
{
    public int ProductoId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal CostoSugerido { get; set; }
}

/// <summary>
/// DTO para crear un producto.
/// </summary>
public class CrearProductoDto
{
    public int InstalacionId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int? MarcaId { get; set; }
    public int? UnidadId { get; set; }
    public bool EsInventariable { get; set; } = true;
    public decimal PrecioUnitario { get; set; }
    public decimal StockMinimo { get; set; }
    public string? Codigo { get; set; }
    public string? Categoria { get; set; }
}

/// <summary>
/// DTO para actualizar un producto.
/// </summary>
public class ActualizarProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public int? MarcaId { get; set; }
    public int? UnidadId { get; set; }
    public bool EsInventariable { get; set; } = true;
    public decimal PrecioUnitario { get; set; }
    public decimal StockMinimo { get; set; }
    public string? Codigo { get; set; }
    public string? Categoria { get; set; }
    public bool Activo { get; set; } = true;
}

/// <summary>
/// DTO para exponer un producto.
/// </summary>
public class ProductoDto
{
    public int ProductoId { get; set; }
    public int? InstalacionId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Codigo { get; set; }
    public string? Categoria { get; set; }
    public bool EsInventariable { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal StockMinimo { get; set; }
    public int? MarcaId { get; set; }
    public string? MarcaNombre { get; set; }
    public int? UnidadId { get; set; }
    public string? UnidadNombre { get; set; }
    public int? EstatusId { get; set; }
    public string EstatusNombre { get; set; } = string.Empty;
}

/// <summary>
/// DTO para crear un cliente.
/// </summary>
public class CrearClienteDto
{
    public string RFC { get; set; } = string.Empty;
    public string NombreCorto { get; set; } = string.Empty;
    public string RazonSocial { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Contacto { get; set; }
}

/// <summary>
/// DTO para actualizar un cliente.
/// </summary>
public class ActualizarClienteDto
{
    public string RFC { get; set; } = string.Empty;
    public string NombreCorto { get; set; } = string.Empty;
    public string RazonSocial { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Contacto { get; set; }
    public bool Activo { get; set; }
}

/// <summary>
/// DTO para exponer un cliente.
/// </summary>
public class ClienteDto
{
    public int ClienteId { get; set; }
    public string RFC { get; set; } = string.Empty;
    public string NombreCorto { get; set; } = string.Empty;
    public string RazonSocial { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public string? Direccion { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    public string? Contacto { get; set; }
    public decimal Saldo { get; set; }
    public bool Activo { get; set; }
}

/// <summary>
/// DTO para crear una venta.
/// </summary>
public class CrearVentaDto
{
    public int InstalacionId { get; set; }
    public int ClienteId { get; set; }
    public string? Comentarios { get; set; }
    public List<LineaVentaDto> Lineas { get; set; } = [];
}

/// <summary>
/// DTO para la línea de una venta.
/// </summary>
public class LineaVentaDto
{
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Descuento { get; set; }
}

/// <summary>
/// DTO para la respuesta de venta.
/// </summary>
public class VentaRespuestaDto
{
    public int VentaId { get; set; }
    public string Folio { get; set; } = string.Empty;
    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;
    public int ClienteId { get; set; }
    public string ClienteNombre { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public string Estatus { get; set; } = string.Empty;
    public DateTime FechaVenta { get; set; }
    public string? Comentarios { get; set; }
    public List<DetalleVentaRespuestaDto> Detalles { get; set; } = [];
}

/// <summary>
/// DTO para el detalle de una venta en la respuesta.
/// </summary>
public class DetalleVentaRespuestaDto
{
    public int DetalleId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Descuento { get; set; }
    public decimal Subtotal { get; set; }
}

/// <summary>
/// DTO para crear una transferencia entre instalaciones.
/// </summary>
public class CrearTransferenciaDto
{
    public int InstalacionOrigenId { get; set; }
    public int InstalacionDestinoId { get; set; }
    public string? Comentarios { get; set; }
    public List<LineaTransferenciaDto> Lineas { get; set; } = [];
}

/// <summary>
/// DTO para línea de transferencia.
/// </summary>
public class LineaTransferenciaDto
{
    public int ProductoId { get; set; }
    public decimal Cantidad { get; set; }
}

/// <summary>
/// DTO para actualizar recepción de transferencia.
/// </summary>
public class RecibirTransferenciaDto
{
    public List<LineaRecepcionTransferenciaDto> Lineas { get; set; } = [];
}

/// <summary>
/// DTO para línea de recepción de transferencia.
/// </summary>
public class LineaRecepcionTransferenciaDto
{
    public int DetalleId { get; set; }
    public decimal CantidadRecibida { get; set; }
}

/// <summary>
/// DTO de respuesta para transferencias.
/// </summary>
public class TransferenciaRespuestaDto
{
    public int TransferenciaId { get; set; }
    public string Folio { get; set; } = string.Empty;
    public int InstalacionOrigenId { get; set; }
    public string InstalacionOrigenNombre { get; set; } = string.Empty;
    public int InstalacionDestinoId { get; set; }
    public string InstalacionDestinoNombre { get; set; } = string.Empty;
    public DateTime FechaEnvio { get; set; }
    public DateTime? FechaRecepcion { get; set; }
    public string Estatus { get; set; } = string.Empty;
    public string? Comentarios { get; set; }
    public List<DetalleTransferenciaRespuestaDto> Detalles { get; set; } = [];
}

/// <summary>
/// Detalle de transferencia en respuesta.
/// </summary>
public class DetalleTransferenciaRespuestaDto
{
    public int DetalleId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public decimal CantidadEnviada { get; set; }
    public decimal? CantidadRecibida { get; set; }
}

/// <summary>
/// DTO para crear un ajuste de inventario.
/// </summary>
public class CrearAjusteDto
{
    public int InstalacionId { get; set; }
    public int ProductoId { get; set; }
    public char TipoAjuste { get; set; }
    public decimal Cantidad { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
}

/// <summary>
/// DTO de respuesta para ajustes de inventario.
/// </summary>
public class AjusteRespuestaDto
{
    public int AjusteId { get; set; }
    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public char TipoAjuste { get; set; }
    public decimal Cantidad { get; set; }
    public decimal StockAnterior { get; set; }
    public decimal StockNuevo { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string? Observaciones { get; set; }
    public DateTime FechaAjuste { get; set; }
}

/// <summary>
/// DTO para consultar movimientos de inventario.
/// </summary>
public class MovimientoDto
{
    public int MovimientoId { get; set; }
    public int InstalacionId { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public char TipoMovimiento { get; set; }
    public decimal Cantidad { get; set; }
    public decimal SaldoFinal { get; set; }
    public decimal? CostoUnitario { get; set; }
    public string? Lote { get; set; }
    public DateOnly? FechaCaducidad { get; set; }
    public DateTime CreadoEn { get; set; }
}

/// <summary>
/// DTO para recepción de orden de compra.
/// </summary>
public class RecepcionOrdenCompraDto
{
    public List<LineaRecepcionOrdenCompraDto> Lineas { get; set; } = [];
}

/// <summary>
/// DTO de línea de recepción para OC.
/// </summary>
public class LineaRecepcionOrdenCompraDto
{
    public int DetalleId { get; set; }
    public decimal CantidadRecibida { get; set; }
    public string? Lote { get; set; }
    public DateOnly? FechaCaducidad { get; set; }
}

/// <summary>
/// DTO para métricas de dashboard.
/// </summary>
public class DashboardResumenDto
{
    public int ProductosBajoStock { get; set; }
    public int OrdenesPendientes { get; set; }
    public decimal VentasMes { get; set; }
    public int VentasPendientesFacturar { get; set; }
}
