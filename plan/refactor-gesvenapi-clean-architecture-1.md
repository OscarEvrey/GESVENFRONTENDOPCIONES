---
goal: Refactorizar GesvenApi implementando Clean Architecture, Repository Pattern, Unit of Work, Services Layer, FluentValidation, AutoMapper y mejores prácticas .NET
version: 1.0
date_created: 2024-12-24
last_updated: 2024-12-24
owner: Equipo Backend Gesven
status: 'Planned'
tags: [refactor, architecture, clean-architecture, dotnet, backend, enterprise]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Este plan detalla la refactorización completa del backend **GesvenApi** (ASP.NET Core 9.0) para implementar Clean Architecture, patrones de diseño empresariales y mejores prácticas de .NET. El objetivo es transformar el código actual en una solución enterprise-grade con separación de responsabilidades, testabilidad y mantenibilidad.

## 1. Requirements & Constraints

### Requisitos Funcionales

- **REQ-001**: Mantener compatibilidad total con el frontend existente (Vite/React)
- **REQ-002**: Conservar todos los endpoints HTTP actuales sin cambios en URLs
- **REQ-003**: Mantener la estructura de DTOs de respuesta para evitar breaking changes
- **REQ-004**: Preservar la conexión con SQL Server existente

### Requisitos de Arquitectura

- **ARC-001**: Implementar Clean Architecture con separación clara de capas
- **ARC-002**: Implementar Repository Pattern genérico y específico
- **ARC-003**: Implementar Unit of Work para gestión de transacciones
- **ARC-004**: Separar lógica de negocio en Services Layer
- **ARC-005**: Implementar FluentValidation para validaciones robustas
- **ARC-006**: Implementar AutoMapper para mapeo automático de DTOs
- **ARC-007**: Implementar Middleware personalizado para errores y logging

### Requisitos de Código

- **COD-001**: Renombrar carpetas de español a inglés (estándar .NET)
- **COD-002**: Separar DTOs en archivos individuales (Requests/Responses)
- **COD-003**: Crear Entity Configurations separadas (Fluent API)
- **COD-004**: Implementar excepciones personalizadas
- **COD-005**: Organizar constantes en archivos dedicados

### Constraints

- **CON-001**: NO eliminar archivos hasta que la funcionalidad esté verificada
- **CON-002**: NO cambiar nombres de endpoints HTTP existentes
- **CON-003**: NO modificar estructura de DTOs de response usados por frontend
- **CON-004**: SQL Server ya está funcionando con datos reales, no usar datos mock
- **CON-005**: Probar cada endpoint después de cada fase de refactorización

### Guidelines

- **GUD-001**: Seguir convenciones de nomenclatura .NET (PascalCase, sufijos Service/Repository/Controller)
- **GUD-002**: Usar async/await consistentemente en todas las operaciones I/O
- **GUD-003**: Documentar APIs públicas con XML comments
- **GUD-004**: Aplicar principios SOLID en todo el código nuevo

### Patterns

- **PAT-001**: Repository Pattern para abstracción de acceso a datos
- **PAT-002**: Unit of Work Pattern para gestión de transacciones
- **PAT-003**: Service Layer Pattern para lógica de negocio
- **PAT-004**: Dependency Injection para inversión de control

## 2. Implementation Steps

### Implementation Phase 1: Estructura de Carpetas y Namespaces

