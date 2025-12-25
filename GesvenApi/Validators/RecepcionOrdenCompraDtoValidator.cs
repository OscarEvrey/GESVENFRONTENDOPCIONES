using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class RecepcionOrdenCompraDtoValidator : AbstractValidator<RecepcionOrdenCompraDto>
{
    /// <summary>
    /// Reglas de validación para la recepción de una orden de compra.
    /// </summary>
    public RecepcionOrdenCompraDtoValidator()
    {
        RuleFor(x => x.Lineas).NotEmpty();
        RuleForEach(x => x.Lineas).SetValidator(new LineaRecepcionOrdenCompraDtoValidator());
    }
}
