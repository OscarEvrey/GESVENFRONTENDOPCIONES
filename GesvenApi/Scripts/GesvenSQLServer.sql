/*
=============================================================================
SISTEMA: GESVEN (Versión V4.1 - Script Generado desde .NET Backend)
DESCRIPCIÓN: Script para SQL Server corporativo compatible con el backend .NET 9
             Este script crea la base de datos completa con datos semilla.
AUTOR: Generado automáticamente desde GesvenApi
=============================================================================
*/

-- Crear base de datos (ejecutar por separado si es necesario)
-- CREATE DATABASE [Gesven];
-- GO

USE [Gesven];
GO

-- 1. CREACIÓN DE SCHEMAS
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Org')
    EXEC('CREATE SCHEMA [Org]');
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Seg')
    EXEC('CREATE SCHEMA [Seg]');
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Inv')
    EXEC('CREATE SCHEMA [Inv]');
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Comp')
    EXEC('CREATE SCHEMA [Comp]');
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Fin')
    EXEC('CREATE SCHEMA [Fin]');
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Aud')
    EXEC('CREATE SCHEMA [Aud]');
GO

-- =============================================================================
-- SECCIÓN: CATÁLOGOS DE ESTATUS (OPTIMIZACIÓN DE RENDIMIENTO)
-- =============================================================================

CREATE TABLE [Aud].[EstatusGeneral] (
    [EstatusId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(50) NOT NULL,
    [Modulo] NVARCHAR(50) NOT NULL
);
GO

-- =============================================================================
-- SECCIÓN: SEGURIDAD (SEG)
-- =============================================================================

CREATE TABLE [Seg].[Usuario] (
    [UsuarioId] INT IDENTITY(1,1) PRIMARY KEY,
    [Email] NVARCHAR(255) NOT NULL,
    [NombreCompleto] NVARCHAR(200) NOT NULL,
    [NumeroEmpleado] NVARCHAR(50) NULL,
    [Puesto] NVARCHAR(100) NULL,
    [EstatusId] INT NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [UQ_Usuario_Email] UNIQUE ([Email])
);
GO

CREATE TABLE [Seg].[Rol] (
    [RolId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(50) NOT NULL,
    [Descripcion] NVARCHAR(200) NULL,
    [EsActivo] BIT NOT NULL DEFAULT 1,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL
);
GO

-- =============================================================================
-- SECCIÓN: ORGANIZACIÓN (ORG)
-- =============================================================================

CREATE TABLE [Org].[Empresa] (
    [EmpresaId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(100) NOT NULL,
    [RFC] NVARCHAR(13) NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [UQ_Empresa_RFC] UNIQUE ([RFC])
);
GO

CREATE TABLE [Org].[Sucursal] (
    [SucursalId] INT IDENTITY(1,1) PRIMARY KEY,
    [EmpresaId] INT NOT NULL,
    [Nombre] NVARCHAR(100) NOT NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [FK_Sucursal_Empresa] FOREIGN KEY ([EmpresaId]) REFERENCES [Org].[Empresa]([EmpresaId])
);
GO

CREATE TABLE [Org].[Instalacion] (
    [InstalacionId] INT IDENTITY(1,1) PRIMARY KEY,
    [SucursalId] INT NOT NULL,
    [Nombre] NVARCHAR(150) NOT NULL,
    [Tipo] NVARCHAR(50) NOT NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [FK_Instalacion_Sucursal] FOREIGN KEY ([SucursalId]) REFERENCES [Org].[Sucursal]([SucursalId])
);
GO

-- RELACIÓN MAESTRA: USUARIO-INSTALACIÓN-ROL
CREATE TABLE [Seg].[AccesoInstalacion] (
    [AccesoId] INT IDENTITY(1,1) PRIMARY KEY,
    [UsuarioId] INT NOT NULL,
    [InstalacionId] INT NOT NULL,
    [RolId] INT NOT NULL,
    [EsActivo] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_EsActivo] DEFAULT 1,
    [PermisoCompras] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_PermisoCompras] DEFAULT 0,
    [PermisoVentas] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_PermisoVentas] DEFAULT 0,
    [PermisoInventario] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_PermisoInventario] DEFAULT 0,
    [PermisoFacturacion] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_PermisoFacturacion] DEFAULT 0,
    [PermisoPagos] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_PermisoPagos] DEFAULT 0,
    [PermisoAuditoria] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_PermisoAuditoria] DEFAULT 0,
    [PermisoCatalogos] BIT NOT NULL CONSTRAINT [DF_AccesoInstalacion_PermisoCatalogos] DEFAULT 0,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [FK_AccesoInstalacion_Usuario] FOREIGN KEY ([UsuarioId]) REFERENCES [Seg].[Usuario]([UsuarioId]),
    CONSTRAINT [FK_AccesoInstalacion_Instalacion] FOREIGN KEY ([InstalacionId]) REFERENCES [Org].[Instalacion]([InstalacionId]),
    CONSTRAINT [FK_AccesoInstalacion_Rol] FOREIGN KEY ([RolId]) REFERENCES [Seg].[Rol]([RolId]),
    CONSTRAINT [UX_AccesoInstalacion_Usuario_Instalacion] UNIQUE ([UsuarioId], [InstalacionId])
);
GO

