-- ===========================================================================
-- Script de Migración para Gesven (Actualización de Base de Datos Existente)
-- Compatible con SQL Server Corporativo
-- Fecha de generación: 2024-01-15
-- ===========================================================================

USE [Gesven];
GO

-- Crear esquemas si no existen
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Aud')
    EXEC('CREATE SCHEMA Aud');
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Seg')
    EXEC('CREATE SCHEMA Seg');
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Org')
    EXEC('CREATE SCHEMA Org');
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Inv')
    EXEC('CREATE SCHEMA Inv');
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Comp')
    EXEC('CREATE SCHEMA Comp');
GO
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Ven')
    EXEC('CREATE SCHEMA Ven');
GO

-- ===========================================================================
-- TABLAS DE AUDITORÍA
-- ===========================================================================

IF OBJECT_ID('Aud.EstatusGeneral', 'U') IS NULL
BEGIN
    CREATE TABLE Aud.EstatusGeneral (
        EstatusId INT PRIMARY KEY IDENTITY(1,1),
        Nombre NVARCHAR(50) NOT NULL,
        Modulo NVARCHAR(50) NOT NULL
    );
END
GO

-- ===========================================================================
-- TABLAS DE SEGURIDAD
-- ===========================================================================

IF OBJECT_ID('Seg.Usuario', 'U') IS NULL
BEGIN
    CREATE TABLE Seg.Usuario (
        UsuarioId INT PRIMARY KEY IDENTITY(1,1),
        Email NVARCHAR(255) NOT NULL,
        NombreCompleto NVARCHAR(200) NOT NULL,
        NumeroEmpleado NVARCHAR(50) NULL,
        Puesto NVARCHAR(100) NULL,
        EstatusId INT NOT NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT UQ_Usuario_Email UNIQUE (Email)
    );
END
GO

IF OBJECT_ID('Seg.Rol', 'U') IS NULL
BEGIN
    CREATE TABLE Seg.Rol (
        RolId INT PRIMARY KEY IDENTITY(1,1),
        Nombre NVARCHAR(50) NOT NULL,
        Descripcion NVARCHAR(200) NULL,
        EsActivo BIT NOT NULL DEFAULT 1,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL
    );
END
GO

IF OBJECT_ID('Seg.AccesoInstalacion', 'U') IS NULL
BEGIN
    CREATE TABLE Seg.AccesoInstalacion (
        AccesoId INT PRIMARY KEY IDENTITY(1,1),
        UsuarioId INT NOT NULL,
        InstalacionId INT NOT NULL,
        RolId INT NOT NULL,
        EsActivo BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_EsActivo DEFAULT 1,
        PermisoCompras BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoCompras DEFAULT 0,
        PermisoVentas BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoVentas DEFAULT 0,
        PermisoInventario BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoInventario DEFAULT 0,
        PermisoFacturacion BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoFacturacion DEFAULT 0,
        PermisoPagos BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoPagos DEFAULT 0,
        PermisoAuditoria BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoAuditoria DEFAULT 0,
        PermisoCatalogos BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoCatalogos DEFAULT 0,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL
    );
END
ELSE
BEGIN
    IF COL_LENGTH('Seg.AccesoInstalacion', 'EsActivo') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD EsActivo BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_EsActivo DEFAULT 1;

    IF COL_LENGTH('Seg.AccesoInstalacion', 'PermisoCompras') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD PermisoCompras BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoCompras DEFAULT 0;

    IF COL_LENGTH('Seg.AccesoInstalacion', 'PermisoVentas') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD PermisoVentas BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoVentas DEFAULT 0;

    IF COL_LENGTH('Seg.AccesoInstalacion', 'PermisoInventario') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD PermisoInventario BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoInventario DEFAULT 0;

    IF COL_LENGTH('Seg.AccesoInstalacion', 'PermisoFacturacion') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD PermisoFacturacion BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoFacturacion DEFAULT 0;

    IF COL_LENGTH('Seg.AccesoInstalacion', 'PermisoPagos') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD PermisoPagos BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoPagos DEFAULT 0;

    IF COL_LENGTH('Seg.AccesoInstalacion', 'PermisoAuditoria') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD PermisoAuditoria BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoAuditoria DEFAULT 0;

    IF COL_LENGTH('Seg.AccesoInstalacion', 'PermisoCatalogos') IS NULL
        ALTER TABLE Seg.AccesoInstalacion ADD PermisoCatalogos BIT NOT NULL CONSTRAINT DF_AccesoInstalacion_PermisoCatalogos DEFAULT 0;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID('Seg.AccesoInstalacion')
      AND name = 'UX_AccesoInstalacion_Usuario_Instalacion'
)
    CREATE UNIQUE INDEX UX_AccesoInstalacion_Usuario_Instalacion ON Seg.AccesoInstalacion(UsuarioId, InstalacionId);


-- ===========================================================================
-- TABLAS DE ORGANIZACIÓN
-- ===========================================================================

