using GesvenApi.Datos;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Obtener cadena de conexión desde configuración
var connectionString = builder.Configuration.GetConnectionString("GesvenDb") 
    ?? "Data Source=gesven_dev.db";

// Configurar Entity Framework Core (SQLite por defecto, SQL Server si aplica)
builder.Services.AddDbContext<GesvenDbContext>(options =>
{
    var esSqlServer =
        connectionString.Contains("Initial Catalog=", StringComparison.OrdinalIgnoreCase) ||
        connectionString.Contains("TrustServerCertificate", StringComparison.OrdinalIgnoreCase) ||
        connectionString.Contains("MultipleActiveResultSets", StringComparison.OrdinalIgnoreCase) ||
        connectionString.Contains("Encrypt=", StringComparison.OrdinalIgnoreCase);

    if (esSqlServer)
    {
        options.UseSqlServer(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

// Agregar controladores
builder.Services.AddControllers();

// Configurar CORS para permitir conexiones del frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",   // Vite dev server
                "http://localhost:3000",   // Posible puerto alternativo
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Configurar OpenAPI/Swagger
builder.Services.AddOpenApi();

var app = builder.Build();

// Aplicar migraciones y crear base de datos automáticamente
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<GesvenDbContext>();
    // Solo crear automáticamente para SQLite (dev local). Para SQL Server real,
    // se asume que la BD ya existe y está administrada fuera de la app.
    if (context.Database.IsSqlite())
    {
        context.Database.EnsureCreated();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Habilitar CORS
app.UseCors("PermitirFrontend");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Mapear controladores
app.MapControllers();

// Endpoint de salud para verificar que la API está funcionando
app.MapGet("/", () => new
{
    mensaje = "API de Gesven funcionando correctamente",
    version = "1.0.0",
    endpoints = new[]
    {
        "GET /api/instalaciones - Lista instalaciones del usuario",
        "GET /api/inventario/{instalacionId} - Productos por instalación",
        "POST /api/compras - Crear orden de compra",
        "GET /api/compras/proveedores - Lista de proveedores"
    }
});

app.Run();