- GOAL-001: Renombrar carpetas de español a inglés y crear nueva estructura de directorios

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-001 | Renombrar `GesvenApi/Controladores/` a `GesvenApi/Controllers/` | | |
| TASK-002 | Renombrar `GesvenApi/Servicios/` a `GesvenApi/Services/` | | |
| TASK-003 | Renombrar `GesvenApi/Datos/` a `GesvenApi/Data/` | | |
| TASK-004 | Renombrar `GesvenApi/Modelos/` a `GesvenApi/Models/` | | |
| TASK-005 | Crear directorio `GesvenApi/Controllers/Base/` | | |
| TASK-006 | Crear directorio `GesvenApi/Services/Interfaces/` | | |
| TASK-007 | Crear directorio `GesvenApi/Services/Implementations/` | | |
| TASK-008 | Crear directorio `GesvenApi/Data/Configurations/` | | |
| TASK-009 | Crear directorio `GesvenApi/Data/Repositories/Interfaces/` | | |
| TASK-010 | Crear directorio `GesvenApi/Data/Repositories/Implementations/` | | |
| TASK-011 | Crear directorio `GesvenApi/Data/UnitOfWork/` | | |
| TASK-012 | Crear directorio `GesvenApi/Models/Entities/` y mover entidades existentes | | |
| TASK-013 | Crear directorio `GesvenApi/Models/Dtos/Requests/` | | |
| TASK-014 | Crear directorio `GesvenApi/Models/Dtos/Responses/` | | |
| TASK-015 | Crear directorio `GesvenApi/Models/Common/` | | |
| TASK-016 | Crear directorio `GesvenApi/Validators/` | | |
| TASK-017 | Crear directorio `GesvenApi/Middleware/` | | |
| TASK-018 | Crear directorio `GesvenApi/Extensions/` | | |
| TASK-019 | Crear directorio `GesvenApi/Mappings/` | | |
| TASK-020 | Crear directorio `GesvenApi/Constants/` | | |
| TASK-021 | Crear directorio `GesvenApi/Exceptions/` | | |
| TASK-022 | Actualizar todos los namespaces en archivos existentes según nueva estructura | | |

### Implementation Phase 2: Paquetes NuGet y Configuración Base

- GOAL-002: Agregar dependencias NuGet necesarias y crear archivos base de infraestructura

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-023 | Agregar `AutoMapper.Extensions.Microsoft.DependencyInjection` v12.0.1 a GesvenApi.csproj | | |
| TASK-024 | Agregar `FluentValidation.AspNetCore` v11.3.0 a GesvenApi.csproj | | |
| TASK-025 | Ejecutar `dotnet restore` para instalar paquetes | | |
| TASK-026 | Crear `Models/Common/ApiResponse.cs` con clase genérica de respuesta estándar | | |
| TASK-027 | Crear `Models/Common/PagedResult.cs` para paginación futura | | |
| TASK-028 | Crear `Models/Common/ErrorDetails.cs` para errores estructurados | | |

### Implementation Phase 3: Excepciones Personalizadas y Constantes

- GOAL-003: Crear excepciones personalizadas y organizar constantes del sistema

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-029 | Crear `Exceptions/BusinessException.cs` | | |
| TASK-030 | Crear `Exceptions/NotFoundException.cs` | | |
| TASK-031 | Crear `Exceptions/ValidationException.cs` | | |
| TASK-032 | Crear `Exceptions/UnauthorizedException.cs` | | |
| TASK-033 | Crear `Constants/AppConstants.cs` refactorizando ConstantesGesven.cs | | |
| TASK-034 | Crear `Constants/ErrorMessages.cs` con mensajes de error centralizados | | |
| TASK-035 | Crear `Constants/SuccessMessages.cs` con mensajes de éxito centralizados | | |
| TASK-036 | Crear `Constants/StatusConstants.cs` con nombres de estatus | | |
| TASK-037 | Eliminar archivo `ConstantesGesven.cs` original después de verificar migración | | |

### Implementation Phase 4: Entity Configurations (Fluent API)

- GOAL-004: Separar configuraciones de entidades del DbContext a archivos individuales

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-038 | Crear `Data/Configurations/EstatusGeneralConfiguration.cs` | | |
| TASK-039 | Crear `Data/Configurations/UsuarioConfiguration.cs` | | |
| TASK-040 | Crear `Data/Configurations/RolConfiguration.cs` | | |
| TASK-041 | Crear `Data/Configurations/AccesoInstalacionConfiguration.cs` | | |
| TASK-042 | Crear `Data/Configurations/EmpresaConfiguration.cs` | | |
| TASK-043 | Crear `Data/Configurations/SucursalConfiguration.cs` | | |
| TASK-044 | Crear `Data/Configurations/InstalacionConfiguration.cs` | | |
| TASK-045 | Crear `Data/Configurations/MarcaConfiguration.cs` | | |
| TASK-046 | Crear `Data/Configurations/UnidadMedidaConfiguration.cs` | | |
| TASK-047 | Crear `Data/Configurations/ProductoConfiguration.cs` | | |
| TASK-048 | Crear `Data/Configurations/MovimientoConfiguration.cs` | | |
| TASK-049 | Crear `Data/Configurations/ProveedorConfiguration.cs` | | |
| TASK-050 | Crear `Data/Configurations/OrdenCompraConfiguration.cs` | | |
| TASK-051 | Crear `Data/Configurations/OrdenCompraDetalleConfiguration.cs` | | |
| TASK-052 | Crear `Data/Configurations/ClienteConfiguration.cs` | | |
| TASK-053 | Crear `Data/Configurations/VentaConfiguration.cs` | | |
| TASK-054 | Crear `Data/Configurations/VentaDetalleConfiguration.cs` | | |
| TASK-055 | Crear `Data/Configurations/TransferenciaConfiguration.cs` | | |
| TASK-056 | Crear `Data/Configurations/TransferenciaDetalleConfiguration.cs` | | |
| TASK-057 | Crear `Data/Configurations/AjusteInventarioConfiguration.cs` | | |
| TASK-058 | Refactorizar `Data/GesvenDbContext.cs` para usar `ApplyConfigurationsFromAssembly()` | | |