IF OBJECT_ID('Org.Empresa', 'U') IS NULL
BEGIN
    CREATE TABLE Org.Empresa (
        EmpresaId INT PRIMARY KEY IDENTITY(1,1),
        Nombre NVARCHAR(100) NOT NULL,
        RFC NVARCHAR(13) NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT UQ_Empresa_RFC UNIQUE (RFC)
    );
END
GO

IF OBJECT_ID('Org.Sucursal', 'U') IS NULL
BEGIN
    CREATE TABLE Org.Sucursal (
        SucursalId INT PRIMARY KEY IDENTITY(1,1),
        EmpresaId INT NOT NULL,
        Nombre NVARCHAR(100) NOT NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT FK_Sucursal_Empresa FOREIGN KEY (EmpresaId) REFERENCES Org.Empresa(EmpresaId)
    );
END
GO

IF OBJECT_ID('Org.Instalacion', 'U') IS NULL
BEGIN
    CREATE TABLE Org.Instalacion (
        InstalacionId INT PRIMARY KEY IDENTITY(1,1),
        SucursalId INT NOT NULL,
        Nombre NVARCHAR(150) NOT NULL,
        Tipo NVARCHAR(50) NOT NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT FK_Instalacion_Sucursal FOREIGN KEY (SucursalId) REFERENCES Org.Sucursal(SucursalId)
    );
END
GO

-- ===========================================================================
-- TABLAS DE INVENTARIO
-- ===========================================================================

IF OBJECT_ID('Inv.Marca', 'U') IS NULL
BEGIN
    CREATE TABLE Inv.Marca (
        MarcaId INT PRIMARY KEY IDENTITY(1,1),
        Nombre NVARCHAR(100) NOT NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL
    );
END
GO

IF OBJECT_ID('Inv.UnidadMedida', 'U') IS NULL
BEGIN
    CREATE TABLE Inv.UnidadMedida (
        UnidadId INT PRIMARY KEY IDENTITY(1,1),
        Nombre NVARCHAR(50) NOT NULL,
        Simbolo NVARCHAR(10) NOT NULL
    );
END
GO

IF OBJECT_ID('Inv.Producto', 'U') IS NULL
BEGIN
    CREATE TABLE Inv.Producto (
        ProductoId INT PRIMARY KEY IDENTITY(1,1),
        Nombre NVARCHAR(200) NOT NULL,
        Codigo NVARCHAR(50) NULL,
        Categoria NVARCHAR(100) NULL,
        MarcaId INT NULL,
        UnidadId INT NULL,
        InstalacionId INT NULL,
        EsInventariable BIT NOT NULL DEFAULT 1,
        EstatusId INT NOT NULL,
        PrecioUnitario DECIMAL(18,4) NULL,
        StockMinimo DECIMAL(18,4) NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT FK_Producto_Marca FOREIGN KEY (MarcaId) REFERENCES Inv.Marca(MarcaId),
        CONSTRAINT FK_Producto_Unidad FOREIGN KEY (UnidadId) REFERENCES Inv.UnidadMedida(UnidadId),
        CONSTRAINT FK_Producto_Instalacion FOREIGN KEY (InstalacionId) REFERENCES Org.Instalacion(InstalacionId)
    );
END
GO

IF OBJECT_ID('Inv.Movimiento', 'U') IS NULL
BEGIN
    CREATE TABLE Inv.Movimiento (
        MovimientoId INT PRIMARY KEY IDENTITY(1,1),
        InstalacionId INT NOT NULL,
        ProductoId INT NOT NULL,
        TipoMovimiento CHAR(1) NOT NULL, -- 'E' = Entrada, 'S' = Salida
        Cantidad DECIMAL(18,4) NOT NULL,
        SaldoFinal DECIMAL(18,4) NOT NULL,
        CostoUnitario DECIMAL(18,4) NULL,
        Lote NVARCHAR(50) NULL,
        FechaCaducidad DATE NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        CONSTRAINT FK_Movimiento_Instalacion FOREIGN KEY (InstalacionId) REFERENCES Org.Instalacion(InstalacionId),
        CONSTRAINT FK_Movimiento_Producto FOREIGN KEY (ProductoId) REFERENCES Inv.Producto(ProductoId)
    );
END
ELSE
BEGIN
    -- Agregar columna FechaCaducidad si no existe
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Inv.Movimiento') AND name = 'FechaCaducidad')
    BEGIN
        ALTER TABLE Inv.Movimiento ADD FechaCaducidad DATE NULL;
    END
END
GO

-- Nuevas tablas de inventario
IF OBJECT_ID('Inv.Transferencia', 'U') IS NULL
BEGIN
    CREATE TABLE Inv.Transferencia (
        TransferenciaId INT PRIMARY KEY IDENTITY(1,1),
        Folio NVARCHAR(50) NOT NULL,
        InstalacionOrigenId INT NOT NULL,
        InstalacionDestinoId INT NOT NULL,
        FechaEnvio DATETIME2 NOT NULL,
        FechaRecepcion DATETIME2 NULL,
        Estatus NVARCHAR(20) NOT NULL DEFAULT 'EnTransito',
        Comentarios NVARCHAR(500) NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT UQ_Transferencia_Folio UNIQUE (Folio),
        CONSTRAINT FK_Transferencia_InstalacionOrigen FOREIGN KEY (InstalacionOrigenId) REFERENCES Org.Instalacion(InstalacionId),
        CONSTRAINT FK_Transferencia_InstalacionDestino FOREIGN KEY (InstalacionDestinoId) REFERENCES Org.Instalacion(InstalacionId)
    );
