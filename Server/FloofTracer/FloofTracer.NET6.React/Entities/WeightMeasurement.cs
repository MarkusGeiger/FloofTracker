namespace FloofTracer.NET6.React.Entities
{
  public class WeightMeasurement
  {
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public int Value { get; set; }
    public int PetId { get; set; }
    public string Unit { get; set; } = "g";
  }
}