### Implementation Phase 5: Repository Pattern

- GOAL-005: Implementar patrón Repository genérico y repositorios específicos por entidad

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-059 | Crear `Data/Repositories/Interfaces/IRepository.cs` (genérico) | | |
| TASK-060 | Crear `Data/Repositories/Implementations/Repository.cs` (genérico) | | |
| TASK-061 | Crear `Data/Repositories/Interfaces/IAjusteRepository.cs` | | |
| TASK-062 | Crear `Data/Repositories/Implementations/AjusteRepository.cs` | | |
| TASK-063 | Crear `Data/Repositories/Interfaces/IClienteRepository.cs` | | |
| TASK-064 | Crear `Data/Repositories/Implementations/ClienteRepository.cs` | | |
| TASK-065 | Crear `Data/Repositories/Interfaces/IInstalacionRepository.cs` | | |
| TASK-066 | Crear `Data/Repositories/Implementations/InstalacionRepository.cs` | | |
| TASK-067 | Crear `Data/Repositories/Interfaces/IMovimientoRepository.cs` | | |
| TASK-068 | Crear `Data/Repositories/Implementations/MovimientoRepository.cs` | | |
| TASK-069 | Crear `Data/Repositories/Interfaces/IOrdenCompraRepository.cs` | | |
| TASK-070 | Crear `Data/Repositories/Implementations/OrdenCompraRepository.cs` | | |
| TASK-071 | Crear `Data/Repositories/Interfaces/IProductoRepository.cs` | | |
| TASK-072 | Crear `Data/Repositories/Implementations/ProductoRepository.cs` | | |
| TASK-073 | Crear `Data/Repositories/Interfaces/IProveedorRepository.cs` | | |
| TASK-074 | Crear `Data/Repositories/Implementations/ProveedorRepository.cs` | | |
| TASK-075 | Crear `Data/Repositories/Interfaces/ITransferenciaRepository.cs` | | |
| TASK-076 | Crear `Data/Repositories/Implementations/TransferenciaRepository.cs` | | |
| TASK-077 | Crear `Data/Repositories/Interfaces/IVentaRepository.cs` | | |
| TASK-078 | Crear `Data/Repositories/Implementations/VentaRepository.cs` | | |

### Implementation Phase 6: Unit of Work Pattern

- GOAL-006: Implementar patrón Unit of Work para gestión centralizada de transacciones

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-079 | Crear `Data/UnitOfWork/IUnitOfWork.cs` con propiedades para todos los repositorios | | |
| TASK-080 | Crear `Data/UnitOfWork/UnitOfWork.cs` con implementación completa | | |
| TASK-081 | Implementar métodos `SaveChangesAsync()`, `BeginTransactionAsync()`, `CommitTransactionAsync()`, `RollbackTransactionAsync()` | | |

### Implementation Phase 7: Separación de DTOs

