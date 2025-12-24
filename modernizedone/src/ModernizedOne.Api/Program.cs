using ModernizedOne.Api.Endpoints;
using ModernizedOne.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDevCurrentUserOptions(builder.Configuration);
builder.Services.AddCurrentUserProvider(builder.Environment);
builder.Services.AddAuthorizationContext(builder.Environment, builder.Configuration);

builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();

app.MapGroup("/api")
    .WithOpenApi()
    .MapCurrentUserEndpoints();

app.MapHealthChecks("/health");

app.Run();
