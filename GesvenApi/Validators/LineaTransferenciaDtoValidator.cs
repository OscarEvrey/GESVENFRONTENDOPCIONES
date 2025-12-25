using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class LineaTransferenciaDtoValidator : AbstractValidator<LineaTransferenciaDto>
{
    /// <summary>
    /// Reglas para validar cada línea de una transferencia.
    /// </summary>
    public LineaTransferenciaDtoValidator()
    {
        RuleFor(x => x.ProductoId).GreaterThan(0);
        RuleFor(x => x.Cantidad).GreaterThan(0);
    }
}
