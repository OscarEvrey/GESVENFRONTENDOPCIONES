using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class CrearVentaDtoValidator : AbstractValidator<CrearVentaDto>
{
    /// <summary>
    /// Reglas de validación para crear ventas.
    /// </summary>
    public CrearVentaDtoValidator()
    {
        RuleFor(x => x.InstalacionId).GreaterThan(0);
        RuleFor(x => x.ClienteId).GreaterThan(0);
        RuleFor(x => x.Lineas).NotEmpty();
        RuleForEach(x => x.Lineas).SetValidator(new LineaVentaDtoValidator());
    }
}
