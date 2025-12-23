-- ===========================================================================
-- Script de Creación de Esquema y Datos Semilla para Gesven
-- Compatible con SQL Server Corporativo
-- Fecha de generación: 2024-01-15
-- ===========================================================================

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

CREATE TABLE Aud.EstatusGeneral (
    EstatusId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL,
    Modulo NVARCHAR(50) NOT NULL
);
GO

-- ===========================================================================
-- TABLAS DE SEGURIDAD
-- ===========================================================================

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
GO

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
GO

CREATE TABLE Seg.AccesoInstalacion (
    AccesoId INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,
    InstalacionId INT NOT NULL,
    RolId INT NOT NULL,
    CreadoEn DATETIME2 NOT NULL,
    CreadoPor INT NULL,
    ActualizadoEn DATETIME2 NOT NULL,
    ActualizadoPor INT NULL
);
GO

-- ===========================================================================
-- TABLAS DE ORGANIZACIÓN
-- ===========================================================================

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
GO

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
GO

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
GO

-- ===========================================================================
-- TABLAS DE INVENTARIO
-- ===========================================================================

CREATE TABLE Inv.Marca (
    MarcaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    CreadoEn DATETIME2 NOT NULL,
    CreadoPor INT NULL,
    ActualizadoEn DATETIME2 NOT NULL,
    ActualizadoPor INT NULL
);
GO

CREATE TABLE Inv.UnidadMedida (
    UnidadId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL,
    Simbolo NVARCHAR(10) NOT NULL
);
GO

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
GO

CREATE TABLE Inv.Movimiento (
    MovimientoId INT PRIMARY KEY IDENTITY(1,1),
    InstalacionId INT NOT NULL,
    ProductoId INT NOT NULL,
    TipoMovimiento CHAR(1) NOT NULL, -- 'E' = Entrada, 'S' = Salida
    Cantidad DECIMAL(18,4) NOT NULL,
    SaldoFinal DECIMAL(18,4) NOT NULL,
    CostoUnitario DECIMAL(18,4) NULL,
    Lote NVARCHAR(50) NULL,
    CreadoEn DATETIME2 NOT NULL,
    CreadoPor INT NULL,
    CONSTRAINT FK_Movimiento_Instalacion FOREIGN KEY (InstalacionId) REFERENCES Org.Instalacion(InstalacionId),
    CONSTRAINT FK_Movimiento_Producto FOREIGN KEY (ProductoId) REFERENCES Inv.Producto(ProductoId)
);
GO

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
GO

CREATE TABLE Inv.TransferenciaDetalle (
    DetalleId INT PRIMARY KEY IDENTITY(1,1),
    TransferenciaId INT NOT NULL,
    ProductoId INT NOT NULL,
    CantidadEnviada DECIMAL(18,4) NOT NULL,
    CantidadRecibida DECIMAL(18,4) NULL,
    CONSTRAINT FK_TransferenciaDetalle_Transferencia FOREIGN KEY (TransferenciaId) REFERENCES Inv.Transferencia(TransferenciaId),
    CONSTRAINT FK_TransferenciaDetalle_Producto FOREIGN KEY (ProductoId) REFERENCES Inv.Producto(ProductoId)
);
GO

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
GO

-- ===========================================================================
-- TABLAS DE COMPRAS
-- ===========================================================================

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
GO

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
GO

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
GO

-- ===========================================================================
-- TABLAS DE VENTAS
-- ===========================================================================

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
GO

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
GO

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
GO

-- ===========================================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- ===========================================================================

CREATE INDEX IX_Movimiento_InstalacionId ON Inv.Movimiento(InstalacionId);
CREATE INDEX IX_Movimiento_ProductoId ON Inv.Movimiento(ProductoId);
CREATE INDEX IX_Movimiento_CreadoEn ON Inv.Movimiento(CreadoEn DESC);

CREATE INDEX IX_Producto_InstalacionId ON Inv.Producto(InstalacionId);
CREATE INDEX IX_Producto_MarcaId ON Inv.Producto(MarcaId);
CREATE INDEX IX_Producto_Codigo ON Inv.Producto(Codigo);

CREATE INDEX IX_OrdenCompra_InstalacionId ON Comp.OrdenCompra(InstalacionId);
CREATE INDEX IX_OrdenCompra_ProveedorId ON Comp.OrdenCompra(ProveedorId);
CREATE INDEX IX_OrdenCompra_EstatusId ON Comp.OrdenCompra(EstatusId);

