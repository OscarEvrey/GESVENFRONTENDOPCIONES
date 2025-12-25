namespace GesvenApi.Services.Interfaces;

/// <summary>
/// Servicio para resolver IDs de estatus directamente desde Aud.EstatusGeneral.
/// </summary>
public interface IEstatusLookupService
{
    Task<int> ObtenerIdAsync(string nombre, string? modulo = null, CancellationToken cancellationToken = default);
}
