using Microsoft.AspNetCore.Mvc;

namespace GesvenApi.Controllers.Base;

/// <summary>
/// Base API controller providing common configuration.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
}