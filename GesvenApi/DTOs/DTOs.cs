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
