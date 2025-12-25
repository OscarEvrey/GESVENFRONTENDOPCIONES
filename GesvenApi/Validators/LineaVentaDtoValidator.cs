using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class LineaVentaDtoValidator : AbstractValidator<LineaVentaDto>
{
    /// <summary>
    /// Reglas para cada línea de venta.
    /// </summary>
    public LineaVentaDtoValidator()
    {
        RuleFor(x => x.ProductoId).GreaterThan(0);
        RuleFor(x => x.Cantidad).GreaterThan(0);
        RuleFor(x => x.PrecioUnitario).GreaterThanOrEqualTo(0);
    }
}