- GOAL-007: Separar el archivo DTOs.cs monolítico en archivos individuales organizados por tipo

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-082 | Crear `Models/Dtos/Requests/CrearAjusteDto.cs` | | |
| TASK-083 | Crear `Models/Dtos/Requests/CrearClienteDto.cs` | | |
| TASK-084 | Crear `Models/Dtos/Requests/ActualizarClienteDto.cs` | | |
| TASK-085 | Crear `Models/Dtos/Requests/CrearOrdenCompraDto.cs` | | |
| TASK-086 | Crear `Models/Dtos/Requests/LineaOrdenCompraDto.cs` | | |
| TASK-087 | Crear `Models/Dtos/Requests/CrearProductoDto.cs` | | |
| TASK-088 | Crear `Models/Dtos/Requests/ActualizarProductoDto.cs` | | |
| TASK-089 | Crear `Models/Dtos/Requests/CrearProveedorDto.cs` | | |
| TASK-090 | Crear `Models/Dtos/Requests/ActualizarProveedorDto.cs` | | |
| TASK-091 | Crear `Models/Dtos/Requests/CrearTransferenciaDto.cs` | | |
| TASK-092 | Crear `Models/Dtos/Requests/DetalleTransferenciaDto.cs` | | |
| TASK-093 | Crear `Models/Dtos/Requests/CrearVentaDto.cs` | | |
| TASK-094 | Crear `Models/Dtos/Requests/LineaVentaDto.cs` | | |
| TASK-095 | Crear `Models/Dtos/Responses/InstalacionDto.cs` | | |
| TASK-096 | Crear `Models/Dtos/Responses/ProductoInventarioDto.cs` | | |
| TASK-097 | Crear `Models/Dtos/Responses/ProductoDto.cs` | | |
| TASK-098 | Crear `Models/Dtos/Responses/ProductoSimpleDto.cs` | | |
| TASK-099 | Crear `Models/Dtos/Responses/ClienteDto.cs` | | |
| TASK-100 | Crear `Models/Dtos/Responses/ProveedorDto.cs` | | |
| TASK-101 | Crear `Models/Dtos/Responses/OrdenCompraRespuestaDto.cs` | | |
| TASK-102 | Crear `Models/Dtos/Responses/DetalleOrdenCompraRespuestaDto.cs` | | |
| TASK-103 | Crear `Models/Dtos/Responses/VentaRespuestaDto.cs` | | |
| TASK-104 | Crear `Models/Dtos/Responses/DetalleVentaRespuestaDto.cs` | | |
| TASK-105 | Crear `Models/Dtos/Responses/TransferenciaRespuestaDto.cs` | | |
| TASK-106 | Crear `Models/Dtos/Responses/DetalleTransferenciaRespuestaDto.cs` | | |
| TASK-107 | Crear `Models/Dtos/Responses/AjusteRespuestaDto.cs` | | |
| TASK-108 | Crear `Models/Dtos/Responses/DashboardResumenDto.cs` | | |
| TASK-109 | Eliminar `DTOs/DTOs.cs` original después de verificar migración | | |

### Implementation Phase 8: FluentValidation Validators

- GOAL-008: Crear validadores FluentValidation para todos los DTOs de entrada

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-110 | Crear `Validators/CrearAjusteDtoValidator.cs` | | |
| TASK-111 | Crear `Validators/CrearClienteDtoValidator.cs` | | |
| TASK-112 | Crear `Validators/ActualizarClienteDtoValidator.cs` | | |
| TASK-113 | Crear `Validators/CrearOrdenCompraDtoValidator.cs` | | |
| TASK-114 | Crear `Validators/CrearProductoDtoValidator.cs` | | |
| TASK-115 | Crear `Validators/ActualizarProductoDtoValidator.cs` | | |
| TASK-116 | Crear `Validators/CrearProveedorDtoValidator.cs` | | |
| TASK-117 | Crear `Validators/CrearTransferenciaDtoValidator.cs` | | |
| TASK-118 | Crear `Validators/CrearVentaDtoValidator.cs` | | |

### Implementation Phase 9: AutoMapper Profiles

- GOAL-009: Crear perfiles de AutoMapper para mapeo automático entre entidades y DTOs

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-119 | Crear `Mappings/AjusteProfile.cs` | | |
| TASK-120 | Crear `Mappings/ClienteProfile.cs` | | |
| TASK-121 | Crear `Mappings/CompraProfile.cs` | | |
| TASK-122 | Crear `Mappings/InstalacionProfile.cs` | | |
| TASK-123 | Crear `Mappings/ProductoProfile.cs` | | |
| TASK-124 | Crear `Mappings/ProveedorProfile.cs` | | |
| TASK-125 | Crear `Mappings/TransferenciaProfile.cs` | | |
| TASK-126 | Crear `Mappings/VentaProfile.cs` | | |