-- =============================================================================
-- SECCIÓN: INVENTARIOS (INV)
-- =============================================================================

CREATE TABLE [Inv].[Marca] (
    [MarcaId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(100) NOT NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL
);
GO

CREATE TABLE [Inv].[UnidadMedida] (
    [UnidadId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(50) NOT NULL,
    [Simbolo] NVARCHAR(10) NOT NULL
);
GO

CREATE TABLE [Inv].[Producto] (
    [ProductoId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(200) NOT NULL,
    [Codigo] NVARCHAR(50) NULL,
    [Categoria] NVARCHAR(100) NULL,
    [MarcaId] INT NULL,
    [UnidadId] INT NULL,
    [EsInventariable] BIT NOT NULL DEFAULT 1,
    [EstatusId] INT NULL,
    [PrecioUnitario] DECIMAL(18,4) NOT NULL DEFAULT 0,
    [StockMinimo] DECIMAL(18,4) NOT NULL DEFAULT 0,
    [InstalacionId] INT NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [FK_Producto_Marca] FOREIGN KEY ([MarcaId]) REFERENCES [Inv].[Marca]([MarcaId]),
    CONSTRAINT [FK_Producto_Unidad] FOREIGN KEY ([UnidadId]) REFERENCES [Inv].[UnidadMedida]([UnidadId]),
    CONSTRAINT [FK_Producto_Estatus] FOREIGN KEY ([EstatusId]) REFERENCES [Aud].[EstatusGeneral]([EstatusId])
);
GO

CREATE TABLE [Inv].[Movimiento] (
    [MovimientoId] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [InstalacionId] INT NOT NULL,
    [ProductoId] INT NOT NULL,
    [TipoMovimiento] CHAR(1) NOT NULL,
    [Cantidad] DECIMAL(18,4) NOT NULL,
    [SaldoFinal] DECIMAL(18,4) NOT NULL,
    [CostoUnitario] DECIMAL(18,4) NULL,
    [Lote] NVARCHAR(50) NULL,
    [FechaCaducidad] DATE NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    CONSTRAINT [FK_Movimiento_Instalacion] FOREIGN KEY ([InstalacionId]) REFERENCES [Org].[Instalacion]([InstalacionId]),
    CONSTRAINT [FK_Movimiento_Producto] FOREIGN KEY ([ProductoId]) REFERENCES [Inv].[Producto]([ProductoId])
);
GO

-- =============================================================================
-- SECCIÓN: COMPRAS (COMP)
-- =============================================================================

CREATE TABLE [Comp].[Proveedor] (
    [ProveedorId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] NVARCHAR(200) NOT NULL,
    [RFC] NVARCHAR(13) NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [UQ_Proveedor_RFC] UNIQUE ([RFC])
);
GO

CREATE TABLE [Comp].[OrdenCompra] (
    [OrdenCompraId] INT IDENTITY(1,1) PRIMARY KEY,
    [InstalacionId] INT NOT NULL,
    [ProveedorId] INT NOT NULL,
    [EstatusId] INT NOT NULL,
    [MontoTotal] DECIMAL(18,2) NOT NULL DEFAULT 0,
    [Comentarios] NVARCHAR(500) NULL,
    [MotivoRechazo] NVARCHAR(500) NULL,
    [FechaAprobacion] DATETIME2 NULL,
    [FechaRechazo] DATETIME2 NULL,
    [CreadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [CreadoPor] INT NULL,
    [ActualizadoEn] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [ActualizadoPor] INT NULL,
    CONSTRAINT [FK_OrdenCompra_Instalacion] FOREIGN KEY ([InstalacionId]) REFERENCES [Org].[Instalacion]([InstalacionId]),
    CONSTRAINT [FK_OrdenCompra_Proveedor] FOREIGN KEY ([ProveedorId]) REFERENCES [Comp].[Proveedor]([ProveedorId]),
    CONSTRAINT [FK_OrdenCompra_Estatus] FOREIGN KEY ([EstatusId]) REFERENCES [Aud].[EstatusGeneral]([EstatusId])
);
GO

CREATE TABLE [Comp].[OrdenCompraDetalle] (
    [DetalleId] INT IDENTITY(1,1) PRIMARY KEY,
    [OrdenCompraId] INT NOT NULL,
    [ProductoId] INT NOT NULL,
    [CantidadSolicitada] DECIMAL(18,4) NOT NULL DEFAULT 0,
    [CantidadRecibida] DECIMAL(18,4) NOT NULL DEFAULT 0,
    [CostoUnitario] DECIMAL(18,4) NOT NULL DEFAULT 0,
    CONSTRAINT [FK_OrdenCompraDetalle_Orden] FOREIGN KEY ([OrdenCompraId]) REFERENCES [Comp].[OrdenCompra]([OrdenCompraId]),
    CONSTRAINT [FK_OrdenCompraDetalle_Producto] FOREIGN KEY ([ProductoId]) REFERENCES [Inv].[Producto]([ProductoId])
);
GO

-- =============================================================================
-- ÍNDICES DE ALTO RENDIMIENTO
-- =============================================================================

CREATE INDEX [IX_Movimiento_Filtro] ON [Inv].[Movimiento] ([ProductoId], [InstalacionId], [CreadoEn]);
CREATE INDEX [IX_OrdenCompra_Estatus] ON [Comp].[OrdenCompra] ([InstalacionId], [EstatusId]);
CREATE INDEX [IX_Producto_Instalacion] ON [Inv].[Producto] ([InstalacionId]);
CREATE INDEX [IX_AccesoInstalacion_Usuario] ON [Seg].[AccesoInstalacion] ([UsuarioId]);
GO

-- =============================================================================
-- LLAVES FORÁNEAS DE AUDITORÍA
-- =============================================================================

ALTER TABLE [Seg].[Usuario] ADD CONSTRAINT [FK_Usuario_CreadoPor] FOREIGN KEY ([CreadoPor]) REFERENCES [Seg].[Usuario]([UsuarioId]);
ALTER TABLE [Seg].[Usuario] ADD CONSTRAINT [FK_Usuario_ActualizadoPor] FOREIGN KEY ([ActualizadoPor]) REFERENCES [Seg].[Usuario]([UsuarioId]);
ALTER TABLE [Seg].[Usuario] ADD CONSTRAINT [FK_Usuario_Estatus] FOREIGN KEY ([EstatusId]) REFERENCES [Aud].[EstatusGeneral]([EstatusId]);
GO

-- =============================================================================
-- DATOS SEMILLA
-- =============================================================================

SET IDENTITY_INSERT [Aud].[EstatusGeneral] ON;
INSERT INTO [Aud].[EstatusGeneral] ([EstatusId], [Nombre], [Modulo]) VALUES
    (1, 'Activo', 'General'),
    (2, 'Inactivo', 'General'),
    (3, 'Pendiente', 'Compras'),
    (4, 'Aprobada', 'Compras'),
    (5, 'Rechazada', 'Compras'),
    (6, 'Recibida', 'Compras');
SET IDENTITY_INSERT [Aud].[EstatusGeneral] OFF;
GO

SET IDENTITY_INSERT [Seg].[Usuario] ON;
INSERT INTO [Seg].[Usuario] ([UsuarioId], [Email], [NombreCompleto], [NumeroEmpleado], [Puesto], [EstatusId], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 'sistema@gesven.mx', 'Usuario Sistema', 'SYS001', 'Sistema', 1, '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Seg].[Usuario] OFF;
GO

SET IDENTITY_INSERT [Seg].[Rol] ON;
INSERT INTO [Seg].[Rol] ([RolId], [Nombre], [Descripcion], [EsActivo], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 'Administrador', 'Acceso completo al sistema', 1, '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Seg].[Rol] OFF;
GO

SET IDENTITY_INSERT [Org].[Empresa] ON;
INSERT INTO [Org].[Empresa] ([EmpresaId], [Nombre], [RFC], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 'SCC', 'SCC010101XXX', '2024-01-01', 1, '2024-01-01', 1),
    (2, 'Vaxsa', 'VAX010101YYY', '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Org].[Empresa] OFF;
GO

SET IDENTITY_INSERT [Org].[Sucursal] ON;
INSERT INTO [Org].[Sucursal] ([SucursalId], [EmpresaId], [Nombre], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 1, 'Monterrey', '2024-01-01', 1, '2024-01-01', 1),
    (2, 2, 'Monterrey', '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Org].[Sucursal] OFF;
GO

SET IDENTITY_INSERT [Org].[Instalacion] ON;
INSERT INTO [Org].[Instalacion] ([InstalacionId], [SucursalId], [Nombre], [Tipo], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 1, 'Almacen-SCC-MTY', 'Almacen', '2024-01-01', 1, '2024-01-01', 1),
    (2, 1, 'Oficinas-SCC-MTY', 'Oficina', '2024-01-01', 1, '2024-01-01', 1),
    (3, 2, 'Almacen-Vaxsa-MTY', 'Almacen', '2024-01-01', 1, '2024-01-01', 1),
    (4, 2, 'Oficinas-Vaxsa-MTY', 'Oficina', '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Org].[Instalacion] OFF;
GO

SET IDENTITY_INSERT [Seg].[AccesoInstalacion] ON;
INSERT INTO [Seg].[AccesoInstalacion] ([AccesoId], [UsuarioId], [InstalacionId], [RolId], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 1, 1, 1, '2024-01-01', 1, '2024-01-01', 1),
    (2, 1, 2, 1, '2024-01-01', 1, '2024-01-01', 1),
    (3, 1, 3, 1, '2024-01-01', 1, '2024-01-01', 1),
    (4, 1, 4, 1, '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Seg].[AccesoInstalacion] OFF;
GO

SET IDENTITY_INSERT [Inv].[UnidadMedida] ON;
INSERT INTO [Inv].[UnidadMedida] ([UnidadId], [Nombre], [Simbolo]) VALUES
    (1, 'Pieza', 'Pza'),
    (2, 'Kilogramo', 'Kg'),
    (3, 'Litro', 'L'),
    (4, 'Paquete', 'Paq'),
    (5, 'Caja', 'Cja'),
    (6, 'Bolsa', 'Bls'),
    (7, 'Frasco', 'Fco');
SET IDENTITY_INSERT [Inv].[UnidadMedida] OFF;
GO

SET IDENTITY_INSERT [Inv].[Marca] ON;
INSERT INTO [Inv].[Marca] ([MarcaId], [Nombre], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 'Coca-Cola', '2024-01-01', 1, '2024-01-01', 1),
    (2, 'Pepsi', '2024-01-01', 1, '2024-01-01', 1),
    (3, 'Sabritas', '2024-01-01', 1, '2024-01-01', 1),
    (4, 'Barcel', '2024-01-01', 1, '2024-01-01', 1),
    (5, 'Jumex', '2024-01-01', 1, '2024-01-01', 1),
    (6, 'BIC', '2024-01-01', 1, '2024-01-01', 1),
    (7, 'HP', '2024-01-01', 1, '2024-01-01', 1),
    (8, 'Nescafé', '2024-01-01', 1, '2024-01-01', 1),
    (9, 'Genérico', '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Inv].[Marca] OFF;
GO

SET IDENTITY_INSERT [Comp].[Proveedor] ON;
INSERT INTO [Comp].[Proveedor] ([ProveedorId], [Nombre], [RFC], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 'Aceros del Norte SA', 'ANO010101AAA', '2024-01-01', 1, '2024-01-01', 1),
    (2, 'Distribuidora de Papelería Omega', 'DPO020202BBB', '2024-01-01', 1, '2024-01-01', 1),
    (3, 'Comercializadora de Bebidas del Golfo', 'CBG030303CCC', '2024-01-01', 1, '2024-01-01', 1),
    (4, 'Suministros Industriales MTY', 'SIM040404DDD', '2024-01-01', 1, '2024-01-01', 1),
    (5, 'Alimentos y Snacks del Pacífico', 'ASP050505EEE', '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Comp].[Proveedor] OFF;
GO

-- Productos para Almacen-SCC-MTY (InstalacionId = 1)
SET IDENTITY_INSERT [Inv].[Producto] ON;
INSERT INTO [Inv].[Producto] ([ProductoId], [Nombre], [MarcaId], [UnidadId], [EsInventariable], [EstatusId], [PrecioUnitario], [StockMinimo], [Codigo], [Categoria], [InstalacionId], [CreadoEn], [CreadoPor], [ActualizadoEn], [ActualizadoPor]) VALUES
    (1, 'Coca-Cola 600ml', 1, 1, 1, 1, 18.50, 500, 'REF-001', 'Refrescos', 1, '2024-01-01', 1, '2024-01-01', 1),
    (2, 'Pepsi 600ml', 2, 1, 1, 1, 17.50, 400, 'REF-002', 'Refrescos', 1, '2024-01-01', 1, '2024-01-01', 1),
    (3, 'Sprite 600ml', 1, 1, 1, 1, 17.00, 300, 'REF-003', 'Refrescos', 1, '2024-01-01', 1, '2024-01-01', 1),
    (4, 'Fanta Naranja 600ml', 1, 1, 1, 1, 17.00, 200, 'REF-004', 'Refrescos', 1, '2024-01-01', 1, '2024-01-01', 1),
    (5, 'Agua Ciel 1L', 1, 1, 1, 1, 12.00, 800, 'REF-005', 'Agua', 1, '2024-01-01', 1, '2024-01-01', 1),
    (6, 'Sabritas Original 45g', 3, 1, 1, 1, 15.00, 300, 'SNK-001', 'Snacks', 1, '2024-01-01', 1, '2024-01-01', 1),
    (7, 'Doritos Nacho 62g', 3, 1, 1, 1, 18.50, 200, 'SNK-002', 'Snacks', 1, '2024-01-01', 1, '2024-01-01', 1),
    (8, 'Cheetos Flamin Hot 52g', 3, 1, 1, 1, 16.00, 150, 'SNK-003', 'Snacks', 1, '2024-01-01', 1, '2024-01-01', 1),
    (9, 'Ruffles Queso 45g', 3, 1, 1, 1, 15.50, 200, 'SNK-004', 'Snacks', 1, '2024-01-01', 1, '2024-01-01', 1),
    (10, 'Takis Fuego 68g', 4, 1, 1, 1, 19.00, 150, 'SNK-005', 'Snacks', 1, '2024-01-01', 1, '2024-01-01', 1),
    (11, 'Jumex Mango 335ml', 5, 1, 1, 1, 14.50, 200, 'REF-006', 'Jugos', 1, '2024-01-01', 1, '2024-01-01', 1),
    (12, 'Del Valle Naranja 1L', 1, 1, 1, 1, 28.00, 100, 'REF-007', 'Jugos', 1, '2024-01-01', 1, '2024-01-01', 1),
    -- Productos para Oficinas-SCC-MTY (InstalacionId = 2)
    (13, 'Hojas Blancas Carta (500)', 9, 4, 1, 1, 95.00, 20, 'PAP-001', 'Papelería', 2, '2024-01-01', 1, '2024-01-01', 1),
    (14, 'Plumas BIC Azul (12)', 6, 5, 1, 1, 48.00, 10, 'PAP-002', 'Papelería', 2, '2024-01-01', 1, '2024-01-01', 1),
    (15, 'Lápices #2 (12)', 9, 5, 1, 1, 35.00, 15, 'PAP-003', 'Papelería', 2, '2024-01-01', 1, '2024-01-01', 1),
    (16, 'Folders Carta (25)', 9, 4, 1, 1, 85.00, 10, 'PAP-004', 'Papelería', 2, '2024-01-01', 1, '2024-01-01', 1),
    (17, 'Clips Jumbo (100)', 9, 5, 1, 1, 25.00, 5, 'PAP-005', 'Papelería', 2, '2024-01-01', 1, '2024-01-01', 1),
    (18, 'Toner HP 85A', 7, 1, 1, 1, 650.00, 5, 'CON-001', 'Consumibles', 2, '2024-01-01', 1, '2024-01-01', 1),
    (19, 'Cartucho Canon PG-245', 9, 1, 1, 1, 380.00, 5, 'CON-002', 'Consumibles', 2, '2024-01-01', 1, '2024-01-01', 1),
    (20, 'Cinta para Empaque (6)', 9, 4, 1, 1, 120.00, 10, 'CON-003', 'Consumibles', 2, '2024-01-01', 1, '2024-01-01', 1),
    (21, 'Post-it Colores (5)', 9, 4, 1, 1, 75.00, 8, 'PAP-006', 'Papelería', 2, '2024-01-01', 1, '2024-01-01', 1),
    (22, 'Café Nescafé Clásico 200g', 8, 7, 1, 1, 145.00, 5, 'CON-004', 'Consumibles', 2, '2024-01-01', 1, '2024-01-01', 1),
    (23, 'Azúcar 1kg', 9, 6, 1, 1, 35.00, 3, 'CON-005', 'Consumibles', 2, '2024-01-01', 1, '2024-01-01', 1),
    (24, 'Vasos Desechables (50)', 9, 4, 1, 1, 45.00, 4, 'CON-006', 'Consumibles', 2, '2024-01-01', 1, '2024-01-01', 1),
    -- Productos para Almacen-Vaxsa-MTY (InstalacionId = 3)
    (25, 'Coca-Cola 600ml', 1, 1, 1, 1, 18.50, 500, 'REF-001', 'Refrescos', 3, '2024-01-01', 1, '2024-01-01', 1),
    (26, 'Pepsi 600ml', 2, 1, 1, 1, 17.50, 400, 'REF-002', 'Refrescos', 3, '2024-01-01', 1, '2024-01-01', 1),
    (27, 'Sabritas Original 45g', 3, 1, 1, 1, 15.00, 300, 'SNK-001', 'Snacks', 3, '2024-01-01', 1, '2024-01-01', 1),
    (28, 'Doritos Nacho 62g', 3, 1, 1, 1, 18.50, 200, 'SNK-002', 'Snacks', 3, '2024-01-01', 1, '2024-01-01', 1),
    (29, 'Agua Ciel 1L', 1, 1, 1, 1, 12.00, 800, 'REF-005', 'Agua', 3, '2024-01-01', 1, '2024-01-01', 1),
    -- Productos para Oficinas-Vaxsa-MTY (InstalacionId = 4)
    (30, 'Hojas Blancas Carta (500)', 9, 4, 1, 1, 95.00, 20, 'PAP-001', 'Papelería', 4, '2024-01-01', 1, '2024-01-01', 1),
    (31, 'Plumas BIC Azul (12)', 6, 5, 1, 1, 48.00, 10, 'PAP-002', 'Papelería', 4, '2024-01-01', 1, '2024-01-01', 1),
    (32, 'Toner HP 85A', 7, 1, 1, 1, 650.00, 5, 'CON-001', 'Consumibles', 4, '2024-01-01', 1, '2024-01-01', 1),
    (33, 'Café Nescafé Clásico 200g', 8, 7, 1, 1, 145.00, 5, 'CON-004', 'Consumibles', 4, '2024-01-01', 1, '2024-01-01', 1);
SET IDENTITY_INSERT [Inv].[Producto] OFF;
GO

-- Movimientos de inventario (stock inicial)
SET IDENTITY_INSERT [Inv].[Movimiento] ON;
INSERT INTO [Inv].[Movimiento] ([MovimientoId], [InstalacionId], [ProductoId], [TipoMovimiento], [Cantidad], [SaldoFinal], [CostoUnitario], [CreadoEn], [CreadoPor]) VALUES
    -- Stock inicial para Almacen-SCC-MTY
    (1, 1, 1, 'E', 2500, 2500, 12.50, '2024-01-01', 1),
    (2, 1, 2, 'E', 1800, 1800, 11.80, '2024-01-01', 1),
    (3, 1, 3, 'E', 150, 150, 11.50, '2024-01-01', 1),
    (4, 1, 5, 'E', 3200, 3200, 8.00, '2024-01-01', 1),
    (5, 1, 6, 'E', 1500, 1500, 9.50, '2024-01-01', 1),
    (6, 1, 7, 'E', 800, 800, 12.00, '2024-01-01', 1),
    (7, 1, 8, 'E', 50, 50, 10.50, '2024-01-01', 1),
    (8, 1, 9, 'E', 650, 650, 10.00, '2024-01-01', 1),
    (9, 1, 10, 'E', 420, 420, 12.00, '2024-01-01', 1),
    (10, 1, 11, 'E', 980, 980, 10.00, '2024-01-01', 1),
    -- Stock inicial para Oficinas-SCC-MTY
    (11, 2, 13, 'E', 85, 85, 75.00, '2024-01-01', 1),
    (12, 2, 14, 'E', 45, 45, 36.00, '2024-01-01', 1),
    (13, 2, 15, 'E', 8, 8, 28.00, '2024-01-01', 1),
    (14, 2, 16, 'E', 32, 32, 65.00, '2024-01-01', 1),
    (15, 2, 18, 'E', 12, 12, 520.00, '2024-01-01', 1),
    (16, 2, 19, 'E', 3, 3, 300.00, '2024-01-01', 1),
    (17, 2, 20, 'E', 28, 28, 95.00, '2024-01-01', 1),
    (18, 2, 21, 'E', 22, 22, 55.00, '2024-01-01', 1),
    (19, 2, 22, 'E', 15, 15, 115.00, '2024-01-01', 1),
    (20, 2, 23, 'E', 6, 6, 28.00, '2024-01-01', 1),
    -- Stock inicial para Almacen-Vaxsa-MTY
    (21, 3, 25, 'E', 1800, 1800, 12.50, '2024-01-01', 1),
    (22, 3, 26, 'E', 1200, 1200, 11.80, '2024-01-01', 1),
    (23, 3, 27, 'E', 900, 900, 9.50, '2024-01-01', 1),
    (24, 3, 28, 'E', 550, 550, 12.00, '2024-01-01', 1),
    (25, 3, 29, 'E', 2500, 2500, 8.00, '2024-01-01', 1),
    -- Stock inicial para Oficinas-Vaxsa-MTY
    (26, 4, 30, 'E', 60, 60, 75.00, '2024-01-01', 1),
    (27, 4, 31, 'E', 30, 30, 36.00, '2024-01-01', 1),
    (28, 4, 32, 'E', 8, 8, 520.00, '2024-01-01', 1),
    (29, 4, 33, 'E', 10, 10, 115.00, '2024-01-01', 1);
SET IDENTITY_INSERT [Inv].[Movimiento] OFF;
GO

PRINT 'Base de datos Gesven creada exitosamente con datos semilla.';
GO
