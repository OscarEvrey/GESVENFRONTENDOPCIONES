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
    public int InstalacionId { get; set; }
    public int ProveedorId { get; set; }
    public string? Comentarios { get; set; }
    public List<LineaOrdenCompraDto> Lineas { get; set; } = new();
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
    public int OrdenCompraId { get; set; }
    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;
    public int ProveedorId { get; set; }
    public string ProveedorNombre { get; set; } = string.Empty;
    public string Estatus { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public string? Comentarios { get; set; }
    public DateTime CreadoEn { get; set; }
    public List<DetalleOrdenCompraRespuestaDto> Detalles { get; set; } = new();
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
public class RespuestaApi<T>
{
    public bool Exito { get; set; }
    public string Mensaje { get; set; } = string.Empty;
    public T? Datos { get; set; }
    public List<string> Errores { get; set; } = new();
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
