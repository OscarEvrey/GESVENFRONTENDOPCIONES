using GesvenApi.Data;
using GesvenApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Services.Implementations;

/// <summary>
/// Implementación con caché por request para minimizar roundtrips a la base de datos.
/// </summary>
public class EstatusLookupService : IEstatusLookupService
{
    private readonly GesvenDbContext _contexto;
    private readonly ILogger<EstatusLookupService> _logger;
    // Cache: (Modulo, NombreEstatus) -> EstatusId
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

        // 1. Intento rápido en caché
        if (_cache.TryGetValue((moduloClave, nombreClave), out var idEnCache))
        {
            return idEnCache;
        }

        // 2. Si ya cargamos todo y no está, probamos genérico o fallamos
        if (_catalogoCargado)
        {
            if (_cache.TryGetValue((null, nombreClave), out var idGenerico))
            {
                return idGenerico;
            }
            throw CrearExcepcion(nombre, modulo);
        }

        // 3. Cargar catálogo (Thread-Safe)
        await _sincronizador.WaitAsync(cancellationToken);
        try
        {
            if (!_catalogoCargado)
            {
                // CORRECCIÓN 1: Agregar .Include(e => e.Modulo) para traer el nombre del módulo
                var estatus = await _contexto.EstatusGenerales
                    .AsNoTracking()
                    .Include(e => e.Modulo) 
                    .ToListAsync(cancellationToken);

                foreach (var est in estatus)
                {
                    // CORRECCIÓN 2: Acceder a est.Modulo.Nombre en lugar del objeto est.Modulo
                    // Usamos ?. y ?? por seguridad en caso de inconsistencia de datos viejos
                    var nombreModuloReal = est.Modulo?.Nombre ?? string.Empty;
                    
                    var moduloNormalizado = Normalizar(nombreModuloReal);
                    var nombreNormalizado = Normalizar(est.Nombre);

                    // Guardar en caché: (Modulo, Estatus) -> ID
                    _cache[(moduloNormalizado, nombreNormalizado)] = est.EstatusId;

                    // También guardamos una entrada "sin módulo" (null) como fallback
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

        // 4. Reintentar búsqueda post-carga
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