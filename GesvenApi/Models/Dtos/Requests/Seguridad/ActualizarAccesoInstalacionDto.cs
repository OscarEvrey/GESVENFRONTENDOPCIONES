namespace GesvenApi.Models.Dtos.Requests.Seguridad;

public class ActualizarAccesoInstalacionDto
{
    public int RolId { get; set; }

    public bool EsActivo { get; set; }

    public bool PermisoCompras { get; set; }
    public bool PermisoVentas { get; set; }
    public bool PermisoInventario { get; set; }
    public bool PermisoFacturacion { get; set; }
    public bool PermisoPagos { get; set; }
    public bool PermisoAuditoria { get; set; }
    public bool PermisoCatalogos { get; set; }
}
