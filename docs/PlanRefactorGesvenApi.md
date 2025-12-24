
---

# 🎯 PROMPT PARA AGENTE PERSONALIZADO - REFACTOR BACKEND GESVENAPI

## 📌 Contexto

Necesito refactorizar mi backend **GesvenApi** (ASP.NET Core) del repositorio `GESVENFRONTENDOPCIONES` siguiendo las mejores prácticas de . NET y arquitectura limpia.

---

## 🎯 Objetivo Principal

Refactorizar completamente la carpeta `GesvenApi/` implementando: 

1. ✅ **Clean Architecture** (Arquitectura Limpia)
2. ✅ **Repository Pattern** + **Unit of Work**
3. ✅ **Services Layer** (separar lógica de negocio de controllers)
4. ✅ **FluentValidation** para validaciones robustas
5. ✅ **AutoMapper** para mapeo automático de DTOs
6. ✅ **Middleware personalizado** (manejo de errores, logging)
7. ✅ **Renombrado de carpetas** de español a inglés (estándar . NET)
8. ✅ **Excepciones personalizadas**
9. ✅ **Constantes organizadas**
10. ✅ **Entity Configurations** separadas (Fluent API)

---

## 📂 Estructura Actual (ANTES)

```
GesvenApi/
├── Controladores/              # 11 controllers (español)
│   ├── AjustesController.cs
│   ├── ClientesController.cs
│   ├── ComprasController.cs
│   ├── DashboardController.cs
│   ├── InstalacionesController.cs
│   ├── InventarioController.cs
│   ├── MovimientosController.cs
│   ├── ProductosController.cs
│   ├── ProveedoresController. cs
│   ├── TransferenciasController.cs
│   └── VentasController. cs
│
├── Servicios/                  # Solo 1 servicio (español)
│   └── EstatusLookupService.cs
│
├── Datos/                      # DbContext (español)
│   └── GesvenDbContext.cs
│
├── Modelos/                    # Entidades (español)
│   ├── Auditoria/
│   ├── Base/
│   ├── Compras/
│   ├── Inventario/
│   ├── Organizacion/
│   ├── Seguridad/
│   └── Ventas/
│
├── DTOs/
│   └── DTOs.cs                 # Todos los DTOs en 1 archivo
│
├── Scripts/
│   └── SqlServer_Gesven_Schema. sql
│
├── Properties/
├── ConstantesGesven.cs         # Constantes sin organizar
├── Program.cs                   # Sin middleware personalizado
├── appsettings.json
└── GesvenApi.csproj
```

---

## 📂 Estructura Deseada (DESPUÉS)

