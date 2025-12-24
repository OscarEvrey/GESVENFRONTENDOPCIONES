using GesvenApi.Datos;
using GesvenApi.Servicios;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Obtener cadena de conexión desde configuración.
var connectionString = builder.Configuration.GetConnectionString("GesvenDb");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Falta la cadena de conexión 'ConnectionStrings:GesvenDb'. Configure appsettings o use la variable de entorno 'ConnectionStrings__GesvenDb'.");
}

// Configurar Entity Framework Core (SQL Server)
builder.Services.AddDbContext<GesvenDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions => sqlOptions.EnableRetryOnFailure());
});

builder.Services.AddScoped<IEstatusLookupService, EstatusLookupService>();

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

    app.Logger.LogInformation(
        "Database provider: {Provider}; DataSource: {DataSource}; Database: {Database}",
        context.Database.ProviderName,
        context.Database.GetDbConnection().DataSource,
        context.Database.GetDbConnection().Database);
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