END
GO

IF OBJECT_ID('Inv.TransferenciaDetalle', 'U') IS NULL
BEGIN
    CREATE TABLE Inv.TransferenciaDetalle (
        DetalleId INT PRIMARY KEY IDENTITY(1,1),
        TransferenciaId INT NOT NULL,
        ProductoId INT NOT NULL,
        CantidadEnviada DECIMAL(18,4) NOT NULL,
        CantidadRecibida DECIMAL(18,4) NULL,
        CONSTRAINT FK_TransferenciaDetalle_Transferencia FOREIGN KEY (TransferenciaId) REFERENCES Inv.Transferencia(TransferenciaId),
        CONSTRAINT FK_TransferenciaDetalle_Producto FOREIGN KEY (ProductoId) REFERENCES Inv.Producto(ProductoId)
    );
END
GO

IF OBJECT_ID('Inv.AjusteInventario', 'U') IS NULL
BEGIN
    CREATE TABLE Inv.AjusteInventario (
        AjusteId INT PRIMARY KEY IDENTITY(1,1),
        InstalacionId INT NOT NULL,
        ProductoId INT NOT NULL,
        TipoAjuste CHAR(1) NOT NULL, -- 'E' = Entrada por hallazgo, 'S' = Salida por merma/daño
        Cantidad DECIMAL(18,4) NOT NULL,
        StockAnterior DECIMAL(18,4) NOT NULL,
        StockNuevo DECIMAL(18,4) NOT NULL,
        Motivo NVARCHAR(200) NOT NULL, -- OBLIGATORIO para auditoría
        Observaciones NVARCHAR(500) NULL,
        FechaAjuste DATETIME2 NOT NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT FK_AjusteInventario_Instalacion FOREIGN KEY (InstalacionId) REFERENCES Org.Instalacion(InstalacionId),
        CONSTRAINT FK_AjusteInventario_Producto FOREIGN KEY (ProductoId) REFERENCES Inv.Producto(ProductoId)
    );
END
GO

-- ===========================================================================
-- TABLAS DE COMPRAS
-- ===========================================================================

IF OBJECT_ID('Comp.Proveedor', 'U') IS NULL
BEGIN
    CREATE TABLE Comp.Proveedor (
        ProveedorId INT PRIMARY KEY IDENTITY(1,1),
        Nombre NVARCHAR(200) NOT NULL,
        RFC NVARCHAR(13) NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT UQ_Proveedor_RFC UNIQUE (RFC)
    );
END
GO

IF OBJECT_ID('Comp.OrdenCompra', 'U') IS NULL
BEGIN
    CREATE TABLE Comp.OrdenCompra (
        OrdenCompraId INT PRIMARY KEY IDENTITY(1,1),
        InstalacionId INT NOT NULL,
        ProveedorId INT NOT NULL,
        EstatusId INT NOT NULL,
        MontoTotal DECIMAL(18,2) NULL,
        Comentarios NVARCHAR(500) NULL,
        MotivoRechazo NVARCHAR(500) NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT FK_OrdenCompra_Instalacion FOREIGN KEY (InstalacionId) REFERENCES Org.Instalacion(InstalacionId),
        CONSTRAINT FK_OrdenCompra_Proveedor FOREIGN KEY (ProveedorId) REFERENCES Comp.Proveedor(ProveedorId),
        CONSTRAINT FK_OrdenCompra_Estatus FOREIGN KEY (EstatusId) REFERENCES Aud.EstatusGeneral(EstatusId)
    );
END
GO

IF OBJECT_ID('Comp.OrdenCompraDetalle', 'U') IS NULL
BEGIN
    CREATE TABLE Comp.OrdenCompraDetalle (
        DetalleId INT PRIMARY KEY IDENTITY(1,1),
        OrdenCompraId INT NOT NULL,
        ProductoId INT NOT NULL,
        CantidadSolicitada DECIMAL(18,4) NOT NULL,
        CantidadRecibida DECIMAL(18,4) NULL,
        CostoUnitario DECIMAL(18,4) NOT NULL,
        CONSTRAINT FK_OrdenCompraDetalle_OrdenCompra FOREIGN KEY (OrdenCompraId) REFERENCES Comp.OrdenCompra(OrdenCompraId),
        CONSTRAINT FK_OrdenCompraDetalle_Producto FOREIGN KEY (ProductoId) REFERENCES Inv.Producto(ProductoId)
    );
END
GO

-- ===========================================================================
-- TABLAS DE VENTAS
-- ===========================================================================