CREATE INDEX IX_Venta_InstalacionId ON Ven.Venta(InstalacionId);
CREATE INDEX IX_Venta_ClienteId ON Ven.Venta(ClienteId);
CREATE INDEX IX_Venta_FechaVenta ON Ven.Venta(FechaVenta DESC);
CREATE INDEX IX_Venta_EstatusId ON Ven.Venta(EstatusId);

CREATE INDEX IX_Transferencia_InstalacionOrigenId ON Inv.Transferencia(InstalacionOrigenId);
CREATE INDEX IX_Transferencia_InstalacionDestinoId ON Inv.Transferencia(InstalacionDestinoId);
CREATE INDEX IX_Transferencia_FechaEnvio ON Inv.Transferencia(FechaEnvio DESC);

CREATE INDEX IX_AjusteInventario_InstalacionId ON Inv.AjusteInventario(InstalacionId);
CREATE INDEX IX_AjusteInventario_ProductoId ON Inv.AjusteInventario(ProductoId);
CREATE INDEX IX_AjusteInventario_FechaAjuste ON Inv.AjusteInventario(FechaAjuste DESC);

CREATE INDEX IX_AccesoInstalacion_UsuarioId ON Seg.AccesoInstalacion(UsuarioId);
CREATE INDEX IX_AccesoInstalacion_InstalacionId ON Seg.AccesoInstalacion(InstalacionId);
GO

-- ===========================================================================
-- DATOS SEMILLA
-- ===========================================================================

-- Estatus Generales
SET IDENTITY_INSERT Aud.EstatusGeneral ON;
INSERT INTO Aud.EstatusGeneral (EstatusId, Nombre, Modulo) VALUES
(1, 'Activo', 'General'),
(2, 'Inactivo', 'General'),
(3, 'Pendiente', 'Compras'),
(4, 'Aprobada', 'Compras'),
(5, 'Rechazada', 'Compras'),
(6, 'Recibida', 'Compras'),
(7, 'Pendiente', 'Ventas'),
(8, 'Facturada', 'Ventas'),
(9, 'Cancelada', 'Ventas'),
(10, 'EnTransito', 'Transferencias'),
(11, 'Recibida', 'Transferencias'),
(12, 'Cancelada', 'Transferencias');
SET IDENTITY_INSERT Aud.EstatusGeneral OFF;
GO

-- Usuario del Sistema (Id = 1)
DECLARE @FechaSistema DATETIME2 = '2024-01-01T00:00:00';

