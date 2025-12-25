using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class RecibirTransferenciaDtoValidator : AbstractValidator<RecibirTransferenciaDto>
{
    /// <summary>
    /// Reglas de validación para registrar la recepción de transferencias.
    /// </summary>
    public RecibirTransferenciaDtoValidator()
    {
        RuleFor(x => x.Lineas).NotEmpty();
        RuleForEach(x => x.Lineas).SetValidator(new LineaRecepcionTransferenciaDtoValidator());
    }
}