### Implementation Phase 10: Services Layer - Interfaces

- GOAL-010: Crear interfaces para todos los servicios de lógica de negocio

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-127 | Crear `Services/Interfaces/IAjusteService.cs` | | |
| TASK-128 | Crear `Services/Interfaces/IClienteService.cs` | | |
| TASK-129 | Crear `Services/Interfaces/ICompraService.cs` | | |
| TASK-130 | Crear `Services/Interfaces/IDashboardService.cs` | | |
| TASK-131 | Crear `Services/Interfaces/IEstatusLookupService.cs` (refactorizar existente) | | |
| TASK-132 | Crear `Services/Interfaces/IInstalacionService.cs` | | |
| TASK-133 | Crear `Services/Interfaces/IInventarioService.cs` | | |
| TASK-134 | Crear `Services/Interfaces/IMovimientoService.cs` | | |
| TASK-135 | Crear `Services/Interfaces/IProductoService.cs` | | |
| TASK-136 | Crear `Services/Interfaces/IProveedorService.cs` | | |
| TASK-137 | Crear `Services/Interfaces/ITransferenciaService.cs` | | |
| TASK-138 | Crear `Services/Interfaces/IVentaService.cs` | | |

### Implementation Phase 11: Services Layer - Implementations

- GOAL-011: Implementar servicios extrayendo lógica de negocio de los controllers actuales

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-139 | Crear `Services/Implementations/AjusteService.cs` extrayendo lógica de AjustesController | | |
| TASK-140 | Crear `Services/Implementations/ClienteService.cs` extrayendo lógica de ClientesController | | |
| TASK-141 | Crear `Services/Implementations/CompraService.cs` extrayendo lógica de ComprasController | | |
| TASK-142 | Crear `Services/Implementations/DashboardService.cs` extrayendo lógica de DashboardController | | |
| TASK-143 | Mover `Services/Implementations/EstatusLookupService.cs` desde Servicios/ | | |
| TASK-144 | Crear `Services/Implementations/InstalacionService.cs` extrayendo lógica de InstalacionesController | | |
| TASK-145 | Crear `Services/Implementations/InventarioService.cs` extrayendo lógica de InventarioController | | |
| TASK-146 | Crear `Services/Implementations/MovimientoService.cs` extrayendo lógica de MovimientosController | | |
| TASK-147 | Crear `Services/Implementations/ProductoService.cs` extrayendo lógica de ProductosController | | |
| TASK-148 | Crear `Services/Implementations/ProveedorService.cs` extrayendo lógica de ProveedoresController | | |
| TASK-149 | Crear `Services/Implementations/TransferenciaService.cs` extrayendo lógica de TransferenciasController | | |
| TASK-150 | Crear `Services/Implementations/VentaService.cs` extrayendo lógica de VentasController | | |

### Implementation Phase 12: Middleware Personalizado

- GOAL-012: Crear middleware para manejo centralizado de errores y logging

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-151 | Crear `Middleware/ExceptionHandlingMiddleware.cs` con manejo de BusinessException, NotFoundException, ValidationException, UnauthorizedException | | |
| TASK-152 | Crear `Middleware/RequestLoggingMiddleware.cs` para logging de requests HTTP | | |

### Implementation Phase 13: Extension Methods

- GOAL-013: Crear extension methods para configuración limpia en Program.cs

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-153 | Crear `Extensions/ServiceCollectionExtensions.cs` con métodos AddRepositories(), AddServices(), AddValidators() | | |
| TASK-154 | Crear `Extensions/ApplicationBuilderExtensions.cs` con métodos UseCustomMiddleware() | | |
| TASK-155 | Crear `Extensions/QueryableExtensions.cs` para extensiones de consultas | | |
| TASK-156 | Crear `Extensions/DateTimeExtensions.cs` para formateo de fechas | | |

### Implementation Phase 14: Refactorización de Controllers

