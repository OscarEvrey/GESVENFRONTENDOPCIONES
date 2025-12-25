using FluentValidation;
using GesvenApi.Models.Dtos.Requests;

namespace GesvenApi.Validators;

public class LineaRecepcionOrdenCompraDtoValidator : AbstractValidator<LineaRecepcionOrdenCompraDto>
{
    /// <summary>
    /// Reglas para validar cada línea recibida en una orden de compra.
    /// </summary>
    public LineaRecepcionOrdenCompraDtoValidator()
    {
        RuleFor(x => x.DetalleId).GreaterThan(0);
        RuleFor(x => x.CantidadRecibida).GreaterThan(0);
    }
}
