using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class ActualizarProductoDtoValidator : AbstractValidator<ActualizarProductoDto>
{
    /// <summary>
    /// Reglas de validación para actualizar productos existentes.
    /// </summary>
    public ActualizarProductoDtoValidator()
    {
        RuleFor(x => x.Nombre).NotEmpty().MaximumLength(200);
        RuleFor(x => x.MarcaId).GreaterThan(0).When(x => x.MarcaId.HasValue);
        RuleFor(x => x.UnidadId).GreaterThan(0).When(x => x.UnidadId.HasValue);
        RuleFor(x => x.Codigo).MaximumLength(100);
        RuleFor(x => x.PrecioUnitario).GreaterThanOrEqualTo(0);
        RuleFor(x => x.StockMinimo).GreaterThanOrEqualTo(0);
    }
}