- GOAL-014: Refactorizar controllers para que solo manejen HTTP, delegando lógica a servicios

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-157 | Crear `Controllers/Base/BaseApiController.cs` con atributos comunes | | |
| TASK-158 | Refactorizar `Controllers/AjustesController.cs` para usar IAjusteService | | |
| TASK-159 | Refactorizar `Controllers/ClientesController.cs` para usar IClienteService | | |
| TASK-160 | Refactorizar `Controllers/ComprasController.cs` para usar ICompraService | | |
| TASK-161 | Refactorizar `Controllers/DashboardController.cs` para usar IDashboardService | | |
| TASK-162 | Refactorizar `Controllers/InstalacionesController.cs` para usar IInstalacionService | | |
| TASK-163 | Refactorizar `Controllers/InventarioController.cs` para usar IInventarioService | | |
| TASK-164 | Refactorizar `Controllers/MovimientosController.cs` para usar IMovimientoService | | |
| TASK-165 | Refactorizar `Controllers/ProductosController.cs` para usar IProductoService | | |
| TASK-166 | Refactorizar `Controllers/ProveedoresController.cs` para usar IProveedorService | | |
| TASK-167 | Refactorizar `Controllers/TransferenciasController.cs` para usar ITransferenciaService | | |
| TASK-168 | Refactorizar `Controllers/VentasController.cs` para usar IVentaService | | |

### Implementation Phase 15: Actualización de Program.cs

- GOAL-015: Actualizar Program.cs con registro de DI, middleware y configuración de AutoMapper/FluentValidation

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-169 | Registrar IUnitOfWork y UnitOfWork en DI | | |
| TASK-170 | Registrar todos los servicios (IAjusteService, IClienteService, etc.) en DI | | |
| TASK-171 | Configurar AutoMapper con `AddAutoMapper(typeof(Program))` | | |
| TASK-172 | Configurar FluentValidation con `AddFluentValidationAutoValidation()` y `AddValidatorsFromAssemblyContaining<Program>()` | | |
| TASK-173 | Agregar middleware ExceptionHandlingMiddleware y RequestLoggingMiddleware | | |
| TASK-174 | Actualizar namespaces y usings en Program.cs | | |

### Implementation Phase 16: Verificación y Limpieza

- GOAL-016: Verificar funcionalidad completa y limpiar archivos obsoletos

| Task     | Description           | Completed | Date       |
| -------- | --------------------- | --------- | ---------- |
| TASK-175 | Ejecutar `dotnet build` y verificar que no hay errores de compilación | | |
| TASK-176 | Probar endpoint GET /api/instalaciones | | |
| TASK-177 | Probar endpoint GET /api/inventario/{instalacionId} | | |
| TASK-178 | Probar endpoint POST /api/compras | | |
| TASK-179 | Probar endpoint GET /api/compras/proveedores | | |
| TASK-180 | Probar endpoint GET /api/clientes | | |
| TASK-181 | Probar endpoint POST /api/clientes | | |
| TASK-182 | Probar endpoint GET /api/ventas | | |
| TASK-183 | Probar endpoint POST /api/ventas | | |
| TASK-184 | Probar endpoint GET /api/productos | | |
| TASK-185 | Probar endpoint POST /api/productos | | |
| TASK-186 | Probar endpoint GET /api/ajustes | | |
| TASK-187 | Probar endpoint POST /api/ajustes | | |
| TASK-188 | Probar endpoint GET /api/transferencias | | |
| TASK-189 | Probar endpoint POST /api/transferencias | | |
| TASK-190 | Probar endpoint GET /api/dashboard | | |
| TASK-191 | Probar endpoint GET /api/movimientos | | |
| TASK-192 | Eliminar carpeta `Controladores/` vacía después de migración | | |
| TASK-193 | Eliminar carpeta `Servicios/` vacía después de migración | | |
| TASK-194 | Eliminar carpeta `Datos/` vacía después de migración | | |
| TASK-195 | Eliminar carpeta `Modelos/` vacía después de migración | | |
| TASK-196 | Eliminar carpeta `DTOs/` vacía después de migración | | |

## 3. Alternatives

