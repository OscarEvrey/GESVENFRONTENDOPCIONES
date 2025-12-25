using AutoMapper;
using AutoMapper.QueryableExtensions;
using GesvenApi.Data;
using GesvenApi.Models.Dtos.Requests;
using GesvenApi.Models.Dtos.Responses;
using GesvenApi.Models.Ventas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Controllers;

/// <summary>
/// Controlador para gestión de clientes.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly GesvenDbContext _contexto;
        private readonly IMapper _mapper;
    private readonly ILogger<ClientesController> _logger;

        public ClientesController(GesvenDbContext contexto, IMapper mapper, ILogger<ClientesController> logger)
    {
        _contexto = contexto;
            _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/clientes
    /// Lista clientes.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RespuestaApi<List<ClienteDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RespuestaApi<List<ClienteDto>>>> ObtenerClientes()
    {
        var clientes = await _contexto.Clientes
            .OrderBy(c => c.NombreCorto)
                .ProjectTo<ClienteDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(new RespuestaApi<List<ClienteDto>>
        {
            Exito = true,
            Mensaje = $"Se encontraron {clientes.Count} clientes",
            Datos = clientes
        });
    }

    /// <summary>
    /// GET /api/clientes/{id}
    /// Obtiene un cliente.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<ClienteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ClienteDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<ClienteDto>>> ObtenerCliente(int id)
    {
        var cliente = await _contexto.Clientes
            .Where(c => c.ClienteId == id)
            .ProjectTo<ClienteDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (cliente is null)
        {
            return NotFound(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "Cliente no encontrado"
            });
        }

        return Ok(new RespuestaApi<ClienteDto>
        {
            Exito = true,
            Mensaje = "Cliente obtenido",
            Datos = cliente
        });
    }

    /// <summary>
    /// POST /api/clientes
    /// Crea un cliente.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RespuestaApi<ClienteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ClienteDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespuestaApi<ClienteDto>>> CrearCliente([FromBody] CrearClienteDto dto)
    {
        if (!EsRfcValido(dto.RFC))
        {
            return BadRequest(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "El RFC es inválido. Debe tener 12 o 13 caracteres alfanuméricos."
            });
        }

        var rfcDuplicado = await _contexto.Clientes.AnyAsync(c => c.RFC == dto.RFC);
        if (rfcDuplicado)
        {
            return BadRequest(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "El RFC ya está registrado"
            });
        }

        var aliasDuplicado = await _contexto.Clientes.AnyAsync(c => c.NombreCorto == dto.NombreCorto);
        if (aliasDuplicado)
        {
            return BadRequest(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "El nombre corto ya está registrado"
            });
        }

        var cliente = new Cliente
        {
            RFC = dto.RFC,
            NombreCorto = dto.NombreCorto,
            RazonSocial = dto.RazonSocial,
            Email = dto.Email,
            Telefono = dto.Telefono,
            Direccion = dto.Direccion,
            Ciudad = dto.Ciudad,
            CodigoPostal = dto.CodigoPostal,
            Contacto = dto.Contacto,
            Activo = true
        };

        _contexto.Clientes.Add(cliente);
        await _contexto.SaveChangesAsync();

        var clienteCreado = _mapper.Map<ClienteDto>(cliente);

        return Ok(new RespuestaApi<ClienteDto>
        {
            Exito = true,
            Mensaje = "Cliente creado",
            Datos = clienteCreado
        });
    }

    /// <summary>
    /// PUT /api/clientes/{id}
    /// Actualiza un cliente.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(RespuestaApi<ClienteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<ClienteDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<ClienteDto>>> ActualizarCliente(int id, [FromBody] ActualizarClienteDto dto)
    {
        if (!EsRfcValido(dto.RFC))
        {
            return BadRequest(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "El RFC es inválido. Debe tener 12 o 13 caracteres alfanuméricos."
            });
        }

        var cliente = await _contexto.Clientes.FindAsync(id);
        if (cliente is null)
        {
            return NotFound(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "Cliente no encontrado"
            });
        }

        var rfcDuplicado = await _contexto.Clientes.AnyAsync(c => c.RFC == dto.RFC && c.ClienteId != id);
        if (rfcDuplicado)
        {
            return BadRequest(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "El RFC ya está registrado"
            });
        }

        var aliasDuplicado = await _contexto.Clientes.AnyAsync(c => c.NombreCorto == dto.NombreCorto && c.ClienteId != id);
        if (aliasDuplicado)
        {
            return BadRequest(new RespuestaApi<ClienteDto>
            {
                Exito = false,
                Mensaje = "El nombre corto ya está registrado"
            });
        }

        cliente.RFC = dto.RFC;
        cliente.NombreCorto = dto.NombreCorto;
        cliente.RazonSocial = dto.RazonSocial;
        cliente.Email = dto.Email;
        cliente.Telefono = dto.Telefono;
        cliente.Direccion = dto.Direccion;
        cliente.Ciudad = dto.Ciudad;
        cliente.CodigoPostal = dto.CodigoPostal;
        cliente.Contacto = dto.Contacto;
        cliente.Activo = dto.Activo;

        await _contexto.SaveChangesAsync();

        var clienteActualizado = _mapper.Map<ClienteDto>(cliente);

        return Ok(new RespuestaApi<ClienteDto>
        {
            Exito = true,
            Mensaje = "Cliente actualizado",
            Datos = clienteActualizado
        });
    }

    /// <summary>
    /// PATCH /api/clientes/{id}/estatus
    /// Cambia el estatus de un cliente.
    /// </summary>
    [HttpPatch("{id}/estatus")]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(RespuestaApi<bool>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespuestaApi<bool>>> CambiarEstatus(int id, [FromQuery] bool activo)
    {
        var cliente = await _contexto.Clientes.FindAsync(id);
        if (cliente is null)
        {
            return NotFound(new RespuestaApi<bool>
            {
                Exito = false,
                Mensaje = "Cliente no encontrado"
            });
        }

        cliente.Activo = activo;
        await _contexto.SaveChangesAsync();

        return Ok(new RespuestaApi<bool>
        {
            Exito = true,
            Mensaje = activo ? "Cliente activado" : "Cliente desactivado",
            Datos = true
        });
    }

    private static bool EsRfcValido(string rfc)
    {
        if (string.IsNullOrWhiteSpace(rfc))
        {
            return false;
        }

        var longitudValida = rfc.Length is 12 or 13;
        var soloAlfanumerico = rfc.All(char.IsLetterOrDigit);
        return longitudValida && soloAlfanumerico;
    }
}