```
GesvenApi/
│
├── Controllers/                         # ✅ RENOMBRADO de "Controladores"
│   ├── Base/
│   │   └── BaseApiController.cs        # 🆕 NUEVO
│   ├── AjustesController.cs            # ♻️ REFACTORIZADO (solo HTTP, llama a service)
│   ├── ClientesController.cs           # ♻️ REFACTORIZADO
│   ├── ComprasController.cs            # ♻️ REFACTORIZADO
│   ├── DashboardController.cs          # ♻️ REFACTORIZADO
│   ├── InstalacionesController.cs      # ♻️ REFACTORIZADO
│   ├── InventarioController.cs         # ♻️ REFACTORIZADO
│   ├── MovimientosController.cs        # ♻️ REFACTORIZADO
│   ├── ProductosController.cs          # ♻️ REFACTORIZADO
│   ├── ProveedoresController.cs        # ♻️ REFACTORIZADO
│   ├── TransferenciasController.cs     # ♻️ REFACTORIZADO
│   └── VentasController.cs             # ♻️ REFACTORIZADO
│
├── Services/                            # ✅ RENOMBRADO de "Servicios"
│   ├── Interfaces/                     # 🆕 NUEVO
│   │   ├── IAjusteService.cs
│   │   ├── IClienteService.cs
│   │   ├── ICompraService.cs
│   │   ├── IDashboardService.cs
│   │   ├── IEstatusLookupService.cs
│   │   ├── IInstalacionService.cs
│   │   ├── IInventarioService.cs
│   │   ├── IMovimientoService.cs
│   │   ├── IProductoService.cs
│   │   ├── IProveedorService.cs
│   │   ├── ITransferenciaService.cs
│   │   └── IVentaService.cs
│   │
│   └── Implementations/                # 🆕 NUEVO
│       ├── AjusteService.cs           # 🆕 Lógica de negocio extraída del controller
│       ├── ClienteService.cs          # 🆕 Lógica de negocio extraída del controller
│       ├── CompraService. cs           # 🆕 Lógica de negocio extraída del controller
│       ├── DashboardService.cs        # 🆕 Lógica de negocio extraída del controller
│       ├── EstatusLookupService.cs    # ⬆️ MOVIDO de Servicios/
│       ├── InstalacionService.cs      # 🆕 Lógica de negocio extraída del controller
│       ├── InventarioService.cs       # 🆕 Lógica de negocio extraída del controller
│       ├── MovimientoService.cs       # 🆕 Lógica de negocio extraída del controller
│       ├── ProductoService.cs         # 🆕 Lógica de negocio extraída del controller
│       ├── ProveedorService.cs        # 🆕 Lógica de negocio extraída del controller
│       ├── TransferenciaService. cs    # 🆕 Lógica de negocio extraída del controller
│       └── VentaService.cs            # 🆕 Lógica de negocio extraída del controller
│
├── Data/                                # ✅ RENOMBRADO de "Datos"
│   ├── GesvenDbContext.cs              # ♻️ REFACTORIZADO (quitar OnModelCreating)
│   │
│   ├── Configurations/                 # 🆕 NUEVO:  Fluent API separado
│   │   ├── AjusteInventarioConfiguration.cs
│   │   ├── ClienteConfiguration.cs
│   │   ├── EmpresaConfiguration.cs
│   │   ├── EstatusGeneralConfiguration.cs
│   │   ├── InstalacionConfiguration.cs
│   │   ├── MarcaConfiguration.cs
│   │   ├── MovimientoConfiguration.cs
│   │   ├── OrdenCompraConfiguration.cs
│   │   ├── OrdenCompraDetalleConfiguration.cs
│   │   ├── ProductoConfiguration.cs
│   │   ├── ProveedorConfiguration.cs
│   │   ├── RolConfiguration.cs
│   │   ├── SucursalConfiguration.cs
│   │   ├── TransferenciaConfiguration.cs
│   │   ├── TransferenciaDetalleConfiguration.cs
│   │   ├── UnidadMedidaConfiguration.cs
│   │   ├── UsuarioConfiguration.cs
│   │   ├── VentaConfiguration.cs
│   │   └── VentaDetalleConfiguration.cs
│   │
│   ├── Repositories/                   # 🆕 NUEVO: Repository Pattern
│   │   ├── Interfaces/
│   │   │   ├── IRepository.cs         # 🆕 Genérico
│   │   │   ├── IAjusteRepository.cs
│   │   │   ├── IClienteRepository.cs
│   │   │   ├── IInstalacionRepository.cs
│   │   │   ├── IMovimientoRepository.cs
│   │   │   ├── IOrdenCompraRepository.cs
│   │   │   ├── IProductoRepository.cs
│   │   │   ├── IProveedorRepository.cs
│   │   │   ├── ITransferenciaRepository.cs
│   │   │   └── IVentaRepository.cs
│   │   │
│   │   └── Implementations/
│   │       ├── Repository.cs          # 🆕 Genérico
│   │       ├── AjusteRepository.cs
│   │       ├── ClienteRepository.cs
│   │       ├── InstalacionRepository.cs
│   │       ├── MovimientoRepository.cs
│   │       ├── OrdenCompraRepository.cs
│   │       ├── ProductoRepository.cs
│   │       ├── ProveedorRepository.cs
│   │       ├── TransferenciaRepository.cs
│   │       └── VentaRepository.cs
│   │
│   └── UnitOfWork/                     # 🆕 NUEVO: Unit of Work Pattern
│       ├── IUnitOfWork.cs
│       └── UnitOfWork.cs
│
├── Models/                              # ✅ RENOMBRADO de "Modelos"
│   ├── Entities/                       # ⬆️ MOVER todo de Modelos/* aquí
│   │   ├── Auditoria/
│   │   │   └── EstatusGeneral.cs
│   │   ├── Base/
│   │   │   └── RespuestaApi.cs        # ⚠️ Se moverá a Common/
│   │   ├── Compras/
│   │   │   ├── OrdenCompra.cs
│   │   │   ├── OrdenCompraDetalle.cs
│   │   │   └── Proveedor.cs
│   │   ├── Inventario/
│   │   │   ├── AjusteInventario.cs
│   │   │   ├── Marca.cs
│   │   │   ├── Movimiento.cs
│   │   │   ├── Producto. cs
│   │   │   ├── Transferencia.cs
│   │   │   ├── TransferenciaDetalle.cs
│   │   │   └── UnidadMedida.cs
│   │   ├── Organizacion/
│   │   │   ├── Empresa. cs
│   │   │   ├── Instalacion.cs
│   │   │   └── Sucursal.cs
│   │   ├── Seguridad/
│   │   │   ├── AccesoInstalacion.cs
│   │   │   ├── Rol.cs
│   │   │   └── Usuario.cs
│   │   └── Ventas/
│   │       ├── Cliente.cs
│   │       ├── Venta.cs
│   │       └── VentaDetalle. cs
│   │
│   ├── Dtos/                           # ⬆️ MOVER de DTOs/
│   │   ├── Requests/                  # 🆕 NUEVO:  Separar por tipo
│   │   │   ├── CrearAjusteDto.cs
│   │   │   ├── CrearClienteDto.cs
│   │   │   ├── CrearOrdenCompraDto.cs
│   │   │   ├── LineaOrdenCompraDto.cs
│   │   │   ├── CrearProductoDto.cs
│   │   │   ├── CrearProveedorDto.cs
│   │   │   ├── CrearTransferenciaDto.cs
│   │   │   ├── DetalleTransferenciaDto.cs
│   │   │   ├── CrearVentaDto.cs
│   │   │   └── DetalleVentaDto. cs
│   │   │
│   │   └── Responses/                 # 🆕 NUEVO: Separar por tipo
│   │       ├── AjusteRespuestaDto.cs
│   │       ├── ClienteDto.cs
│   │       ├── DashboardResumenDto.cs
│   │       ├── InstalacionDto.cs
│   │       ├── OrdenCompraRespuestaDto.cs
│   │       ├── DetalleOrdenCompraRespuestaDto.cs
│   │       ├── ProductoDto.cs
│   │       ├── ProductoInventarioDto.cs
│   │       ├── ProveedorDto.cs
│   │       ├── TransferenciaRespuestaDto.cs
│   │       ├── DetalleTransferenciaRespuestaDto.cs
│   │       ├── VentaRespuestaDto.cs
│   │       └── DetalleVentaRespuestaDto.cs
│   │
│   └── Common/                         # 🆕 NUEVO:  Modelos comunes
│       ├── ApiResponse.cs             # 🆕 RENOMBRADO de RespuestaApi
│       ├── PagedResult.cs             # 🆕 Para paginación futura
│       └── ErrorDetails.cs            # 🆕 Para errores estructurados
│
├── Validators/                         # 🆕 NUEVO: FluentValidation
│   ├── CrearAjusteDtoValidator.cs
│   ├── CrearClienteDtoValidator.cs
│   ├── CrearOrdenCompraDtoValidator.cs
│   ├── CrearProductoDtoValidator.cs
│   ├── CrearProveedorDtoValidator.cs
│   ├── CrearTransferenciaDtoValidator.cs
│   └── CrearVentaDtoValidator.cs
│
├── Middleware/                         # 🆕 NUEVO: Middleware personalizado
│   ├── ExceptionHandlingMiddleware.cs
│   ├── RequestLoggingMiddleware.cs
│   └── ValidationMiddleware.cs
│
├── Extensions/                         # 🆕 NUEVO: Extension methods
│   ├── ServiceCollectionExtensions.cs
│   ├── ApplicationBuilderExtensions.cs
│   ├── QueryableExtensions.cs
│   └── DateTimeExtensions.cs
│
├── Mappings/                           # 🆕 NUEVO: AutoMapper Profiles
│   ├── AjusteProfile.cs
│   ├── ClienteProfile.cs
│   ├── CompraProfile.cs
│   ├── InstalacionProfile.cs
│   ├── ProductoProfile.cs
│   ├── ProveedorProfile. cs
│   ├── TransferenciaProfile.cs
│   └── VentaProfile.cs
│
├── Constants/                          # 🆕 NUEVO: Constantes organizadas
│   ├── AppConstants.cs                # ♻️ REFACTOR de ConstantesGesven. cs
│   ├── ErrorMessages.cs               # 🆕 Mensajes de error
│   ├── SuccessMessages.cs             # 🆕 Mensajes de éxito
│   └── StatusConstants.cs             # 🆕 Nombres de estatus
│
├── Exceptions/                         # 🆕 NUEVO: Custom exceptions
│   ├── BusinessException.cs
│   ├── NotFoundException.cs
│   ├── ValidationException.cs
│   └── UnauthorizedException.cs
│
├── Scripts/
│   └── SqlServer_Gesven_Schema.sql    # ♻️ MEJORAR: Agregar más datos
│
├── Properties/
├── Program.cs                          # ♻️ REFACTORIZADO
├── appsettings.json
├── appsettings.Development.json
└── GesvenApi.csproj                    # ♻️ ACTUALIZAR: Agregar NuGet
```