IF OBJECT_ID('Ven.Cliente', 'U') IS NULL
BEGIN
    CREATE TABLE Ven.Cliente (
        ClienteId INT PRIMARY KEY IDENTITY(1,1),
        RFC NVARCHAR(13) NOT NULL, -- 12 o 13 caracteres alfanuméricos
        NombreCorto NVARCHAR(50) NOT NULL,
        RazonSocial NVARCHAR(200) NOT NULL,
        Email NVARCHAR(255) NULL,
        Telefono NVARCHAR(30) NULL,
        Direccion NVARCHAR(300) NULL,
        Ciudad NVARCHAR(100) NULL,
        CodigoPostal NVARCHAR(10) NULL,
        Contacto NVARCHAR(150) NULL,
        Saldo DECIMAL(18,2) NOT NULL DEFAULT 0,
        Activo BIT NOT NULL DEFAULT 1,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT UQ_Cliente_RFC UNIQUE (RFC)
    );
END
GO

IF OBJECT_ID('Ven.Venta', 'U') IS NULL
BEGIN
    CREATE TABLE Ven.Venta (
        VentaId INT PRIMARY KEY IDENTITY(1,1),
        Folio NVARCHAR(50) NOT NULL,
        InstalacionId INT NOT NULL,
        ClienteId INT NOT NULL,
        FechaVenta DATETIME2 NOT NULL,
        MontoTotal DECIMAL(18,2) NOT NULL,
        EstatusId INT NOT NULL,
        Comentarios NVARCHAR(500) NULL,
        CreadoEn DATETIME2 NOT NULL,
        CreadoPor INT NULL,
        ActualizadoEn DATETIME2 NOT NULL,
        ActualizadoPor INT NULL,
        CONSTRAINT UQ_Venta_Folio UNIQUE (Folio),
        CONSTRAINT FK_Venta_Instalacion FOREIGN KEY (InstalacionId) REFERENCES Org.Instalacion(InstalacionId),
        CONSTRAINT FK_Venta_Cliente FOREIGN KEY (ClienteId) REFERENCES Ven.Cliente(ClienteId),
        CONSTRAINT FK_Venta_Estatus FOREIGN KEY (EstatusId) REFERENCES Aud.EstatusGeneral(EstatusId)
    );
END
GO

IF OBJECT_ID('Ven.VentaDetalle', 'U') IS NULL
BEGIN
    CREATE TABLE Ven.VentaDetalle (
        DetalleId INT PRIMARY KEY IDENTITY(1,1),
        VentaId INT NOT NULL,
        ProductoId INT NOT NULL,
        Cantidad DECIMAL(18,4) NOT NULL,
        PrecioUnitario DECIMAL(18,4) NOT NULL,
        Descuento DECIMAL(5,2) NOT NULL DEFAULT 0,
        Subtotal DECIMAL(18,2) NOT NULL,
        CONSTRAINT FK_VentaDetalle_Venta FOREIGN KEY (VentaId) REFERENCES Ven.Venta(VentaId),
        CONSTRAINT FK_VentaDetalle_Producto FOREIGN KEY (ProductoId) REFERENCES Inv.Producto(ProductoId)
    );
END
GO

-- ===========================================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- ===========================================================================

