using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class ActualizarClienteDtoValidator : AbstractValidator<ActualizarClienteDto>
{
    /// <summary>
    /// Reglas de validación para actualizar clientes.
    /// </summary>
    public ActualizarClienteDtoValidator()
    {
        RuleFor(x => x.RFC).NotEmpty();
        RuleFor(x => x.NombreCorto).NotEmpty();
        RuleFor(x => x.RazonSocial).NotEmpty();
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email));
        RuleFor(x => x.Telefono).MaximumLength(50).When(x => !string.IsNullOrWhiteSpace(x.Telefono));
    }
}