---

## 🔧 Paquetes NuGet a Agregar

Actualizar `GesvenApi.csproj`:

```xml
<PackageReference Include="AutoMapper. Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
```

---

## 📝 Instrucciones Específicas

### 1️⃣ **RENOMBRAR CARPETAS**

```
Controladores/ → Controllers/
Servicios/     → Services/
Datos/         → Data/
Modelos/       → Models/
```

⚠️ **Actualizar todos los namespaces** en consecuencia.

---

### 2️⃣ **CREAR Repository Pattern**

**`Data/Repositories/Interfaces/IRepository.cs`** (genérico):

```csharp
using System. Linq. Expressions;

namespace GesvenApi.Data.Repositories. Interfaces;

public interface IRepository<T> where T : class
{
    Task<T? > ObtenerPorIdAsync(int id);
    Task<IEnumerable<T>> ObtenerTodosAsync();
    Task<IEnumerable<T>> BuscarAsync(Expression<Func<T, bool>> predicado);
    Task AgregarAsync(T entidad);
    Task AgregarRangoAsync(IEnumerable<T> entidades);
    void Actualizar(T entidad);
    void Eliminar(T entidad);
    void EliminarRango(IEnumerable<T> entidades);
    Task<bool> ExisteAsync(Expression<Func<T, bool>> predicado);
    Task<int> ContarAsync(Expression<Func<T, bool>> predicado);
}
```

**`Data/Repositories/Implementations/Repository.cs`**:

```csharp
using System.Linq. Expressions;
using GesvenApi.Data.Repositories. Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Data. Repositories.Implementations;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly GesvenDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(GesvenDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> ObtenerPorIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> ObtenerTodosAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> BuscarAsync(Expression<Func<T, bool>> predicado)
    {
        return await _dbSet.Where(predicado).ToListAsync();
    }

    public virtual async Task AgregarAsync(T entidad)
    {
        await _dbSet.AddAsync(entidad);
    }

    public virtual async Task AgregarRangoAsync(IEnumerable<T> entidades)
    {
        await _dbSet.AddRangeAsync(entidades);
    }

    public virtual void Actualizar(T entidad)
    {
        _dbSet.Update(entidad);
    }

    public virtual void Eliminar(T entidad)
    {
        _dbSet.Remove(entidad);
    }

    public virtual void EliminarRango(IEnumerable<T> entidades)
    {
        _dbSet.RemoveRange(entidades);
    }

    public virtual async Task<bool> ExisteAsync(Expression<Func<T, bool>> predicado)
    {
        return await _dbSet.AnyAsync(predicado);
    }

    public virtual async Task<int> ContarAsync(Expression<Func<T, bool>> predicado)
    {
        return await _dbSet.CountAsync(predicado);
    }
}
```

**Crear repositorios específicos:**

**Ejemplo - `Data/Repositories/Interfaces/IAjusteRepository.cs`:**

```csharp
using GesvenApi.Models. Entities. Inventario;

namespace GesvenApi.Data.Repositories.Interfaces;

public interface IAjusteRepository : IRepository<AjusteInventario>
{
    Task<List<AjusteInventario>> ObtenerConDetallesAsync(int?  instalacionId = null);
}
```

**Ejemplo - `Data/Repositories/Implementations/AjusteRepository.cs`:**

```csharp
using GesvenApi.Data.Repositories.Interfaces;
using GesvenApi. Models.Entities.Inventario;
using Microsoft.EntityFrameworkCore;

namespace GesvenApi.Data.Repositories.Implementations;

public class AjusteRepository : Repository<AjusteInventario>, IAjusteRepository
{
    public AjusteRepository(GesvenDbContext context) : base(context) { }

    public async Task<List<AjusteInventario>> ObtenerConDetallesAsync(int? instalacionId = null)
    {
        var query = _dbSet
            .Include(a => a.Instalacion)
            .Include(a => a.Producto)
            .AsQueryable();

        if (instalacionId.HasValue)
        {
            query = query.Where(a => a.InstalacionId == instalacionId. Value);
        }

        return await query.OrderByDescending(a => a.FechaAjuste).ToListAsync();
    }
}
```

**Repetir para:**
- `IProductoRepository` / `ProductoRepository` (método:  `ObtenerPorIdEnInstalacionAsync`)
- `IMovimientoRepository` / `MovimientoRepository` (método: `ObtenerSaldoActualAsync`)
- `IClienteRepository` / `ClienteRepository`
- `IProveedorRepository` / `ProveedorRepository`
- `IOrdenCompraRepository` / `OrdenCompraRepository`
- `IVentaRepository` / `VentaRepository`
- `ITransferenciaRepository` / `TransferenciaRepository`
- `IInstalacionRepository` / `InstalacionRepository`

---

### 3️⃣ **CREAR Unit of Work**

**`Data/UnitOfWork/IUnitOfWork.cs`:**

```csharp
using GesvenApi.Data.Repositories.Interfaces;

namespace GesvenApi.Data.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    IAjusteRepository Ajustes { get; }
    IClienteRepository Clientes { get; }
    IInstalacionRepository Instalaciones { get; }
    IMovimientoRepository Movimientos { get; }
    IOrdenCompraRepository OrdenesCompra { get; }
    IProductoRepository Productos { get; }
    IProveedorRepository Proveedores { get; }
    ITransferenciaRepository Transferencias { get; }
    IVentaRepository Ventas { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
```

**`Data/UnitOfWork/UnitOfWork.cs`:**

```csharp
using GesvenApi. Data.Repositories.Implementations;
using GesvenApi.Data. Repositories.Interfaces;
using Microsoft.EntityFrameworkCore. Storage;

namespace GesvenApi.Data.UnitOfWork;

public class UnitOfWork :  IUnitOfWork
{
    private readonly GesvenDbContext _context;
    private IDbContextTransaction?  _transaction;

    public IAjusteRepository Ajustes { get; }
    public IClienteRepository Clientes { get; }
    public IInstalacionRepository Instalaciones { get; }
    public IMovimientoRepository Movimientos { get; }
    public IOrdenCompraRepository OrdenesCompra { get; }
    public IProductoRepository Productos { get; }
    public IProveedorRepository Proveedores { get; }
    public ITransferenciaRepository Transferencias { get; }
    public IVentaRepository Ventas { get; }

    public UnitOfWork(GesvenDbContext context)
    {
        _context = context;
        Ajustes = new AjusteRepository(context);
        Clientes = new ClienteRepository(context);
        Instalaciones = new InstalacionRepository(context);
        Movimientos = new MovimientoRepository(context);
        OrdenesCompra = new OrdenCompraRepository(context);
        Productos = new ProductoRepository(context);
        Proveedores = new ProveedorRepository(context);
        Transferencias = new TransferenciaRepository(context);
        Ventas = new VentaRepository(context);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database. BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction. CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction. DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
```

