namespace FloofTracer.NET6.React.Entities
{
  public class FoodType
  {
    public int Id { get; set; }
    public string EuropeanArticleNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DailyPortionPerKilogram { get; set; }
    public string ProductUrl { get; set; } = string.Empty;

  }
}
