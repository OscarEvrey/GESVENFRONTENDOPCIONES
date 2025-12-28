namespace GesvenApi.Models.Dtos.Responses.Seguridad;

public class PermisosModuloDto
{
    public bool Compras { get; set; }
    public bool Ventas { get; set; }
    public bool Inventario { get; set; }
    public bool Facturacion { get; set; }
    public bool Pagos { get; set; }
    public bool Auditoria { get; set; }
    public bool Catalogos { get; set; }
}