---

### 4️⃣ **CREAR Services Layer**

**Ejemplo completo - `Services/Implementations/AjusteService.cs`:**

```csharp
using AutoMapper;
using GesvenApi.Constants;
using GesvenApi. Data.UnitOfWork;
using GesvenApi.Exceptions;
using GesvenApi. Models.Common;
using GesvenApi. Models.Dtos.Requests;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Models.Entities.Inventario;
using GesvenApi.Services.Interfaces;

namespace GesvenApi.Services. Implementations;

public class AjusteService : IAjusteService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AjusteService> _logger;
    private readonly IMapper _mapper;

    public AjusteService(
        IUnitOfWork unitOfWork,
        ILogger<AjusteService> logger,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<AjusteRespuestaDto>>> ObtenerAjustesAsync(int? instalacionId = null)
    {
        var ajustes = await _unitOfWork.Ajustes.ObtenerConDetallesAsync(instalacionId);
        var ajustesDto = _mapper.Map<List<AjusteRespuestaDto>>(ajustes);

        return ApiResponse<List<AjusteRespuestaDto>>.Success(
            $"Se encontraron {ajustes.Count} ajustes", 
            ajustesDto);
    }

    public async Task<ApiResponse<AjusteRespuestaDto>> CrearAjusteAsync(CrearAjusteDto dto)
    {
        // Validación de negocio
        if (dto. Cantidad <= 0)
        {
            return ApiResponse<AjusteRespuestaDto>.Error(ErrorMessages.CantidadDebeSerMayorACero);
        }

        // Verificar producto existe
        var producto = await _unitOfWork.Productos.ObtenerPorIdEnInstalacionAsync(
            dto.ProductoId, 
            dto.InstalacionId);

        if (producto is null)
        {
            throw new NotFoundException(ErrorMessages.ProductoNoExisteEnInstalacion);
        }

        // Calcular saldo
        var saldoAnterior = await _unitOfWork.Movimientos.ObtenerSaldoActualAsync(
            dto.ProductoId, 
            dto. InstalacionId);
            
        var saldoNuevo = dto.TipoAjuste == AppConstants.TipoMovimiento.Entrada
            ? saldoAnterior + dto.Cantidad
            :  saldoAnterior - dto.Cantidad;

        if (saldoNuevo < 0)
        {
            return ApiResponse<AjusteRespuestaDto>.Error(ErrorMessages.AjusteProvocariaSaldoNegativo);
        }

        // Transacción explícita
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var ajuste = new AjusteInventario
            {
                InstalacionId = dto.InstalacionId,
                ProductoId = dto.ProductoId,
                TipoAjuste = dto. TipoAjuste,
                Cantidad = dto.Cantidad,
                StockAnterior = saldoAnterior,
                StockNuevo = saldoNuevo,
                Motivo = dto.Motivo,
                Observaciones = dto.Observaciones,
                FechaAjuste = DateTime.UtcNow,
                CreadoEn = DateTime.UtcNow,
                CreadoPor = AppConstants. UsuarioSistemaId,
                ActualizadoEn = DateTime.UtcNow,
                ActualizadoPor = AppConstants.UsuarioSistemaId
            };

            await _unitOfWork.Ajustes.AgregarAsync(ajuste);

            var movimiento = new Movimiento
            {
                InstalacionId = dto.InstalacionId,
                ProductoId = dto.ProductoId,
                TipoMovimiento = dto.TipoAjuste,
                Cantidad = dto.Cantidad,
                SaldoFinal = saldoNuevo,
                CreadoEn = DateTime.UtcNow,
                CreadoPor = AppConstants.UsuarioSistemaId
            };

            await _unitOfWork.Movimientos.AgregarAsync(movimiento);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            var respuesta = _mapper.Map<AjusteRespuestaDto>(ajuste);
            respuesta.ProductoNombre = producto.Nombre;

            return ApiResponse<AjusteRespuestaDto>.Success(
                SuccessMessages.AjusteRegistrado, 
                respuesta);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error al crear ajuste");
            throw new BusinessException(ErrorMessages.ErrorAlProcesarAjuste, ex);
        }
    }
}
```

**Repetir patrón similar para:**
- `ClienteService`
- `CompraService`
- `DashboardService`
- `InstalacionService`
- `InventarioService`
- `MovimientoService`
- `ProductoService`
- `ProveedorService`
- `TransferenciaService`
- `VentaService`

---

### 5️⃣ **REFACTORIZAR Controllers**

**Ejemplo - `Controllers/AjustesController.cs` (SIMPLIFICADO):**

