using FluentValidation;
using GesvenApi.Models.Dtos.Requests;
using static GesvenApi.ConstantesGesven;

namespace GesvenApi.Validators;

public class CrearAjusteDtoValidator : AbstractValidator<CrearAjusteDto>
{
    /// <summary>
    /// Reglas de validación para crear ajustes de inventario.
    /// </summary>
    public CrearAjusteDtoValidator()
    {
        RuleFor(x => x.InstalacionId).GreaterThan(0);
        RuleFor(x => x.ProductoId).GreaterThan(0);
        RuleFor(x => x.Cantidad).GreaterThan(0);
        RuleFor(x => x.Motivo).NotEmpty().MaximumLength(500);
        RuleFor(x => x.TipoAjuste)
            .Must(tipo => tipo == TipoMovimiento.Entrada || tipo == TipoMovimiento.Salida)
            .WithMessage("TipoAjuste debe ser Entrada (E) o Salida (S)");
    }
}
