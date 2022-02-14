using FloofTracer.NET6.React.Entities;
using Microsoft.EntityFrameworkCore;

namespace FloofTracer.NET6.React
{
  public class ApplicationDBContext : DbContext
  {
    public DbSet<PetEntry> Pets => Set<PetEntry>();
    public DbSet<WeightMeasurement> Weights => Set<WeightMeasurement>();
    public DbSet<FoodMeasurement> Foods => Set<FoodMeasurement>();
    public DbSet<FoodType> FoodTypes => Set<FoodType>();

    public ApplicationDBContext(DbContextOptions options) : base(options)
    {

    }
  }
}