```csharp
using GesvenApi.Models.Common;
using GesvenApi. Models.Dtos.Requests;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Services.Interfaces;
using Microsoft.AspNetCore. Mvc;

namespace GesvenApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AjustesController : ControllerBase
{
    private readonly IAjusteService _ajusteService;

    public AjustesController(IAjusteService ajusteService)
    {
        _ajusteService = ajusteService;
    }

    /// <summary>
    /// GET /api/ajustes - Lista ajustes por instalación
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<AjusteRespuestaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<AjusteRespuestaDto>>>> ObtenerAjustes(
        [FromQuery] int? instalacionId = null)
    {
        var resultado = await _ajusteService. ObtenerAjustesAsync(instalacionId);
        return Ok(resultado);
    }

    /// <summary>
    /// POST /api/ajustes - Crea un ajuste y registra el movimiento
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<AjusteRespuestaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AjusteRespuestaDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<AjusteRespuestaDto>>> CrearAjuste(
        [FromBody] CrearAjusteDto dto)
    {
        var resultado = await _ajusteService.CrearAjusteAsync(dto);
        
        if (! resultado.Success)
        {
            return BadRequest(resultado);
        }

        return Ok(resultado);
    }
}
```

**✅ TODO EL CONTROLLER ahora solo maneja HTTP.  TODA la lógica está en el Service.**

**Repetir para los 11 controllers.**

---

### 6️⃣ **CREAR FluentValidation Validators**

**`Validators/CrearAjusteDtoValidator.cs`:**

```csharp
using FluentValidation;
using GesvenApi.Models. Dtos.Requests;

namespace GesvenApi.Validators;

public class CrearAjusteDtoValidator : AbstractValidator<CrearAjusteDto>
{
    public CrearAjusteDtoValidator()
    {
        RuleFor(x => x.InstalacionId)
            .GreaterThan(0)
            .WithMessage("El ID de instalación debe ser mayor a 0");

        RuleFor(x => x.ProductoId)
            .GreaterThan(0)
            .WithMessage("El ID de producto debe ser mayor a 0");

        RuleFor(x => x. Cantidad)
            .GreaterThan(0)
            .WithMessage("La cantidad debe ser mayor a 0");

        RuleFor(x => x.TipoAjuste)
            .Must(t => t == 'E' || t == 'S')
            .WithMessage("El tipo de ajuste debe ser 'E' (Entrada) o 'S' (Salida)");

        RuleFor(x => x. Motivo)
            .NotEmpty()
            .WithMessage("El motivo es obligatorio")
            .MaximumLength(200)
            .WithMessage("El motivo no puede exceder 200 caracteres");

        RuleFor(x => x.Observaciones)
            .MaximumLength(500)
            .When(x => ! string.IsNullOrEmpty(x. Observaciones))
            .WithMessage("Las observaciones no pueden exceder 500 caracteres");
    }
}
```

**Crear validators para:**
- `CrearClienteDtoValidator`
- `CrearOrdenCompraDtoValidator`
- `CrearProductoDtoValidator`
- `CrearProveedorDtoValidator`
- `CrearTransferenciaDtoValidator`
- `CrearVentaDtoValidator`

---

### 7️⃣ **CREAR AutoMapper Profiles**

**`Mappings/AjusteProfile.cs`:**

```csharp
using AutoMapper;
using GesvenApi.Models. Dtos.Responses;
using GesvenApi. Models.Entities.Inventario;

namespace GesvenApi.Mappings;

public class AjusteProfile : Profile
{
    public AjusteProfile()
    {
        CreateMap<AjusteInventario, AjusteRespuestaDto>()
            .ForMember(dest => dest.InstalacionNombre, 
                opt => opt.MapFrom(src => src. Instalacion != null ? src.Instalacion.Nombre :  string.Empty))
            .ForMember(dest => dest.ProductoNombre, 
                opt => opt.MapFrom(src => src.Producto != null ? src. Producto.Nombre : string. Empty));
    }
}
```

**Crear profiles para:**
- `ClienteProfile`
- `CompraProfile`
- `InstalacionProfile`
- `ProductoProfile`
- `ProveedorProfile`
- `TransferenciaProfile`
- `VentaProfile`

---

### 8️⃣ **CREAR Middleware**

**`Middleware/ExceptionHandlingMiddleware.cs`:**

```csharp
using System.Net;
using System.Text. Json;
using GesvenApi.Exceptions;
using GesvenApi.Models. Common;

namespace GesvenApi.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = exception switch
        {
            NotFoundException notFoundEx => (HttpStatusCode. NotFound, 
                ApiResponse<object>.Error(notFoundEx.Message)),
            ValidationException validationEx => (HttpStatusCode.BadRequest, 
                ApiResponse<object>.Error(validationEx.Message)),
            BusinessException businessEx => (HttpStatusCode.BadRequest, 
                ApiResponse<object>.Error(businessEx.Message)),
            UnauthorizedException unauthorizedEx => (HttpStatusCode.Unauthorized, 
                ApiResponse<object>.Error(unauthorizedEx. Message)),
            _ => (HttpStatusCode.InternalServerError, 
                ApiResponse<object>. Error("An unexpected error occurred"))
        };

        context.Response.StatusCode = (int)response.Item1;
        await context.Response.WriteAsync(JsonSerializer.Serialize(response.Item2));
    }
}
```

**`Middleware/RequestLoggingMiddleware.cs`:**

```csharp
namespace GesvenApi.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation(
            "Request:  {Method} {Path} from {RemoteIp}",
            context.Request.Method,
            context.Request.Path,
            context.Connection.RemoteIpAddress);

        await _next(context);

        _logger.LogInformation(
            "Response: {StatusCode}",
            context.Response.StatusCode);
    }
}
```