SET IDENTITY_INSERT Seg.Usuario ON;
INSERT INTO Seg.Usuario (UsuarioId, Email, NombreCompleto, NumeroEmpleado, Puesto, EstatusId, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES (1, 'sistema@gesven.mx', 'Usuario Sistema', 'SYS001', 'Sistema', 1, @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Seg.Usuario OFF;

-- Rol Administrador
SET IDENTITY_INSERT Seg.Rol ON;
INSERT INTO Seg.Rol (RolId, Nombre, Descripcion, EsActivo, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES (1, 'Administrador', 'Acceso completo al sistema', 1, @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Seg.Rol OFF;

-- Empresas
SET IDENTITY_INSERT Org.Empresa ON;
INSERT INTO Org.Empresa (EmpresaId, Nombre, RFC, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES 
(1, 'SCC', 'SCC010101XXX', @FechaSistema, 1, @FechaSistema, 1),
(2, 'Vaxsa', 'VAX010101YYY', @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Org.Empresa OFF;

-- Sucursales
SET IDENTITY_INSERT Org.Sucursal ON;
INSERT INTO Org.Sucursal (SucursalId, EmpresaId, Nombre, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES 
(1, 1, 'Monterrey', @FechaSistema, 1, @FechaSistema, 1),
(2, 2, 'Monterrey', @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Org.Sucursal OFF;

-- Instalaciones (4 Base)
SET IDENTITY_INSERT Org.Instalacion ON;
INSERT INTO Org.Instalacion (InstalacionId, SucursalId, Nombre, Tipo, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES 
(1, 1, 'Almacen-SCC-MTY', 'Almacen', @FechaSistema, 1, @FechaSistema, 1),
(2, 1, 'Oficinas-SCC-MTY', 'Oficina', @FechaSistema, 1, @FechaSistema, 1),
(3, 2, 'Almacen-Vaxsa-MTY', 'Almacen', @FechaSistema, 1, @FechaSistema, 1),
(4, 2, 'Oficinas-Vaxsa-MTY', 'Oficina', @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Org.Instalacion OFF;

-- Accesos del Usuario Sistema a todas las instalaciones
SET IDENTITY_INSERT Seg.AccesoInstalacion ON;
INSERT INTO Seg.AccesoInstalacion (AccesoId, UsuarioId, InstalacionId, RolId, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES 
(1, 1, 1, 1, @FechaSistema, 1, @FechaSistema, 1),
(2, 1, 2, 1, @FechaSistema, 1, @FechaSistema, 1),
(3, 1, 3, 1, @FechaSistema, 1, @FechaSistema, 1),
(4, 1, 4, 1, @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Seg.AccesoInstalacion OFF;

-- Unidades de Medida
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

-- Marcas
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

-- Proveedores
SET IDENTITY_INSERT Comp.Proveedor ON;
INSERT INTO Comp.Proveedor (ProveedorId, Nombre, RFC, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES 
(1, 'Aceros del Norte SA', 'ANO010101AAA', @FechaSistema, 1, @FechaSistema, 1),
(2, 'Distribuidora de Papelería Omega', 'DPO020202BBB', @FechaSistema, 1, @FechaSistema, 1),
(3, 'Comercializadora de Bebidas del Golfo', 'CBG030303CCC', @FechaSistema, 1, @FechaSistema, 1),
(4, 'Suministros Industriales MTY', 'SIM040404DDD', @FechaSistema, 1, @FechaSistema, 1),
(5, 'Alimentos y Snacks del Pacífico', 'ASP050505EEE', @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Comp.Proveedor OFF;

-- Clientes
SET IDENTITY_INSERT Ven.Cliente ON;
INSERT INTO Ven.Cliente (ClienteId, RFC, NombreCorto, RazonSocial, Email, Telefono, Direccion, Ciudad, CodigoPostal, Contacto, Saldo, Activo, CreadoEn, CreadoPor, ActualizadoEn, ActualizadoPor)
VALUES 
(1, 'CNO920815AB0', 'COM NORTE', 'Comercializadora del Norte SA de CV', 'compras@comnorte.com', '81-1234-5678', 'Av. Constitución 1500, Col. Centro', 'Monterrey, NL', '64000', 'Lic. Carlos Méndez', 15000.00, 1, @FechaSistema, 1, @FechaSistema, 1),
(2, 'DRE881023CD5', 'REGIO EXPRESS', 'Distribuidora Regio Express SA', 'ventas@regioexpress.mx', '81-8765-4321', 'Blvd. Díaz Ordaz 234, Col. Santa María', 'San Pedro Garza García, NL', '66220', 'Ing. María González', 8500.00, 1, @FechaSistema, 1, @FechaSistema, 1),
(3, 'TDM950612GH3', 'DON MANUEL', 'Tiendas Don Manuel S de RL', 'admin@donmanuel.com', '81-2345-6789', 'Calle Morelos 567, Col. Obrera', 'Monterrey, NL', '64010', 'Manuel Rodríguez', 0, 1, @FechaSistema, 1, @FechaSistema, 1),
(4, 'ALE780930JK1', 'LA ESPERANZA', 'Abarrotes La Esperanza SA', 'compras@laesperanza.mx', '81-3456-7890', 'Av. Ruiz Cortines 890, Col. Cumbres', 'Monterrey, NL', '64610', 'Sra. Patricia López', 3200.00, 0, @FechaSistema, 1, @FechaSistema, 1),
(5, 'SFU910215LM9', 'FAMILIA UNIDA', 'Supermercados Familia Unida SA de CV', 'compras@familiaunida.com', '81-9876-5432', 'Av. Lincoln 1234, Col. Mitras', 'Monterrey, NL', '64320', 'Ing. Roberto Sánchez', 0, 1, @FechaSistema, 1, @FechaSistema, 1);
SET IDENTITY_INSERT Ven.Cliente OFF;
GO

-- ===========================================================================
-- NOTA: Los productos y movimientos de inventario deben insertarse 
-- en una segunda fase o mediante migración desde el sistema anterior.
-- El script de productos es muy extenso y se encuentra en el DbContext.
-- ===========================================================================

PRINT 'Script de creación de esquema Gesven ejecutado exitosamente.';
PRINT 'Fecha: ' + CONVERT(VARCHAR, GETDATE(), 120);
GO