- **ALT-001**: Usar MediatR para patrón CQRS en lugar de Services Layer directo - No elegido para mantener simplicidad inicial
- **ALT-002**: Separar en múltiples proyectos (GesvenApi.Domain, GesvenApi.Application, GesvenApi.Infrastructure) - No elegido para evitar complejidad excesiva en esta fase
- **ALT-003**: Usar Dapper en lugar de EF Core para consultas de solo lectura - No elegido para mantener consistencia con stack actual
- **ALT-004**: Implementar CQRS completo con Event Sourcing - No elegido por ser over-engineering para el scope actual

## 4. Dependencies

### Paquetes NuGet Requeridos

- **DEP-001**: `AutoMapper.Extensions.Microsoft.DependencyInjection` v12.0.1 - Mapeo automático de DTOs
- **DEP-002**: `FluentValidation.AspNetCore` v11.3.0 - Validaciones robustas de entrada

### Dependencias Existentes (Ya Instaladas)

- **DEP-003**: `Microsoft.EntityFrameworkCore.SqlServer` v9.0.6 - ORM para SQL Server
- **DEP-004**: `Microsoft.EntityFrameworkCore.Design` v9.0.6 - Herramientas de diseño EF Core
- **DEP-005**: `Microsoft.AspNetCore.OpenApi` v9.0.11 - Documentación OpenAPI/Swagger

### Dependencias de Sistema

- **DEP-006**: .NET 9.0 SDK - Runtime y compilación
- **DEP-007**: SQL Server - Base de datos existente con esquema Gesven

## 5. Files

### Archivos a Crear (Nuevos)

- **FILE-001**: `GesvenApi/Models/Common/ApiResponse.cs` - Clase genérica de respuesta API
- **FILE-002**: `GesvenApi/Models/Common/PagedResult.cs` - Resultado paginado
- **FILE-003**: `GesvenApi/Models/Common/ErrorDetails.cs` - Detalles de error
- **FILE-004**: `GesvenApi/Exceptions/BusinessException.cs` - Excepción de negocio
- **FILE-005**: `GesvenApi/Exceptions/NotFoundException.cs` - Excepción de recurso no encontrado
- **FILE-006**: `GesvenApi/Exceptions/ValidationException.cs` - Excepción de validación
- **FILE-007**: `GesvenApi/Exceptions/UnauthorizedException.cs` - Excepción de no autorizado
- **FILE-008**: `GesvenApi/Constants/AppConstants.cs` - Constantes de aplicación
- **FILE-009**: `GesvenApi/Constants/ErrorMessages.cs` - Mensajes de error
- **FILE-010**: `GesvenApi/Constants/SuccessMessages.cs` - Mensajes de éxito
- **FILE-011**: `GesvenApi/Constants/StatusConstants.cs` - Constantes de estatus
- **FILE-012**: `GesvenApi/Data/Configurations/*.cs` - 18+ archivos de configuración de entidades
- **FILE-013**: `GesvenApi/Data/Repositories/Interfaces/IRepository.cs` - Interfaz genérica
- **FILE-014**: `GesvenApi/Data/Repositories/Implementations/Repository.cs` - Implementación genérica
- **FILE-015**: `GesvenApi/Data/Repositories/Interfaces/I*Repository.cs` - 9 interfaces específicas
- **FILE-016**: `GesvenApi/Data/Repositories/Implementations/*Repository.cs` - 9 implementaciones
- **FILE-017**: `GesvenApi/Data/UnitOfWork/IUnitOfWork.cs` - Interfaz Unit of Work
- **FILE-018**: `GesvenApi/Data/UnitOfWork/UnitOfWork.cs` - Implementación Unit of Work
- **FILE-019**: `GesvenApi/Models/Dtos/Requests/*.cs` - 13+ DTOs de entrada
- **FILE-020**: `GesvenApi/Models/Dtos/Responses/*.cs` - 14+ DTOs de salida
- **FILE-021**: `GesvenApi/Validators/*.cs` - 9 validadores FluentValidation
- **FILE-022**: `GesvenApi/Mappings/*.cs` - 8 perfiles AutoMapper
- **FILE-023**: `GesvenApi/Services/Interfaces/I*Service.cs` - 12 interfaces de servicios
- **FILE-024**: `GesvenApi/Services/Implementations/*Service.cs` - 12 implementaciones de servicios
- **FILE-025**: `GesvenApi/Middleware/ExceptionHandlingMiddleware.cs` - Middleware de errores
- **FILE-026**: `GesvenApi/Middleware/RequestLoggingMiddleware.cs` - Middleware de logging
- **FILE-027**: `GesvenApi/Extensions/ServiceCollectionExtensions.cs` - Extensiones de DI
- **FILE-028**: `GesvenApi/Extensions/ApplicationBuilderExtensions.cs` - Extensiones de middleware
- **FILE-029**: `GesvenApi/Controllers/Base/BaseApiController.cs` - Controller base