---

### 9️⃣ **CREAR Custom Exceptions**

**`Exceptions/BusinessException.cs`:**

```csharp
namespace GesvenApi.Exceptions;

public class BusinessException : Exception
{
    public BusinessException(string message) : base(message) { }
    public BusinessException(string message, Exception innerException) 
        : base(message, innerException) { }
}
```

**`Exceptions/NotFoundException.cs`:**

```csharp
namespace GesvenApi.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}
```

**`Exceptions/ValidationException.cs`:**

```csharp
namespace GesvenApi.Exceptions;

public class ValidationException : Exception
{
    public ValidationException(string message) : base(message) { }
}
```

**`Exceptions/UnauthorizedException.cs`:**

```csharp
namespace GesvenApi.Exceptions;

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message) { }
}
```

---

### 🔟 **CREAR Constants**

**`Constants/AppConstants.cs`:**

```csharp
namespace GesvenApi.Constants;

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
        public const string Tienda = "Tienda";
    }

    public static class EstatusNombres
    {
        public const string Pendiente = "Pendiente";
        public const string Aprobada = "Aprobada";
        public const string Rechazada = "Rechazada";
        public const string Recibida = "Recibida";
        public const string Facturada = "Facturada";
        public const string Cancelada = "Cancelada";
        public const string EnTransito = "EnTransito";
    }
}
```

**`Constants/ErrorMessages.cs`:**

```csharp
namespace GesvenApi.Constants;

public static class ErrorMessages
{
    public const string CantidadDebeSerMayorACero = "La cantidad debe ser mayor a cero";
    public const string ProductoNoExisteEnInstalacion = "El producto no existe en la instalación";
    public const string AjusteProvocariaSaldoNegativo = "El ajuste provocaría saldo negativo";
    public const string ErrorAlProcesarAjuste = "Error al procesar el ajuste";
    public const string ClienteNoEncontrado = "Cliente no encontrado";
    public const string ProveedorNoEncontrado = "Proveedor no encontrado";
    public const string ProductoNoEncontrado = "Producto no encontrado";
    public const string InstalacionNoEncontrada = "Instalación no encontrada";
    public const string OrdenCompraNoEncontrada = "Orden de compra no encontrada";
    public const string VentaNoEncontrada = "Venta no encontrada";
    public const string TransferenciaNoEncontrada = "Transferencia no encontrada";
}
```

**`Constants/SuccessMessages.cs`:**

```csharp
namespace GesvenApi.Constants;

public static class SuccessMessages
{
    public const string AjusteRegistrado = "Ajuste registrado exitosamente";
    public const string ClienteCreado = "Cliente creado exitosamente";
    public const string ClienteActualizado = "Cliente actualizado exitosamente";
    public const string ProveedorCreado = "Proveedor creado exitosamente";
    public const string ProductoCreado = "Producto creado exitosamente";
    public const string OrdenCompraCreada = "Orden de compra creada exitosamente";
    public const string OrdenCompraAprobada = "Orden de compra aprobada exitosamente";
    public const string VentaCreada = "Venta creada exitosamente";
    public const string TransferenciaCreada = "Transferencia creada exitosamente";
}
```

---

### 1️⃣1️⃣ **CREAR ApiResponse**

**`Models/Common/ApiResponse.cs`:**

```csharp
namespace GesvenApi.Models.Common;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T?  Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResponse<T> Success(string message, T data)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> Error(string message, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}
```

---

### 1️⃣2️⃣ **ACTUALIZAR Program.cs**

```csharp
using FluentValidation;
using FluentValidation.AspNetCore;
using GesvenApi.Data;
using GesvenApi.Data.UnitOfWork;
using GesvenApi.Middleware;
using GesvenApi. Services.Implementations;
using GesvenApi. Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Database
var connectionString = builder.Configuration.GetConnectionString("GesvenDb");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Falta la cadena de conexión 'ConnectionStrings:GesvenDb'.");
}

builder.Services.AddDbContext<GesvenDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions => sqlOptions.EnableRetryOnFailure());
});

// UnitOfWork
builder.Services. AddScoped<IUnitOfWork, UnitOfWork>();

// Services
builder.Services.AddScoped<IAjusteService, AjusteService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<ICompraService, CompraService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IInstalacionService, InstalacionService>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<IMovimientoService, MovimientoService>();
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IProveedorService, ProveedorService>();
builder.Services.AddScoped<ITransferenciaService, TransferenciaService>();
builder.Services.AddScoped<IVentaService, VentaService>();
builder.Services.AddScoped<IEstatusLookupService, EstatusLookupService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation
builder.Services. AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// OpenAPI/Swagger
builder.Services.AddOpenApi();

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("PermitirFrontend");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.MapGet("/", () => new
{
    mensaje = "API de Gesven funcionando correctamente",
    version = "2.0.0",
    arquitectura = "Clean Architecture"
});

app.Run();
```

---

### 1️⃣3️⃣ **SEPARAR DTOs en Requests/Responses**

