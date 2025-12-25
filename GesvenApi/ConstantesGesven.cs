namespace GesvenApi;

/// <summary>
/// Constantes del sistema Gesven.
/// </summary>
public static class ConstantesGesven
{
    /// <summary>
    /// ID del usuario del sistema utilizado para auditoría automática.
    /// </summary>
    public const int UsuarioSistemaId = 1;

    /// <summary>
    /// Factor para calcular el costo sugerido a partir del precio unitario.
    /// El costo sugerido es aproximadamente el 70% del precio de venta.
    /// </summary>
    public const decimal FactorCostoSugerido = 0.7m;

    /// <summary>
    /// Nombres de estatus para mostrar en la interfaz.
    /// </summary>
    public static class EstatusNombres
    {
        public const string Activo = "Activo";
        public const string Inactivo = "Inactivo";
        public const string Pendiente = "Pendiente";
        public const string Aprobada = "Aprobada";
        public const string Rechazada = "Rechazada";
        public const string Recibida = "Recibida";
    }

    /// <summary>
    /// Tipos de movimiento de inventario.
    /// </summary>
    public static class TipoMovimiento
    {
        /// <summary>
        /// Entrada de inventario.
        /// </summary>
        public const char Entrada = 'E';

        /// <summary>
        /// Salida de inventario.
        /// </summary>
        public const char Salida = 'S';
    }

    /// <summary>
    /// Tipos de instalación.
    /// </summary>
    public static class TipoInstalacion
    {
        public const string Almacen = "Almacen";
        public const string Oficina = "Oficina";
    }
}