### Archivos a Modificar

- **FILE-030**: `GesvenApi/GesvenApi.csproj` - Agregar paquetes NuGet
- **FILE-031**: `GesvenApi/Program.cs` - Configuración completa de DI y middleware
- **FILE-032**: `GesvenApi/Data/GesvenDbContext.cs` - Usar ApplyConfigurationsFromAssembly
- **FILE-033**: `GesvenApi/Controllers/*.cs` - 11 controllers refactorizados

### Archivos a Eliminar (Después de Migración)

- **FILE-034**: `GesvenApi/ConstantesGesven.cs` - Reemplazado por Constants/
- **FILE-035**: `GesvenApi/DTOs/DTOs.cs` - Separado en Models/Dtos/
- **FILE-036**: Carpeta `GesvenApi/Controladores/` - Renombrada a Controllers/
- **FILE-037**: Carpeta `GesvenApi/Servicios/` - Renombrada a Services/
- **FILE-038**: Carpeta `GesvenApi/Datos/` - Renombrada a Data/
- **FILE-039**: Carpeta `GesvenApi/Modelos/` - Renombrada a Models/

## 6. Testing

- **TEST-001**: Verificar compilación exitosa con `dotnet build`
- **TEST-002**: Probar todos los endpoints GET existentes mantienen misma respuesta
- **TEST-003**: Probar todos los endpoints POST existentes aceptan mismo formato de entrada
- **TEST-004**: Verificar que FluentValidation devuelve errores 400 con formato correcto
- **TEST-005**: Verificar que excepciones BusinessException devuelven 400 con mensaje apropiado
- **TEST-006**: Verificar que excepciones NotFoundException devuelven 404 con mensaje apropiado
- **TEST-007**: Verificar que excepciones no manejadas devuelven 500 con mensaje genérico
- **TEST-008**: Verificar logging de requests en middleware
- **TEST-009**: Probar transacciones con Unit of Work (crear orden de compra con detalles)
- **TEST-010**: Probar frontend React/Vite sigue funcionando con todos los cambios

## 7. Risks & Assumptions

### Risks

- **RISK-001**: Breaking changes accidentales en respuestas de API que afecten frontend - Mitigación: Mantener estructura de DTOs de respuesta exactamente igual
- **RISK-002**: Problemas de rendimiento al agregar capas adicionales - Mitigación: Monitorear tiempos de respuesta, optimizar consultas en repositorios
- **RISK-003**: Errores en migración de namespaces que causen fallos de compilación - Mitigación: Hacer cambios incrementales por fase, verificar build después de cada fase
- **RISK-004**: Pérdida de funcionalidad en extracción de lógica a servicios - Mitigación: Revisar cada controller línea por línea, probar cada endpoint

### Assumptions

- **ASSUMPTION-001**: La base de datos SQL Server está funcionando correctamente con el esquema actual
- **ASSUMPTION-002**: El frontend React/Vite no requiere cambios si los endpoints mantienen misma URL y formato de respuesta
- **ASSUMPTION-003**: El equipo tiene acceso a .NET 9.0 SDK para desarrollo
- **ASSUMPTION-004**: No hay requerimientos de cambios funcionales durante el refactoring
- **ASSUMPTION-005**: Los 11 controllers actuales contienen toda la lógica de negocio que debe extraerse

## 8. Related Specifications / Further Reading

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern - Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design)
- [Unit of Work Pattern - Martin Fowler](https://martinfowler.com/eaaCatalog/unitOfWork.html)
- [FluentValidation Documentation](https://docs.fluentvalidation.net/)
- [AutoMapper Documentation](https://docs.automapper.org/)
- [ASP.NET Core Middleware](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/)
- [docs/PlanRefactorGesvenApi.md](docs/PlanRefactorGesvenApi.md) - Documento fuente con especificaciones detalladas