**Mover de `DTOs/DTOs.cs` a archivos individuales:**

**`Models/Dtos/Requests/CrearAjusteDto. cs`:**

```csharp
namespace GesvenApi.Models.Dtos.Requests;

public class CrearAjusteDto
{
    public int InstalacionId { get; set; }
    public int ProductoId { get; set; }
    public char TipoAjuste { get; set; } // 'E' = Entrada, 'S' = Salida
    public decimal Cantidad { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string?  Observaciones { get; set; }
}
```

**`Models/Dtos/Responses/AjusteRespuestaDto.cs`:**

```csharp
namespace GesvenApi.Models.Dtos.Responses;

public class AjusteRespuestaDto
{
    public int AjusteId { get; set; }
    public int InstalacionId { get; set; }
    public string InstalacionNombre { get; set; } = string.Empty;
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public char TipoAjuste { get; set; }
    public decimal Cantidad { get; set; }
    public decimal StockAnterior { get; set; }
    public decimal StockNuevo { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string?  Observaciones { get; set; }
    public DateTime FechaAjuste { get; set; }
}
```

**Repetir para todos los DTOs.**

---

### 1️⃣4️⃣ **CREAR Entity Configurations**

**Ejemplo - `Data/Configurations/AjusteInventarioConfiguration.cs`:**

```csharp
using GesvenApi.Models.Entities.Inventario;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore. Metadata.Builders;

namespace GesvenApi.Data. Configurations;

public class AjusteInventarioConfiguration : IEntityTypeConfiguration<AjusteInventario>
{
    public void Configure(EntityTypeBuilder<AjusteInventario> builder)
    {
        builder.ToTable("AjusteInventario", "Inv");
        
        builder.HasKey(e => e.AjusteId);

        builder.Property(e => e.TipoAjuste)
            .IsRequired()
            .HasMaxLength(1);

        builder.Property(e => e.Cantidad)
            .HasPrecision(18, 4);

        builder.Property(e => e.StockAnterior)
            .HasPrecision(18, 4);

        builder.Property(e => e.StockNuevo)
            .HasPrecision(18, 4);

        builder.Property(e => e.Motivo)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Observaciones)
            .HasMaxLength(500);

        builder.HasOne(e => e. Instalacion)
            .WithMany()
            .HasForeignKey(e => e.InstalacionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Producto)
            .WithMany()
            .HasForeignKey(e => e.ProductoId)
            .OnDelete(DeleteBehavior. Restrict);

        builder.HasIndex(e => e.InstalacionId);
        builder.HasIndex(e => e.ProductoId);
        builder.HasIndex(e => e.FechaAjuste);
    }
}
```

**Crear configurations para TODAS las entidades.**

**Actualizar `Data/GesvenDbContext.cs`:**

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    
    // Aplicar todas las configuraciones automáticamente
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(GesvenDbContext).Assembly);
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Estructura
- [ ] Renombrar carpetas (Controladores → Controllers, etc.)
- [ ] Crear nuevas carpetas (Services/Interfaces, Repositories, etc.)
- [ ] Actualizar todos los namespaces

### Fase 2: Data Layer
- [ ] Crear IRepository<T> y Repository<T>
- [ ] Crear 9 repositorios específicos (interfaces + implementaciones)
- [ ] Crear IUnitOfWork y UnitOfWork
- [ ] Crear 18+ Entity Configurations
- [ ] Refactorizar GesvenDbContext

### Fase 3: Services Layer
- [ ] Crear 12 interfaces de servicios
- [ ] Implementar 12 servicios completos

### Fase 4: Controllers
- [ ] Refactorizar 11 controllers (quitar lógica, solo HTTP)

### Fase 5: Validación y Mapeo
- [ ] Crear 7 validators (FluentValidation)
- [ ] Crear 8 AutoMapper profiles
- [ ] Separar DTOs en Requests/Responses

### Fase 6: Infraestructura
- [ ] Crear 2 middlewares
- [ ] Crear 4 custom exceptions
- [ ] Crear 3 archivos de constantes
- [ ] Crear ApiResponse mejorado
- [ ] Actualizar Program.cs
- [ ] Actualizar GesvenApi.csproj (NuGet)

### Fase 7: SQL
- [ ] Mejorar SqlServer_Gesven_Schema.sql con más datos

---

## ⚠️ REGLAS IMPORTANTES

1. **NO eliminar archivos** hasta que todo funcione
2. **Mantener compatibilidad** con frontend existente
3. **NO cambiar** nombres de endpoints HTTP
4. **NO cambiar** estructura de DTOs de response (para frontend)
5. **Probar cada endpoint** después de refactor
6. **SQL Server ya funciona**, no hay datos mock

---

## 🎯 RESULTADO ESPERADO

Un backend **enterprise-grade** con: 

✅ Clean Architecture  
✅ SOLID Principles  
✅ Repository Pattern  
✅ Unit of Work  
✅ Dependency Injection  
✅ FluentValidation  
✅ AutoMapper  
✅ Custom Middleware  
✅ Centralized Error Handling  
✅ Transaction Management  
✅ Separation of Concerns  
✅ . NET Best Practices  
