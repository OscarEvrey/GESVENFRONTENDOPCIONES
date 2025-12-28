USE [Gesven]
GO
/****** Object:  Schema [Aud]    Script Date: 28/12/2025 05:53:50 a. m. ******/
CREATE SCHEMA [Aud]
GO
/****** Object:  Schema [Comp]    Script Date: 28/12/2025 05:53:50 a. m. ******/
CREATE SCHEMA [Comp]
GO
/****** Object:  Schema [Fin]    Script Date: 28/12/2025 05:53:50 a. m. ******/
CREATE SCHEMA [Fin]
GO
/****** Object:  Schema [Inv]    Script Date: 28/12/2025 05:53:50 a. m. ******/
CREATE SCHEMA [Inv]
GO
/****** Object:  Schema [Org]    Script Date: 28/12/2025 05:53:50 a. m. ******/
CREATE SCHEMA [Org]
GO
/****** Object:  Schema [Seg]    Script Date: 28/12/2025 05:53:50 a. m. ******/
CREATE SCHEMA [Seg]
GO
/****** Object:  Schema [Ven]    Script Date: 28/12/2025 05:53:50 a. m. ******/
CREATE SCHEMA [Ven]
GO
/****** Object:  Table [Aud].[EstatusGeneral]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Aud].[EstatusGeneral](
	[EstatusId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[ModuloId] [int] NOT NULL,
	[EsActivo] [bit] NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[EstatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Comp].[OrdenCompra]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Comp].[OrdenCompra](
	[OrdenCompraId] [int] IDENTITY(1,1) NOT NULL,
	[InstalacionId] [int] NOT NULL,
	[ProveedorId] [int] NOT NULL,
	[EstatusId] [int] NOT NULL,
	[MontoTotal] [decimal](18, 2) NOT NULL,
	[Comentarios] [nvarchar](500) NULL,
	[MotivoRechazo] [nvarchar](500) NULL,
	[FechaAprobacion] [datetime2](7) NULL,
	[FechaRechazo] [datetime2](7) NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[OrdenCompraId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Comp].[OrdenCompraDetalle]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Comp].[OrdenCompraDetalle](
	[DetalleId] [int] IDENTITY(1,1) NOT NULL,
	[OrdenCompraId] [int] NOT NULL,
	[ProductoId] [int] NOT NULL,
	[CantidadSolicitada] [decimal](18, 4) NOT NULL,
	[CantidadRecibida] [decimal](18, 4) NOT NULL,
	[CostoUnitario] [decimal](18, 4) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DetalleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Comp].[Proveedor]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Comp].[Proveedor](
	[ProveedorId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](200) NOT NULL,
	[RFC] [nvarchar](13) NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProveedorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Proveedor_RFC] UNIQUE NONCLUSTERED 
(
	[RFC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inv].[AjusteInventario]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inv].[AjusteInventario](
	[AjusteId] [int] IDENTITY(1,1) NOT NULL,
	[InstalacionId] [int] NOT NULL,
	[ProductoId] [int] NOT NULL,
	[TipoAjuste] [char](1) NOT NULL,
	[Cantidad] [decimal](18, 4) NOT NULL,
	[StockAnterior] [decimal](18, 4) NOT NULL,
	[StockNuevo] [decimal](18, 4) NOT NULL,
	[Motivo] [nvarchar](200) NOT NULL,
	[Observaciones] [nvarchar](500) NULL,
	[FechaAjuste] [datetime2](7) NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[AjusteId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inv].[Marca]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inv].[Marca](
	[MarcaId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[MarcaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inv].[Movimiento]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inv].[Movimiento](
	[MovimientoId] [bigint] IDENTITY(1,1) NOT NULL,
	[InstalacionId] [int] NOT NULL,
	[ProductoId] [int] NOT NULL,
	[TipoMovimiento] [char](1) NOT NULL,
	[Cantidad] [decimal](18, 4) NOT NULL,
	[SaldoFinal] [decimal](18, 4) NOT NULL,
	[CostoUnitario] [decimal](18, 4) NULL,
	[Lote] [nvarchar](50) NULL,
	[FechaCaducidad] [date] NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[MovimientoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inv].[Producto]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inv].[Producto](
	[ProductoId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](200) NOT NULL,
	[Codigo] [nvarchar](50) NULL,
	[Categoria] [nvarchar](100) NULL,
	[MarcaId] [int] NULL,
	[UnidadId] [int] NULL,
	[EsInventariable] [bit] NOT NULL,
	[EstatusId] [int] NULL,
	[PrecioUnitario] [decimal](18, 4) NOT NULL,
	[StockMinimo] [decimal](18, 4) NOT NULL,
	[InstalacionId] [int] NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProductoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inv].[Transferencia]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inv].[Transferencia](
	[TransferenciaId] [int] IDENTITY(1,1) NOT NULL,
	[Folio] [nvarchar](50) NOT NULL,
	[InstalacionOrigenId] [int] NOT NULL,
	[InstalacionDestinoId] [int] NOT NULL,
	[FechaEnvio] [datetime2](7) NOT NULL,
	[FechaRecepcion] [datetime2](7) NULL,
	[Estatus] [nvarchar](20) NOT NULL,
	[Comentarios] [nvarchar](500) NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[TransferenciaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Transferencia_Folio] UNIQUE NONCLUSTERED 
(
	[Folio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inv].[TransferenciaDetalle]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inv].[TransferenciaDetalle](
	[DetalleId] [int] IDENTITY(1,1) NOT NULL,
	[TransferenciaId] [int] NOT NULL,
	[ProductoId] [int] NOT NULL,
	[CantidadEnviada] [decimal](18, 4) NOT NULL,
	[CantidadRecibida] [decimal](18, 4) NULL,
PRIMARY KEY CLUSTERED 
(
	[DetalleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inv].[UnidadMedida]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inv].[UnidadMedida](
	[UnidadId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[Simbolo] [nvarchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UnidadId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Org].[Empresa]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Org].[Empresa](
	[EmpresaId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[RFC] [nvarchar](13) NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[EmpresaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Empresa_RFC] UNIQUE NONCLUSTERED 
(
	[RFC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Org].[Instalacion]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Org].[Instalacion](
	[InstalacionId] [int] IDENTITY(1,1) NOT NULL,
	[SucursalId] [int] NOT NULL,
	[Nombre] [nvarchar](150) NOT NULL,
	[Tipo] [nvarchar](50) NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[InstalacionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Org].[Sucursal]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Org].[Sucursal](
	[SucursalId] [int] IDENTITY(1,1) NOT NULL,
	[EmpresaId] [int] NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[SucursalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Seg].[AccesoInstalacion]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Seg].[AccesoInstalacion](
	[AccesoId] [int] IDENTITY(1,1) NOT NULL,
	[UsuarioId] [int] NOT NULL,
	[InstalacionId] [int] NOT NULL,
	[RolId] [int] NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
	[EsActivo] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AccesoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Seg].[Modulo]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Seg].[Modulo](
	[ModuloId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Ruta] [nvarchar](200) NULL,
	[Icono] [nvarchar](50) NULL,
	[Orden] [int] NOT NULL,
	[PadreId] [int] NULL,
	[EstadoDesarrollo] [nvarchar](20) NOT NULL,
	[ContenidoAyuda] [nvarchar](max) NULL,
	[EsActivo] [bit] NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ModuloId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Seg].[Permiso]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Seg].[Permiso](
	[PermisoId] [int] IDENTITY(1,1) NOT NULL,
	[ModuloId] [int] NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Clave] [nvarchar](50) NOT NULL,
	[Descripcion] [nvarchar](250) NULL,
	[EsActivo] [bit] NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[PermisoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Seg].[Rol]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Seg].[Rol](
	[RolId] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[Descripcion] [nvarchar](200) NULL,
	[EsActivo] [bit] NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[RolId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Seg].[RolPermiso]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Seg].[RolPermiso](
	[RolPermisoId] [int] IDENTITY(1,1) NOT NULL,
	[RolId] [int] NOT NULL,
	[PermisoId] [int] NOT NULL,
	[EsActivo] [bit] NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[RolPermisoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Seg].[Usuario]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Seg].[Usuario](
	[UsuarioId] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[NombreCompleto] [nvarchar](200) NOT NULL,
	[NumeroEmpleado] [nvarchar](50) NULL,
	[Puesto] [nvarchar](100) NULL,
	[EstatusId] [int] NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[UsuarioId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Usuario_Email] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Ven].[Cliente]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Ven].[Cliente](
	[ClienteId] [int] IDENTITY(1,1) NOT NULL,
	[RFC] [nvarchar](13) NOT NULL,
	[NombreCorto] [nvarchar](50) NOT NULL,
	[RazonSocial] [nvarchar](200) NOT NULL,
	[Email] [nvarchar](255) NULL,
	[Telefono] [nvarchar](30) NULL,
	[Direccion] [nvarchar](300) NULL,
	[Ciudad] [nvarchar](100) NULL,
	[CodigoPostal] [nvarchar](10) NULL,
	[Contacto] [nvarchar](150) NULL,
	[Saldo] [decimal](18, 2) NOT NULL,
	[Activo] [bit] NOT NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ClienteId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Cliente_RFC] UNIQUE NONCLUSTERED 
(
	[RFC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Ven].[Venta]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Ven].[Venta](
	[VentaId] [int] IDENTITY(1,1) NOT NULL,
	[Folio] [nvarchar](50) NOT NULL,
	[InstalacionId] [int] NOT NULL,
	[ClienteId] [int] NOT NULL,
	[FechaVenta] [datetime2](7) NOT NULL,
	[MontoTotal] [decimal](18, 2) NOT NULL,
	[EstatusId] [int] NOT NULL,
	[Comentarios] [nvarchar](500) NULL,
	[CreadoEn] [datetime2](7) NOT NULL,
	[CreadoPor] [int] NULL,
	[ActualizadoEn] [datetime2](7) NOT NULL,
	[ActualizadoPor] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[VentaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Venta_Folio] UNIQUE NONCLUSTERED 
(
	[Folio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Ven].[VentaDetalle]    Script Date: 28/12/2025 05:53:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Ven].[VentaDetalle](
	[DetalleId] [int] IDENTITY(1,1) NOT NULL,
	[VentaId] [int] NOT NULL,
	[ProductoId] [int] NOT NULL,
	[Cantidad] [decimal](18, 4) NOT NULL,
	[PrecioUnitario] [decimal](18, 4) NOT NULL,
	[Descuento] [decimal](5, 2) NOT NULL,
	[Subtotal] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DetalleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [Aud].[EstatusGeneral] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [Aud].[EstatusGeneral] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Aud].[EstatusGeneral] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Comp].[OrdenCompra] ADD  DEFAULT ((0)) FOR [MontoTotal]
GO
ALTER TABLE [Comp].[OrdenCompra] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Comp].[OrdenCompra] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Comp].[OrdenCompraDetalle] ADD  DEFAULT ((0)) FOR [CantidadSolicitada]
GO
ALTER TABLE [Comp].[OrdenCompraDetalle] ADD  DEFAULT ((0)) FOR [CantidadRecibida]
GO
ALTER TABLE [Comp].[OrdenCompraDetalle] ADD  DEFAULT ((0)) FOR [CostoUnitario]
GO
ALTER TABLE [Comp].[Proveedor] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Comp].[Proveedor] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Inv].[Marca] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Inv].[Marca] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Inv].[Movimiento] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Inv].[Producto] ADD  DEFAULT ((1)) FOR [EsInventariable]
GO
ALTER TABLE [Inv].[Producto] ADD  DEFAULT ((0)) FOR [PrecioUnitario]
GO
ALTER TABLE [Inv].[Producto] ADD  DEFAULT ((0)) FOR [StockMinimo]
GO
ALTER TABLE [Inv].[Producto] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Inv].[Producto] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Inv].[Transferencia] ADD  DEFAULT ('EnTransito') FOR [Estatus]
GO
ALTER TABLE [Org].[Empresa] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Org].[Empresa] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Org].[Instalacion] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Org].[Instalacion] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Org].[Sucursal] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Org].[Sucursal] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Seg].[AccesoInstalacion] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Seg].[AccesoInstalacion] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Seg].[AccesoInstalacion] ADD  CONSTRAINT [DF_AccesoInstalacion_EsActivo]  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [Seg].[Modulo] ADD  DEFAULT ((0)) FOR [Orden]
GO
ALTER TABLE [Seg].[Modulo] ADD  DEFAULT ('Disponible') FOR [EstadoDesarrollo]
GO
ALTER TABLE [Seg].[Modulo] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [Seg].[Modulo] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Seg].[Modulo] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Seg].[Permiso] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [Seg].[Permiso] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Seg].[Permiso] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Seg].[Rol] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [Seg].[Rol] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Seg].[Rol] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Seg].[RolPermiso] ADD  DEFAULT ((1)) FOR [EsActivo]
GO
ALTER TABLE [Seg].[RolPermiso] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Seg].[RolPermiso] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Seg].[Usuario] ADD  DEFAULT (getdate()) FOR [CreadoEn]
GO
ALTER TABLE [Seg].[Usuario] ADD  DEFAULT (getdate()) FOR [ActualizadoEn]
GO
ALTER TABLE [Ven].[Cliente] ADD  DEFAULT ((0)) FOR [Saldo]
GO
ALTER TABLE [Ven].[Cliente] ADD  DEFAULT ((1)) FOR [Activo]
GO
ALTER TABLE [Ven].[VentaDetalle] ADD  DEFAULT ((0)) FOR [Descuento]
GO
ALTER TABLE [Aud].[EstatusGeneral]  WITH CHECK ADD  CONSTRAINT [FK_EstatusGeneral_Modulo] FOREIGN KEY([ModuloId])
REFERENCES [Seg].[Modulo] ([ModuloId])
GO
ALTER TABLE [Aud].[EstatusGeneral] CHECK CONSTRAINT [FK_EstatusGeneral_Modulo]
GO
ALTER TABLE [Comp].[OrdenCompra]  WITH CHECK ADD  CONSTRAINT [FK_OrdenCompra_Estatus] FOREIGN KEY([EstatusId])
REFERENCES [Aud].[EstatusGeneral] ([EstatusId])
GO
ALTER TABLE [Comp].[OrdenCompra] CHECK CONSTRAINT [FK_OrdenCompra_Estatus]
GO
ALTER TABLE [Comp].[OrdenCompra]  WITH CHECK ADD  CONSTRAINT [FK_OrdenCompra_Instalacion] FOREIGN KEY([InstalacionId])
REFERENCES [Org].[Instalacion] ([InstalacionId])
GO
ALTER TABLE [Comp].[OrdenCompra] CHECK CONSTRAINT [FK_OrdenCompra_Instalacion]
GO
ALTER TABLE [Comp].[OrdenCompra]  WITH CHECK ADD  CONSTRAINT [FK_OrdenCompra_Proveedor] FOREIGN KEY([ProveedorId])
REFERENCES [Comp].[Proveedor] ([ProveedorId])
GO
ALTER TABLE [Comp].[OrdenCompra] CHECK CONSTRAINT [FK_OrdenCompra_Proveedor]
GO
ALTER TABLE [Comp].[OrdenCompraDetalle]  WITH CHECK ADD  CONSTRAINT [FK_OrdenCompraDetalle_Orden] FOREIGN KEY([OrdenCompraId])
REFERENCES [Comp].[OrdenCompra] ([OrdenCompraId])
GO
ALTER TABLE [Comp].[OrdenCompraDetalle] CHECK CONSTRAINT [FK_OrdenCompraDetalle_Orden]
GO
ALTER TABLE [Comp].[OrdenCompraDetalle]  WITH CHECK ADD  CONSTRAINT [FK_OrdenCompraDetalle_Producto] FOREIGN KEY([ProductoId])
REFERENCES [Inv].[Producto] ([ProductoId])
GO
ALTER TABLE [Comp].[OrdenCompraDetalle] CHECK CONSTRAINT [FK_OrdenCompraDetalle_Producto]
GO
ALTER TABLE [Inv].[AjusteInventario]  WITH CHECK ADD  CONSTRAINT [FK_AjusteInventario_Instalacion] FOREIGN KEY([InstalacionId])
REFERENCES [Org].[Instalacion] ([InstalacionId])
GO
ALTER TABLE [Inv].[AjusteInventario] CHECK CONSTRAINT [FK_AjusteInventario_Instalacion]
GO
ALTER TABLE [Inv].[AjusteInventario]  WITH CHECK ADD  CONSTRAINT [FK_AjusteInventario_Producto] FOREIGN KEY([ProductoId])
REFERENCES [Inv].[Producto] ([ProductoId])
GO
ALTER TABLE [Inv].[AjusteInventario] CHECK CONSTRAINT [FK_AjusteInventario_Producto]
GO
ALTER TABLE [Inv].[Movimiento]  WITH CHECK ADD  CONSTRAINT [FK_Movimiento_Instalacion] FOREIGN KEY([InstalacionId])
REFERENCES [Org].[Instalacion] ([InstalacionId])
GO
ALTER TABLE [Inv].[Movimiento] CHECK CONSTRAINT [FK_Movimiento_Instalacion]
GO
ALTER TABLE [Inv].[Movimiento]  WITH CHECK ADD  CONSTRAINT [FK_Movimiento_Producto] FOREIGN KEY([ProductoId])
REFERENCES [Inv].[Producto] ([ProductoId])
GO
ALTER TABLE [Inv].[Movimiento] CHECK CONSTRAINT [FK_Movimiento_Producto]
GO
ALTER TABLE [Inv].[Producto]  WITH CHECK ADD  CONSTRAINT [FK_Producto_Estatus] FOREIGN KEY([EstatusId])
REFERENCES [Aud].[EstatusGeneral] ([EstatusId])
GO
ALTER TABLE [Inv].[Producto] CHECK CONSTRAINT [FK_Producto_Estatus]
GO
ALTER TABLE [Inv].[Producto]  WITH CHECK ADD  CONSTRAINT [FK_Producto_Marca] FOREIGN KEY([MarcaId])
REFERENCES [Inv].[Marca] ([MarcaId])
GO
ALTER TABLE [Inv].[Producto] CHECK CONSTRAINT [FK_Producto_Marca]
GO
ALTER TABLE [Inv].[Producto]  WITH CHECK ADD  CONSTRAINT [FK_Producto_Unidad] FOREIGN KEY([UnidadId])
REFERENCES [Inv].[UnidadMedida] ([UnidadId])
GO
ALTER TABLE [Inv].[Producto] CHECK CONSTRAINT [FK_Producto_Unidad]
GO
ALTER TABLE [Inv].[Transferencia]  WITH CHECK ADD  CONSTRAINT [FK_Transferencia_InstalacionDestino] FOREIGN KEY([InstalacionDestinoId])
REFERENCES [Org].[Instalacion] ([InstalacionId])
GO
ALTER TABLE [Inv].[Transferencia] CHECK CONSTRAINT [FK_Transferencia_InstalacionDestino]
GO
ALTER TABLE [Inv].[Transferencia]  WITH CHECK ADD  CONSTRAINT [FK_Transferencia_InstalacionOrigen] FOREIGN KEY([InstalacionOrigenId])
REFERENCES [Org].[Instalacion] ([InstalacionId])
GO
ALTER TABLE [Inv].[Transferencia] CHECK CONSTRAINT [FK_Transferencia_InstalacionOrigen]
GO
ALTER TABLE [Inv].[TransferenciaDetalle]  WITH CHECK ADD  CONSTRAINT [FK_TransferenciaDetalle_Producto] FOREIGN KEY([ProductoId])
REFERENCES [Inv].[Producto] ([ProductoId])
GO
ALTER TABLE [Inv].[TransferenciaDetalle] CHECK CONSTRAINT [FK_TransferenciaDetalle_Producto]
GO
ALTER TABLE [Inv].[TransferenciaDetalle]  WITH CHECK ADD  CONSTRAINT [FK_TransferenciaDetalle_Transferencia] FOREIGN KEY([TransferenciaId])
REFERENCES [Inv].[Transferencia] ([TransferenciaId])
GO
ALTER TABLE [Inv].[TransferenciaDetalle] CHECK CONSTRAINT [FK_TransferenciaDetalle_Transferencia]
GO
ALTER TABLE [Org].[Instalacion]  WITH CHECK ADD  CONSTRAINT [FK_Instalacion_Sucursal] FOREIGN KEY([SucursalId])
REFERENCES [Org].[Sucursal] ([SucursalId])
GO
ALTER TABLE [Org].[Instalacion] CHECK CONSTRAINT [FK_Instalacion_Sucursal]
GO
ALTER TABLE [Org].[Sucursal]  WITH CHECK ADD  CONSTRAINT [FK_Sucursal_Empresa] FOREIGN KEY([EmpresaId])
REFERENCES [Org].[Empresa] ([EmpresaId])
GO
ALTER TABLE [Org].[Sucursal] CHECK CONSTRAINT [FK_Sucursal_Empresa]
GO
ALTER TABLE [Seg].[AccesoInstalacion]  WITH CHECK ADD  CONSTRAINT [FK_AccesoInstalacion_Instalacion] FOREIGN KEY([InstalacionId])
REFERENCES [Org].[Instalacion] ([InstalacionId])
GO
ALTER TABLE [Seg].[AccesoInstalacion] CHECK CONSTRAINT [FK_AccesoInstalacion_Instalacion]
GO
ALTER TABLE [Seg].[AccesoInstalacion]  WITH CHECK ADD  CONSTRAINT [FK_AccesoInstalacion_Rol] FOREIGN KEY([RolId])
REFERENCES [Seg].[Rol] ([RolId])
GO
ALTER TABLE [Seg].[AccesoInstalacion] CHECK CONSTRAINT [FK_AccesoInstalacion_Rol]
GO
ALTER TABLE [Seg].[AccesoInstalacion]  WITH CHECK ADD  CONSTRAINT [FK_AccesoInstalacion_Usuario] FOREIGN KEY([UsuarioId])
REFERENCES [Seg].[Usuario] ([UsuarioId])
GO
ALTER TABLE [Seg].[AccesoInstalacion] CHECK CONSTRAINT [FK_AccesoInstalacion_Usuario]
GO
ALTER TABLE [Seg].[Modulo]  WITH CHECK ADD  CONSTRAINT [FK_Modulo_Padre] FOREIGN KEY([PadreId])
REFERENCES [Seg].[Modulo] ([ModuloId])
GO
ALTER TABLE [Seg].[Modulo] CHECK CONSTRAINT [FK_Modulo_Padre]
GO
ALTER TABLE [Seg].[Permiso]  WITH CHECK ADD  CONSTRAINT [FK_Permiso_Modulo] FOREIGN KEY([ModuloId])
REFERENCES [Seg].[Modulo] ([ModuloId])
GO
ALTER TABLE [Seg].[Permiso] CHECK CONSTRAINT [FK_Permiso_Modulo]
GO
ALTER TABLE [Seg].[RolPermiso]  WITH CHECK ADD  CONSTRAINT [FK_RolPermiso_Permiso] FOREIGN KEY([PermisoId])
REFERENCES [Seg].[Permiso] ([PermisoId])
GO
ALTER TABLE [Seg].[RolPermiso] CHECK CONSTRAINT [FK_RolPermiso_Permiso]
GO
ALTER TABLE [Seg].[RolPermiso]  WITH CHECK ADD  CONSTRAINT [FK_RolPermiso_Rol] FOREIGN KEY([RolId])
REFERENCES [Seg].[Rol] ([RolId])
GO
ALTER TABLE [Seg].[RolPermiso] CHECK CONSTRAINT [FK_RolPermiso_Rol]
GO
ALTER TABLE [Seg].[Usuario]  WITH CHECK ADD  CONSTRAINT [FK_Usuario_ActualizadoPor] FOREIGN KEY([ActualizadoPor])
REFERENCES [Seg].[Usuario] ([UsuarioId])
GO
ALTER TABLE [Seg].[Usuario] CHECK CONSTRAINT [FK_Usuario_ActualizadoPor]
GO
ALTER TABLE [Seg].[Usuario]  WITH CHECK ADD  CONSTRAINT [FK_Usuario_CreadoPor] FOREIGN KEY([CreadoPor])
REFERENCES [Seg].[Usuario] ([UsuarioId])
GO
ALTER TABLE [Seg].[Usuario] CHECK CONSTRAINT [FK_Usuario_CreadoPor]
GO
ALTER TABLE [Seg].[Usuario]  WITH CHECK ADD  CONSTRAINT [FK_Usuario_Estatus] FOREIGN KEY([EstatusId])
REFERENCES [Aud].[EstatusGeneral] ([EstatusId])
GO
ALTER TABLE [Seg].[Usuario] CHECK CONSTRAINT [FK_Usuario_Estatus]
GO
ALTER TABLE [Ven].[Venta]  WITH CHECK ADD  CONSTRAINT [FK_Venta_Cliente] FOREIGN KEY([ClienteId])
REFERENCES [Ven].[Cliente] ([ClienteId])
GO
ALTER TABLE [Ven].[Venta] CHECK CONSTRAINT [FK_Venta_Cliente]
GO
ALTER TABLE [Ven].[Venta]  WITH CHECK ADD  CONSTRAINT [FK_Venta_Estatus] FOREIGN KEY([EstatusId])
REFERENCES [Aud].[EstatusGeneral] ([EstatusId])
GO
ALTER TABLE [Ven].[Venta] CHECK CONSTRAINT [FK_Venta_Estatus]
GO
ALTER TABLE [Ven].[Venta]  WITH CHECK ADD  CONSTRAINT [FK_Venta_Instalacion] FOREIGN KEY([InstalacionId])
REFERENCES [Org].[Instalacion] ([InstalacionId])
GO
ALTER TABLE [Ven].[Venta] CHECK CONSTRAINT [FK_Venta_Instalacion]
GO
ALTER TABLE [Ven].[VentaDetalle]  WITH CHECK ADD  CONSTRAINT [FK_VentaDetalle_Producto] FOREIGN KEY([ProductoId])
REFERENCES [Inv].[Producto] ([ProductoId])
GO
ALTER TABLE [Ven].[VentaDetalle] CHECK CONSTRAINT [FK_VentaDetalle_Producto]
GO
ALTER TABLE [Ven].[VentaDetalle]  WITH CHECK ADD  CONSTRAINT [FK_VentaDetalle_Venta] FOREIGN KEY([VentaId])
REFERENCES [Ven].[Venta] ([VentaId])
GO
ALTER TABLE [Ven].[VentaDetalle] CHECK CONSTRAINT [FK_VentaDetalle_Venta]
GO
