using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class CrearTransferenciaDtoValidator : AbstractValidator<CrearTransferenciaDto>
{
    /// <summary>
    /// Reglas de validación para crear transferencias entre instalaciones.
    /// </summary>
    public CrearTransferenciaDtoValidator()
    {
        RuleFor(x => x.InstalacionOrigenId).GreaterThan(0);
        RuleFor(x => x.InstalacionDestinoId).GreaterThan(0);
        RuleFor(x => x.Lineas).NotEmpty();
        RuleForEach(x => x.Lineas).SetValidator(new LineaTransferenciaDtoValidator());
    }
}
