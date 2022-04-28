using FloofTracer.NET6.React;
using FloofTracer.NET6.React.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NLog;
using NLog.Web;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Security.Claims;

var logger = LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");

try
{
  var builder = WebApplication.CreateBuilder(args);

  // Add services to the container.
  builder.Services.AddControllersWithViews();

  // Add auth0 Authentication services
  string domain = $"https://{builder.Configuration["Auth0:Domain"]}/";
  builder.Services.AddAuthentication(options =>
  {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  }).AddJwtBearer(options =>
  {
    options.Authority = domain;
    options.Audience = builder.Configuration["Auth0:Audience"];
    // If the access token does not have a `sub` claim, `User.Identity.Name` will be `null`. Map it to a different claim by setting the NameClaimType below.
    options.TokenValidationParameters = new TokenValidationParameters
    {
      NameClaimType = ClaimTypes.NameIdentifier
    };
  });

  builder.Services.AddAuthorization(options =>
  {
    options.AddPolicy("read:foodtypes", policy => policy.Requirements.Add(new HasScopeRequirement("read:foodtypes", domain)));
  });

  builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();


  // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
  builder.Services.AddEndpointsApiExplorer();
  builder.Services.AddSwaggerGen();

  builder.Host.UseNLog();

  //parse database URL. Format is postgres://<username>:<password>@<host>/<dbname>
  var envVar = Environment.GetEnvironmentVariable("DATABASE_URL");
  if (string.IsNullOrWhiteSpace(envVar))
  {
    if (builder.Environment.IsDevelopment() && RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
    {
      var cmd = new Process();
      cmd.StartInfo.FileName = "cmd.exe";
      cmd.StartInfo.RedirectStandardInput = true;
      cmd.StartInfo.RedirectStandardOutput = true;
      cmd.StartInfo.CreateNoWindow = true;
      cmd.StartInfo.UseShellExecute = false;
      cmd.Start();

      cmd.StandardInput.WriteLine("heroku config:get DATABASE_URL -a floof-tracker");
      cmd.StandardInput.Flush();
      cmd.StandardInput.Close();
      cmd.WaitForExit();
      envVar = cmd.StandardOutput.ReadToEnd();
      logger.Log(NLog.LogLevel.Info, $"ConnectionString: {envVar}");
    }
    else
    {
      throw new ArgumentNullException("DATABASE_URL",
        "Environment variable 'DATABASE_URL' is missing. Please set variable according to 'heroku config:get DATABASE_URL -a floof-tracker' output.");
    }
  }
  var uri = new Uri(envVar);
  var username = uri.UserInfo.Split(':')[0];
  var password = uri.UserInfo.Split(':')[1];
  var connectionString =
  "Host=" + uri.Host +
  "; Database=" + uri.AbsolutePath[1..] +
  "; Username=" + username +
  "; Password=" + password +
  "; Port=" + uri.Port +
  "; SSL Mode=Prefer; Trust Server Certificate=true;";
  logger.Info(connectionString);
  builder.Services.AddDbContext<ApplicationDBContext>(options =>
  {
    //options.UseSqlite("Data Source=Application.db");
    //options.UseNpgsql("Host=raspberrypi;Database=FloofTracker;Username=postgres;Password=123456");
    options.UseNpgsql(connectionString);
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

  app.UseAuthentication();
  app.UseAuthorization();

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
