using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class LineaRecepcionTransferenciaDtoValidator : AbstractValidator<LineaRecepcionTransferenciaDto>
{
    /// <summary>
    /// Reglas para validar las líneas recibidas de una transferencia.
    /// </summary>
    public LineaRecepcionTransferenciaDtoValidator()
    {
        RuleFor(x => x.DetalleId).GreaterThan(0);
        RuleFor(x => x.CantidadRecibida).GreaterThan(0);
    }
}
