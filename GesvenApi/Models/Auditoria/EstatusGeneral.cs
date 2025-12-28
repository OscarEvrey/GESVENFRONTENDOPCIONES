using GesvenApi.Models.Base;
using GesvenApi.Models.Seguridad;

namespace GesvenApi.Models.Auditoria;

public class EstatusGeneral : EntidadAuditable
{
    public int EstatusId { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public int ModuloId { get; set; }
    
    public Modulo? Modulo { get; set; }

    public bool EsActivo { get; set; } = true;
}