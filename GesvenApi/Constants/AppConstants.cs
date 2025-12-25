namespace GesvenApi.Constants;

/// <summary>
/// Application-level constants shared across the API.
/// </summary>
public static class AppConstants
{
    public const int UsuarioSistemaId = 1;

    public const decimal FactorCostoSugerido = 0.7m;

    public static class TipoMovimiento
    {
        public const char Entrada = 'E';
        public const char Salida = 'S';
    }

    public static class TipoInstalacion
    {
        public const string Almacen = "Almacen";
        public const string Oficina = "Oficina";
    }
}
