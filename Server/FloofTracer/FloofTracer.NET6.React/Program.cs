using FloofTracer.NET6.React;
using Microsoft.EntityFrameworkCore;
using NLog;
using NLog.Web;

var logger = LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");

try
{
  var builder = WebApplication.CreateBuilder(args);

  // Add services to the container.

  builder.Services.AddControllersWithViews();


  // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
  builder.Services.AddEndpointsApiExplorer();
  builder.Services.AddSwaggerGen();

  builder.Host.UseNLog();

  builder.Services.AddDbContext<ApplicationDBContext>(options =>
  {
    options.UseSqlite("Data Source=Application.db");
  });

  var app = builder.Build();

  //app.Services.GetRequiredService<ApplicationDBContext>().Database.Migrate();

  // Configure the HTTP request pipeline.
  if (!app.Environment.IsDevelopment())
  {
  }
  else
  {
    app.UseSwagger();
    app.UseSwaggerUI();
  }

  app.UseStaticFiles();
  app.UseRouting();


  app.MapControllerRoute(
      name: "default",
      pattern: "{controller}/{action=Index}/{id?}");

  app.MapFallbackToFile("index.html"); ;

  app.Run();
}
catch (Exception exception)
{
  // NLog: catch setup errors
  logger.Error(exception, "Stopped program because of exception");
  throw;
}
finally
{
  // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
  NLog.LogManager.Shutdown();
}
