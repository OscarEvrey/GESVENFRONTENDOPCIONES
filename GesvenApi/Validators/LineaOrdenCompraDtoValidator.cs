using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class LineaOrdenCompraDtoValidator : AbstractValidator<LineaOrdenCompraDto>
{
    /// <summary>
    /// Reglas de validación para cada línea de orden de compra.
    /// </summary>
    public LineaOrdenCompraDtoValidator()
    {
        RuleFor(x => x.ProductoId).GreaterThan(0);
        RuleFor(x => x.Cantidad).GreaterThan(0);
        RuleFor(x => x.CostoUnitario).GreaterThanOrEqualTo(0);
    }
}
