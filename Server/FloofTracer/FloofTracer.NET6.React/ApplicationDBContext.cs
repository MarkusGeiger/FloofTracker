using FloofTracer.NET6.React.Entities;
using Microsoft.EntityFrameworkCore;

namespace FloofTracer.NET6.React
{
  public class ApplicationDBContext : DbContext
  {
    public DbSet<PetEntry> Pets { get; set; }
    public DbSet<WeightMeasurement> Weights { get; set; }
    public DbSet<FoodMeasurement> Foods { get; set; }

    public ApplicationDBContext(DbContextOptions options) : base(options)
    {

    }
  }
}
