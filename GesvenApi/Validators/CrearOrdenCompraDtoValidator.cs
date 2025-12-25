using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class CrearOrdenCompraDtoValidator : AbstractValidator<CrearOrdenCompraDto>
{
    /// <summary>
    /// Reglas de validación para crear una orden de compra.
    /// </summary>
    public CrearOrdenCompraDtoValidator()
    {
        RuleFor(x => x.InstalacionId).GreaterThan(0);
        RuleFor(x => x.ProveedorId).GreaterThan(0);
        RuleFor(x => x.Lineas).NotEmpty();
        RuleForEach(x => x.Lineas).SetValidator(new LineaOrdenCompraDtoValidator());
    }
}
