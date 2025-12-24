using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GesvenApi.Datos;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Servicios;

/// <summary>
/// Servicio para resolver IDs de estatus directamente desde la tabla Aud.EstatusGeneral y evitar valores hardcodeados.
/// </summary>
public interface IEstatusLookupService
{
    /// <summary>
    /// Obtiene el ID de un estatus por nombre y, opcionalmente, por módulo. Devuelve el valor real de la tabla.
    /// </summary>
    /// <param name="nombre">Nombre del estatus (ej. "Pendiente").</param>
    /// <param name="modulo">Módulo al que pertenece (ej. "Compras", "Ventas"). Opcional.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>ID del estatus solicitado.</returns>
    Task<int> ObtenerIdAsync(string nombre, string? modulo = null, CancellationToken cancellationToken = default);
}

/// <summary>
/// Implementación con caché por request para minimizar roundtrips a la base de datos.
/// </summary>
public class EstatusLookupService : IEstatusLookupService
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<EstatusLookupService> _logger;
    private readonly Dictionary<(string? modulo, string nombre), int> _cache = new();
    private bool _catalogoCargado;
    private readonly SemaphoreSlim _sincronizador = new(1, 1);

    public EstatusLookupService(GesvenDbContext contexto, ILogger<EstatusLookupService> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    public async Task<int> ObtenerIdAsync(string nombre, string? modulo = null, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(nombre))
        {
            throw new ArgumentException("El nombre del estatus es obligatorio", nameof(nombre));
        }

        var nombreClave = Normalizar(nombre);
        var moduloClave = string.IsNullOrWhiteSpace(modulo) ? null : Normalizar(modulo!);

        if (_cache.TryGetValue((moduloClave, nombreClave), out var idEnCache))
        {
            return idEnCache;
        }

        if (_catalogoCargado)
        {
            if (_cache.TryGetValue((null, nombreClave), out var idGenerico))
            {
                return idGenerico;
            }

            throw CrearExcepcion(nombre, modulo);
        }

        await _sincronizador.WaitAsync(cancellationToken);
        try
        {
            if (!_catalogoCargado)
            {
                var estatus = await _contexto.EstatusGenerales.AsNoTracking().ToListAsync(cancellationToken);
                foreach (var est in estatus)
                {
                    var moduloNormalizado = Normalizar(est.Modulo);
                    var nombreNormalizado = Normalizar(est.Nombre);

                    _cache[(moduloNormalizado, nombreNormalizado)] = est.EstatusId;

                    // Fallback global por nombre en caso de no especificar módulo o que cambie en el futuro.
                    if (!_cache.ContainsKey((null, nombreNormalizado)))
                    {
                        _cache[(null, nombreNormalizado)] = est.EstatusId;
                    }
                }

                _catalogoCargado = true;
                _logger.LogDebug("Catálogo de estatus cacheado: {Cantidad}", _cache.Count);
            }
        }
        finally
        {
            _sincronizador.Release();
        }

        if (_cache.TryGetValue((moduloClave, nombreClave), out var idCargado))
        {
            return idCargado;
        }

        if (_cache.TryGetValue((null, nombreClave), out var idCargadoGenerico))
        {
            return idCargadoGenerico;
        }

        throw CrearExcepcion(nombre, modulo);
    }

    private static string Normalizar(string valor)
    {
        return valor.Trim().ToUpperInvariant();
    }

    private static InvalidOperationException CrearExcepcion(string nombre, string? modulo)
    {
        var moduloMensaje = modulo is null ? string.Empty : $" para el módulo '{modulo}'";
        return new InvalidOperationException($"No se encontró el estatus '{nombre}'{moduloMensaje} en Aud.EstatusGeneral.");
    }
}
