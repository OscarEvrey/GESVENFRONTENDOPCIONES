/*
=============================================================================
SISTEMA: GESVEN (Versión V4.1 - Business Elite Final)
DESCRIPCIÓN: Estructura profesional con auditoría universal y catálogos.
OPTIMIZACIÓN: Schemas, Índices, FKs de Auditoría, Tipos de Datos y Detalles.
=============================================================================
*/

CREATE DATABASE [Gesven];
GO
USE [Gesven];
GO

-- 1. CREACIÓN DE SCHEMAS
CREATE SCHEMA [Org]; 
CREATE SCHEMA [Seg]; 
CREATE SCHEMA [Inv]; 
CREATE SCHEMA [Comp]; 
CREATE SCHEMA [Fin]; 
CREATE SCHEMA [Aud];
GO

-- =============================================================================
-- SECCIÓN: CATÁLOGOS DE ESTATUS (OPTIMIZACIÓN DE RENDIMIENTO)
-- =============================================================================

CREATE TABLE [Aud].[EstatusGeneral] (
    [EstatusId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(50) NOT NULL, -- Activo, Inactivo, Pendiente, Recibido, etc.
    [Modulo] NVARCHAR(50) NOT NULL  -- Usuarios, Compras, Ventas, General
);

-- =============================================================================
-- SECCIÓN: SEGURIDAD (SEG)
-- =============================================================================

CREATE TABLE [Seg].[Usuario] (
    [UsuarioId] INT IDENTITY(1,1) PRIMARY KEY,
    [Email] NVARCHAR(255) UNIQUE NOT NULL,
    [NombreCompleto] NVARCHAR(200) NOT NULL,
    [NumeroEmpleado] NVARCHAR(50),
    [Puesto] NVARCHAR(100),
    [EstatusId] INT REFERENCES [Aud].[EstatusGeneral]([EstatusId]),
    -- Auditoría Universal
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT NULL, -- FK definida al final
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL
);

CREATE TABLE [Seg].[Rol] (
    [RolId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(50) NOT NULL,
    [Descripcion] NVARCHAR(200),
    [EsActivo] BIT DEFAULT 1,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Seg].[Permiso] (
    [PermisoId] INT IDENTITY(1,1) PRIMARY KEY,
    [Codigo] NVARCHAR(50) UNIQUE NOT NULL,
    [Nombre] NVARCHAR(100) NOT NULL,
    [Modulo] NVARCHAR(50) NOT NULL,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

-- =============================================================================
-- SECCIÓN: ORGANIZACIÓN (ORG)
-- =============================================================================

CREATE TABLE [Org].[Empresa] (
    [EmpresaId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(100) NOT NULL,
    [RFC] NVARCHAR(13) UNIQUE,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Org].[Sucursal] (
    [SucursalId] INT IDENTITY(1,1) PRIMARY KEY,
    [EmpresaId] INT REFERENCES [Org].[Empresa]([EmpresaId]),
    [Nombre] NVARCHAR(100) NOT NULL,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Org].[Instalacion] (
    [InstalacionId] INT IDENTITY(1,1) PRIMARY KEY,
    [SucursalId] INT REFERENCES [Org].[Sucursal]([SucursalId]),
    [Nombre] NVARCHAR(150) NOT NULL,
    [Tipo] NVARCHAR(50) NOT NULL, -- Almacen, Oficina
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

-- RELACIÓN MAESTRA: USUARIO-INSTALACIÓN-ROL
CREATE TABLE [Seg].[AccesoInstalacion] (
    [AccesoId] INT IDENTITY(1,1) PRIMARY KEY,
    [UsuarioId] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [InstalacionId] INT REFERENCES [Org].[Instalacion]([InstalacionId]),
    [RolId] INT REFERENCES [Seg].[Rol]([RolId]),
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

-- =============================================================================
-- SECCIÓN: INVENTARIOS (INV)
-- =============================================================================

CREATE TABLE [Inv].[Marca] (
    [MarcaId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(100) NOT NULL,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Inv].[UnidadMedida] (
    [UnidadId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(50) NOT NULL,
    [Simbolo] NVARCHAR(10) NOT NULL
);

CREATE TABLE [Inv].[Producto] (
    [ProductoId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(200) NOT NULL,
    [MarcaId] INT REFERENCES [Inv].[Marca]([MarcaId]),
    [UnidadId] INT REFERENCES [Inv].[UnidadMedida]([UnidadId]),
    [EsInventariable] BIT DEFAULT 1, -- Bit para Gasto vs Alimento
    [EstatusId] INT REFERENCES [Aud].[EstatusGeneral]([EstatusId]),
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Inv].[Movimiento] (
    [MovimientoId] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [InstalacionId] INT REFERENCES [Org].[Instalacion]([InstalacionId]),
    [ProductoId] INT REFERENCES [Inv].[Producto]([ProductoId]),
    [TipoMovimiento] CHAR(1) NOT NULL, -- E (Entrada) / S (Salida)
    [Cantidad] DECIMAL(18,4) NOT NULL,
    [SaldoFinal] DECIMAL(18,4) NOT NULL,
    [CostoUnitario] DECIMAL(18,4) NULL,
    [Lote] NVARCHAR(50),
    [FechaCaducidad] DATE,
    [CreadoEn] DATETIME DEFAULT GETDATE(), 
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

-- =============================================================================
-- SECCIÓN: COMPRAS (COMP)
-- =============================================================================

CREATE TABLE [Comp].[Proveedor] (
    [ProveedorId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(200) NOT NULL,
    [RFC] NVARCHAR(13) UNIQUE,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Comp].[OrdenCompra] (
    [OrdenCompraId] INT IDENTITY(1,1) PRIMARY KEY,
    [InstalacionId] INT REFERENCES [Org].[Instalacion]([InstalacionId]),
    [ProveedorId] INT REFERENCES [Comp].[Proveedor]([ProveedorId]),
    [EstatusId] INT REFERENCES [Aud].[EstatusGeneral]([EstatusId]),
    [MontoTotal] DECIMAL(18,2),
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Comp].[OrdenCompraDetalle] (
    [DetalleId] INT IDENTITY(1,1) PRIMARY KEY,
    [OrdenCompraId] INT REFERENCES [Comp].[OrdenCompra]([OrdenCompraId]),
    [ProductoId] INT REFERENCES [Inv].[Producto]([ProductoId]),
    [CantidadSolicitada] DECIMAL(18,4),
    [CantidadRecibida] DECIMAL(18,4) DEFAULT 0,
    [CostoUnitario] DECIMAL(18,4)
);

-- =============================================================================
-- SECCIÓN: FINANZAS / VENTAS (FIN)
-- =============================================================================

CREATE TABLE [Fin].[Cliente] (
    [ClienteId] INT IDENTITY(1,1) PRIMARY KEY,
    [NombreCompleto] NVARCHAR(300) NOT NULL,
    [RFC] NVARCHAR(13) UNIQUE,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Fin].[Venta] (
    [VentaId] INT IDENTITY(1,1) PRIMARY KEY,
    [InstalacionId] INT REFERENCES [Org].[Instalacion]([InstalacionId]),
    [ClienteId] INT REFERENCES [Fin].[Cliente]([ClienteId]),
    [EstatusId] INT REFERENCES [Aud].[EstatusGeneral]([EstatusId]),
    [TotalVenta] DECIMAL(18,2) NOT NULL,
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId]),
    [ActualizadoEn] DATETIME DEFAULT GETDATE(),
    [ActualizadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

CREATE TABLE [Fin].[VentaDetalle] (
    [DetalleId] INT IDENTITY(1,1) PRIMARY KEY,
    [VentaId] INT REFERENCES [Fin].[Venta]([VentaId]) ON DELETE CASCADE,
    [ProductoId] INT REFERENCES [Inv].[Producto]([ProductoId]),
    [Cantidad] DECIMAL(18,4) NOT NULL,
    [PrecioVenta] DECIMAL(18,2) NOT NULL
);

-- =============================================================================
-- SECCIÓN: AUDITORÍA DE LOGS (AUD)
-- =============================================================================

CREATE TABLE [Aud].[LogAccion] (
    [LogId] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [Accion] NVARCHAR(50), -- INSERT, UPDATE, DELETE
    [Tabla] NVARCHAR(100),
    [RegistroId] INT,
    [ValorAnterior] NVARCHAR(MAX),
    [ValorNuevo] NVARCHAR(MAX),
    [CreadoEn] DATETIME DEFAULT GETDATE(),
    [CreadoPor] INT REFERENCES [Seg].[Usuario]([UsuarioId])
);

-- =============================================================================
-- ÍNDICES Y LLAVES CIRCULARES
-- =============================================================================

-- Cerramos la auditoría de Usuario
ALTER TABLE [Seg].[Usuario] ADD CONSTRAINT [FK_Usuario_CreadoPor] FOREIGN KEY ([CreadoPor]) REFERENCES [Seg].[Usuario]([UsuarioId]);
ALTER TABLE [Seg].[Usuario] ADD CONSTRAINT [FK_Usuario_ActualizadoPor] FOREIGN KEY ([ActualizadoPor]) REFERENCES [Seg].[Usuario]([UsuarioId]);

-- Índices de alto rendimiento
CREATE INDEX IX_Movimiento_Filtro ON [Inv].[Movimiento] ([ProductoId], [InstalacionId], [CreadoEn]);
CREATE INDEX IX_OC_Estatus ON [Comp].[OrdenCompra] ([InstalacionId], [EstatusId]);
CREATE INDEX IX_Venta_Filtro ON [Fin].[Venta] ([InstalacionId], [ClienteId]);
GO