-- Verificar y crear índices si no existen
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Movimiento') AND name = 'IX_Movimiento_InstalacionId')
    CREATE INDEX IX_Movimiento_InstalacionId ON Inv.Movimiento(InstalacionId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Movimiento') AND name = 'IX_Movimiento_ProductoId')
    CREATE INDEX IX_Movimiento_ProductoId ON Inv.Movimiento(ProductoId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Movimiento') AND name = 'IX_Movimiento_CreadoEn')
    CREATE INDEX IX_Movimiento_CreadoEn ON Inv.Movimiento(CreadoEn DESC);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Producto') AND name = 'IX_Producto_InstalacionId')
    CREATE INDEX IX_Producto_InstalacionId ON Inv.Producto(InstalacionId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Producto') AND name = 'IX_Producto_MarcaId')
    CREATE INDEX IX_Producto_MarcaId ON Inv.Producto(MarcaId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Producto') AND name = 'IX_Producto_Codigo')
    CREATE INDEX IX_Producto_Codigo ON Inv.Producto(Codigo);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Comp.OrdenCompra') AND name = 'IX_OrdenCompra_InstalacionId')
    CREATE INDEX IX_OrdenCompra_InstalacionId ON Comp.OrdenCompra(InstalacionId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Comp.OrdenCompra') AND name = 'IX_OrdenCompra_ProveedorId')
    CREATE INDEX IX_OrdenCompra_ProveedorId ON Comp.OrdenCompra(ProveedorId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Comp.OrdenCompra') AND name = 'IX_OrdenCompra_EstatusId')
    CREATE INDEX IX_OrdenCompra_EstatusId ON Comp.OrdenCompra(EstatusId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Ven.Venta') AND name = 'IX_Venta_InstalacionId')
    CREATE INDEX IX_Venta_InstalacionId ON Ven.Venta(InstalacionId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Ven.Venta') AND name = 'IX_Venta_ClienteId')
    CREATE INDEX IX_Venta_ClienteId ON Ven.Venta(ClienteId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Ven.Venta') AND name = 'IX_Venta_FechaVenta')
    CREATE INDEX IX_Venta_FechaVenta ON Ven.Venta(FechaVenta DESC);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Ven.Venta') AND name = 'IX_Venta_EstatusId')
    CREATE INDEX IX_Venta_EstatusId ON Ven.Venta(EstatusId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Transferencia') AND name = 'IX_Transferencia_InstalacionOrigenId')
    CREATE INDEX IX_Transferencia_InstalacionOrigenId ON Inv.Transferencia(InstalacionOrigenId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Transferencia') AND name = 'IX_Transferencia_InstalacionDestinoId')
    CREATE INDEX IX_Transferencia_InstalacionDestinoId ON Inv.Transferencia(InstalacionDestinoId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.Transferencia') AND name = 'IX_Transferencia_FechaEnvio')
    CREATE INDEX IX_Transferencia_FechaEnvio ON Inv.Transferencia(FechaEnvio DESC);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.AjusteInventario') AND name = 'IX_AjusteInventario_InstalacionId')
    CREATE INDEX IX_AjusteInventario_InstalacionId ON Inv.AjusteInventario(InstalacionId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.AjusteInventario') AND name = 'IX_AjusteInventario_ProductoId')
    CREATE INDEX IX_AjusteInventario_ProductoId ON Inv.AjusteInventario(ProductoId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Inv.AjusteInventario') AND name = 'IX_AjusteInventario_FechaAjuste')
    CREATE INDEX IX_AjusteInventario_FechaAjuste ON Inv.AjusteInventario(FechaAjuste DESC);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Seg.AccesoInstalacion') AND name = 'IX_AccesoInstalacion_UsuarioId')
    CREATE INDEX IX_AccesoInstalacion_UsuarioId ON Seg.AccesoInstalacion(UsuarioId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Seg.AccesoInstalacion') AND name = 'IX_AccesoInstalacion_InstalacionId')
    CREATE INDEX IX_AccesoInstalacion_InstalacionId ON Seg.AccesoInstalacion(InstalacionId);
GO

-- ===========================================================================
-- DATOS SEMILLA (Solo insertar si no existen)
-- ===========================================================================

DECLARE @FechaSistema DATETIME2 = '2024-01-01T00:00:00';

-- Estatus Generales (agregar solo los nuevos)
IF NOT EXISTS (SELECT * FROM Aud.EstatusGeneral WHERE EstatusId = 7)
BEGIN
    SET IDENTITY_INSERT Aud.EstatusGeneral ON;
    INSERT INTO Aud.EstatusGeneral (EstatusId, Nombre, Modulo) VALUES
    (7, 'Pendiente', 'Ventas'),
    (8, 'Facturada', 'Ventas'),
    (9, 'Cancelada', 'Ventas'),
    (10, 'EnTransito', 'Transferencias'),
    (11, 'Recibida', 'Transferencias'),
    (12, 'Cancelada', 'Transferencias');
    SET IDENTITY_INSERT Aud.EstatusGeneral OFF;
END

-- Usuario del Sistema (Id = 1) - Solo si no existe
IF NOT EXISTS (SELECT * FROM Seg.Usuario WHERE UsuarioId = 1)
BEGIN
    SET IDENTITY_INSERT Seg.Usuario ON;
    INSERT INTO Seg.Usuario (UsuarioId, Email, NombreCompleto, NumeroEmpleado, Puesto, EstatusId, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES (1, 'sistema@gesven.mx', 'Usuario Sistema', 'SYS001', 'Sistema', 1, @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Seg.Usuario OFF;
END

-- Rol Administrador - Solo si no existe
IF NOT EXISTS (SELECT * FROM Seg.Rol WHERE RolId = 1)
BEGIN
    SET IDENTITY_INSERT Seg.Rol ON;
    INSERT INTO Seg.Rol (RolId, Nombre, Descripcion, EsActivo, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES (1, 'Administrador', 'Acceso completo al sistema', 1, @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Seg.Rol OFF;
END

-- Empresas - Solo si no existen
IF NOT EXISTS (SELECT * FROM Org.Empresa WHERE EmpresaId = 1)
BEGIN
    SET IDENTITY_INSERT Org.Empresa ON;
    INSERT INTO Org.Empresa (EmpresaId, Nombre, RFC, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES 
    (1, 'SCC', 'SCC010101XXX', @FechaSistema, 1, @FechaSistema, 1),
    (2, 'Vaxsa', 'VAX010101YYY', @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Org.Empresa OFF;
END

-- Sucursales - Solo si no existen
IF NOT EXISTS (SELECT * FROM Org.Sucursal WHERE SucursalId = 1)
BEGIN
    SET IDENTITY_INSERT Org.Sucursal ON;
    INSERT INTO Org.Sucursal (SucursalId, EmpresaId, Nombre, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES 
    (1, 1, 'Monterrey', @FechaSistema, 1, @FechaSistema, 1),
    (2, 2, 'Monterrey', @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Org.Sucursal OFF;
END

-- Instalaciones - Solo si no existen
IF NOT EXISTS (SELECT * FROM Org.Instalacion WHERE InstalacionId = 1)
BEGIN
    SET IDENTITY_INSERT Org.Instalacion ON;
    INSERT INTO Org.Instalacion (InstalacionId, SucursalId, Nombre, Tipo, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES 
    (1, 1, 'Almacen-SCC-MTY', 'Almacen', @FechaSistema, 1, @FechaSistema, 1),
    (2, 1, 'Oficinas-SCC-MTY', 'Oficina', @FechaSistema, 1, @FechaSistema, 1),
    (3, 2, 'Almacen-Vaxsa-MTY', 'Almacen', @FechaSistema, 1, @FechaSistema, 1),
    (4, 2, 'Oficinas-Vaxsa-MTY', 'Oficina', @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Org.Instalacion OFF;
END

-- Accesos - Solo si no existen
IF NOT EXISTS (SELECT * FROM Seg.AccesoInstalacion WHERE AccesoId = 1)
BEGIN
    SET IDENTITY_INSERT Seg.AccesoInstalacion ON;
    INSERT INTO Seg.AccesoInstalacion (AccesoId, UsuarioId, InstalacionId, RolId, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES 
    (1, 1, 1, 1, @FechaSistema, 1, @FechaSistema, 1),
    (2, 1, 2, 1, @FechaSistema, 1, @FechaSistema, 1),
    (3, 1, 3, 1, @FechaSistema, 1, @FechaSistema, 1),
    (4, 1, 4, 1, @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Seg.AccesoInstalacion OFF;
END

-- Unidades de Medida - Solo si no existen
IF NOT EXISTS (SELECT * FROM Inv.UnidadMedida WHERE UnidadId = 1)
BEGIN
    SET IDENTITY_INSERT Inv.UnidadMedida ON;
    INSERT INTO Inv.UnidadMedida (UnidadId, Nombre, Simbolo)
    VALUES 
    (1, 'Pieza', 'Pza'),
    (2, 'Kilogramo', 'Kg'),
    (3, 'Litro', 'L'),
    (4, 'Paquete', 'Paq'),
    (5, 'Caja', 'Cja'),
    (6, 'Bolsa', 'Bls'),
    (7, 'Frasco', 'Fco');
    SET IDENTITY_INSERT Inv.UnidadMedida OFF;
END

-- Marcas - Solo si no existen
IF NOT EXISTS (SELECT * FROM Inv.Marca WHERE MarcaId = 1)
BEGIN
    SET IDENTITY_INSERT Inv.Marca ON;
    INSERT INTO Inv.Marca (MarcaId, Nombre, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES 
    (1, 'Coca-Cola', @FechaSistema, 1, @FechaSistema, 1),
    (2, 'Pepsi', @FechaSistema, 1, @FechaSistema, 1),
    (3, 'Sabritas', @FechaSistema, 1, @FechaSistema, 1),
    (4, 'Barcel', @FechaSistema, 1, @FechaSistema, 1),
    (5, 'Jumex', @FechaSistema, 1, @FechaSistema, 1),
    (6, 'BIC', @FechaSistema, 1, @FechaSistema, 1),
    (7, 'HP', @FechaSistema, 1, @FechaSistema, 1),
    (8, 'Nescafé', @FechaSistema, 1, @FechaSistema, 1),
    (9, 'Genérico', @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Inv.Marca OFF;
END

-- Proveedores - Solo si no existen
IF NOT EXISTS (SELECT * FROM Comp.Proveedor WHERE ProveedorId = 1)
BEGIN
    SET IDENTITY_INSERT Comp.Proveedor ON;
    INSERT INTO Comp.Proveedor (ProveedorId, Nombre, RFC, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES 
    (1, 'Aceros del Norte SA', 'ANO010101AAA', @FechaSistema, 1, @FechaSistema, 1),
    (2, 'Distribuidora de Papelería Omega', 'DPO020202BBB', @FechaSistema, 1, @FechaSistema, 1),
    (3, 'Comercializadora de Bebidas del Golfo', 'CBG030303CCC', @FechaSistema, 1, @FechaSistema, 1),
    (4, 'Suministros Industriales MTY', 'SIM040404DDD', @FechaSistema, 1, @FechaSistema, 1),
    (5, 'Alimentos y Snacks del Pacífico', 'ASP050505EEE', @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Comp.Proveedor OFF;
END

-- Clientes - Nuevos, insertar siempre ya que no existían
IF NOT EXISTS (SELECT * FROM Ven.Cliente WHERE ClienteId = 1)
BEGIN
    SET IDENTITY_INSERT Ven.Cliente ON;
    INSERT INTO Ven.Cliente (ClienteId, RFC, NombreCorto, RazonSocial, Email, Telefono, Direccion, Ciudad, CodigoPostal, Contacto, Saldo, Activo, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
    VALUES 
    (1, 'CNO920815AB0', 'COM NORTE', 'Comercializadora del Norte SA de CV', 'compras@comnorte.com', '81-1234-5678', 'Av. Constitución 1500, Col. Centro', 'Monterrey, NL', '64000', 'Lic. Carlos Méndez', 15000.00, 1, @FechaSistema, 1, @FechaSistema, 1),
    (2, 'DRE881023CD5', 'REGIO EXPRESS', 'Distribuidora Regio Express SA', 'ventas@regioexpress.mx', '81-8765-4321', 'Blvd. Díaz Ordaz 234, Col. Santa María', 'San Pedro Garza García, NL', '66220', 'Ing. María González', 8500.00, 1, @FechaSistema, 1, @FechaSistema, 1),
    (3, 'TDM950612GH3', 'DON MANUEL', 'Tiendas Don Manuel S de RL', 'admin@donmanuel.com', '81-2345-6789', 'Calle Morelos 567, Col. Obrera', 'Monterrey, NL', '64010', 'Manuel Rodríguez', 0, 1, @FechaSistema, 1, @FechaSistema, 1),
    (4, 'ALE780930JK1', 'LA ESPERANZA', 'Abarrotes La Esperanza SA', 'compras@laesperanza.mx', '81-3456-7890', 'Av. Ruiz Cortines 890, Col. Cumbres', 'Monterrey, NL', '64610', 'Sra. Patricia López', 3200.00, 0, @FechaSistema, 1, @FechaSistema, 1),
    (5, 'SFU910215LM9', 'FAMILIA UNIDA', 'Supermercados Familia Unida SA de CV', 'compras@familiaunida.com', '81-9876-5432', 'Av. Lincoln 1234, Col. Mitras', 'Monterrey, NL', '64320', 'Ing. Roberto Sánchez', 0, 1, @FechaSistema, 1, @FechaSistema, 1);
    SET IDENTITY_INSERT Ven.Cliente OFF;
END

-- Productos - Insertar solo si no existen (del script original)
IF NOT EXISTS (SELECT * FROM Inv.Producto WHERE ProductoId = 1)
BEGIN
    SET IDENTITY_INSERT Inv.Producto ON;
    INSERT INTO Inv.Producto (ProductoId, Nombre, MarcaId, UnidadId, EsInventariable, EstatusId, PrecioUnitario, StockMinimo, InstalacionId, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor, Codigo, Categoria) VALUES
        (1, 'Coca-Cola 600ml', 1, 1, 1, 1, 18.50, 500, 1, '2024-01-01', 1, '2024-01-01', 1, 'REF-001', 'Refrescos'),
        (2, 'Pepsi 600ml', 2, 1, 1, 1, 17.50, 400, 1, '2024-01-01', 1, '2024-01-01', 1, 'REF-002', 'Refrescos'),
        (3, 'Sprite 600ml', 1, 1, 1, 1, 17.00, 300, 1, '2024-01-01', 1, '2024-01-01', 1, 'REF-003', 'Refrescos'),
        (4, 'Fanta Naranja 600ml', 1, 1, 1, 1, 17.00, 200, 1, '2024-01-01', 1, '2024-01-01', 1, 'REF-004', 'Refrescos'),
        (5, 'Agua Ciel 1L', 1, 1, 1, 1, 12.00, 800, 1, '2024-01-01', 1, '2024-01-01', 1, 'REF-005', 'Agua'),
        (6, 'Sabritas Original 45g', 3, 1, 1, 1, 15.00, 300, 1, '2024-01-01', 1, '2024-01-01', 1, 'SNK-001', 'Snacks'),
        (7, 'Doritos Nacho 62g', 3, 1, 1, 1, 18.50, 200, 1, '2024-01-01', 1, '2024-01-01', 1, 'SNK-002', 'Snacks'),
        (8, 'Cheetos Flamin Hot 52g', 3, 1, 1, 1, 16.00, 150, 1, '2024-01-01', 1, '2024-01-01', 1, 'SNK-003', 'Snacks'),
        (9, 'Ruffles Queso 45g', 3, 1, 1, 1, 15.50, 200, 1, '2024-01-01', 1, '2024-01-01', 1, 'SNK-004', 'Snacks'),
        (10, 'Takis Fuego 68g', 4, 1, 1, 1, 19.00, 150, 1, '2024-01-01', 1, '2024-01-01', 1, 'SNK-005', 'Snacks'),
        (11, 'Jumex Mango 335ml', 5, 1, 1, 1, 14.50, 200, 1, '2024-01-01', 1, '2024-01-01', 1, 'REF-006', 'Jugos'),
        (12, 'Del Valle Naranja 1L', 1, 1, 1, 1, 28.00, 100, 1, '2024-01-01', 1, '2024-01-01', 1, 'REF-007', 'Jugos'),
        (13, 'Hojas Blancas Carta (500)', 9, 4, 1, 1, 95.00, 20, 2, '2024-01-01', 1, '2024-01-01', 1, 'PAP-001', 'Papelería'),
        (14, 'Plumas BIC Azul (12)', 6, 5, 1, 1, 48.00, 10, 2, '2024-01-01', 1, '2024-01-01', 1, 'PAP-002', 'Papelería'),
        (15, 'Lápices #2 (12)', 9, 5, 1, 1, 35.00, 15, 2, '2024-01-01', 1, '2024-01-01', 1, 'PAP-003', 'Papelería'),
        (16, 'Folders Carta (25)', 9, 4, 1, 1, 85.00, 10, 2, '2024-01-01', 1, '2024-01-01', 1, 'PAP-004', 'Papelería'),
        (17, 'Clips Jumbo (100)', 9, 5, 1, 1, 25.00, 5, 2, '2024-01-01', 1, '2024-01-01', 1, 'PAP-005', 'Papelería'),
        (18, 'Toner HP 85A', 7, 1, 1, 1, 650.00, 5, 2, '2024-01-01', 1, '2024-01-01', 1, 'CON-001', 'Consumibles'),
        (19, 'Cartucho Canon PG-245', 9, 1, 1, 1, 380.00, 5, 2, '2024-01-01', 1, '2024-01-01', 1, 'CON-002', 'Consumibles'),
        (20, 'Cinta para Empaque (6)', 9, 4, 1, 1, 120.00, 10, 2, '2024-01-01', 1, '2024-01-01', 1, 'CON-003', 'Consumibles'),
        (21, 'Post-it Colores (5)', 9, 4, 1, 1, 75.00, 8, 2, '2024-01-01', 1, '2024-01-01', 1, 'PAP-006', 'Papelería'),
        (22, 'Café Nescafé Clásico 200g', 8, 7, 1, 1, 145.00, 5, 2, '2024-01-01', 1, '2024-01-01', 1, 'CON-004', 'Consumibles'),
        (23, 'Azúcar 1kg', 9, 6, 1, 1, 35.00, 3, 2, '2024-01-01', 1, '2024-01-01', 1, 'CON-005', 'Consumibles'),
        (24, 'Vasos Desechables (50)', 9, 4, 1, 1, 45.00, 4, 2, '2024-01-01', 1, '2024-01-01', 1, 'CON-006', 'Consumibles'),
        (25, 'Coca-Cola 600ml', 1, 1, 1, 1, 18.50, 500, 3, '2024-01-01', 1, '2024-01-01', 1, 'REF-001', 'Refrescos'),
        (26, 'Pepsi 600ml', 2, 1, 1, 1, 17.50, 400, 3, '2024-01-01', 1, '2024-01-01', 1, 'REF-002', 'Refrescos'),
        (27, 'Sabritas Original 45g', 3, 1, 1, 1, 15.00, 300, 3, '2024-01-01', 1, '2024-01-01', 1, 'SNK-001', 'Snacks'),
        (28, 'Doritos Nacho 62g', 3, 1, 1, 1, 18.50, 200, 3, '2024-01-01', 1, '2024-01-01', 1, 'SNK-002', 'Snacks'),
        (29, 'Agua Ciel 1L', 1, 1, 1, 1, 12.00, 800, 3, '2024-01-01', 1, '2024-01-01', 1, 'REF-005', 'Agua'),
        (30, 'Hojas Blancas Carta (500)', 9, 4, 1, 1, 95.00, 20, 4, '2024-01-01', 1, '2024-01-01', 1, 'PAP-001', 'Papelería'),
        (31, 'Plumas BIC Azul (12)', 6, 5, 1, 1, 48.00, 10, 4, '2024-01-01', 1, '2024-01-01', 1, 'PAP-002', 'Papelería'),
        (32, 'Toner HP 85A', 7, 1, 1, 1, 650.00, 5, 4, '2024-01-01', 1, '2024-01-01', 1, 'CON-001', 'Consumibles'),
        (33, 'Café Nescafé Clásico 200g', 8, 7, 1, 1, 145.00, 5, 4, '2024-01-01', 1, '2024-01-01', 1, 'CON-004', 'Consumibles');
    SET IDENTITY_INSERT Inv.Producto OFF;
END

-- Movimientos - Insertar solo si no existen
IF NOT EXISTS (SELECT * FROM Inv.Movimiento WHERE MovimientoId = 1)
BEGIN
    SET IDENTITY_INSERT Inv.Movimiento ON;
    INSERT INTO Inv.Movimiento (MovimientoId, InstalacionId, ProductoId, TipoMovimiento, Cantidad, SaldoFinal, CostoUnitario, CreadoEn, CreadoPor) VALUES
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
        (21, 3, 25, 'E', 1800, 1800, 12.50, '2024-01-01', 1),
        (22, 3, 26, 'E', 1200, 1200, 11.80, '2024-01-01', 1),
        (23, 3, 27, 'E', 900, 900, 9.50, '2024-01-01', 1),
        (24, 3, 28, 'E', 550, 550, 12.00, '2024-01-01', 1),
        (25, 3, 29, 'E', 2500, 2500, 8.00, '2024-01-01', 1),
        (26, 4, 30, 'E', 60, 60, 75.00, '2024-01-01', 1),
        (27, 4, 31, 'E', 30, 30, 36.00, '2024-01-01', 1),
        (28, 4, 32, 'E', 8, 8, 520.00, '2024-01-01', 1),
        (29, 4, 33, 'E', 10, 10, 115.00, '2024-01-01', 1);
    SET IDENTITY_INSERT Inv.Movimiento OFF;
END

PRINT 'Script de migración Gesven ejecutado exitosamente.';
PRINT 'Fecha: ' + CONVERT(VARCHAR, GETDATE(), 120);
GO
