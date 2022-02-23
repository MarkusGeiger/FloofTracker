#nullable disable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FloofTracer.NET6.React.Entities;

namespace FloofTracer.NET6.React.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FoodController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly ILogger<FoodController> _logger;

    public FoodController(ApplicationDBContext context, ILogger<FoodController> logger)
    {
      _context = context;
      _logger = logger;
    }

    // GET: api/Food
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FoodMeasurement>>> GetFoods([FromQuery] DateTime? date = null, [FromQuery] int? petId = null)
    {
      _logger.LogInformation($"Get Foods on '{date}' for '{petId}'");
      if (date.HasValue && petId.HasValue)
      {
        return await _context.Foods.Where(foodMeasurement => foodMeasurement.Timestamp.Date == date.Value.Date && foodMeasurement.PetId == petId).ToListAsync();
      }
      return await _context.Foods.ToListAsync();
    }

    [HttpGet("daily")]
    public async Task<ActionResult<IEnumerable<GroupedFoodItem>>> GetFoodsDaily([FromQuery] int petId)
    {
      var foodList = await _context.Foods.Where(foodMeasurement => foodMeasurement.PetId == petId).ToListAsync();
      return Ok(foodList.GroupBy(food => food.Timestamp.Date).OrderBy(groupItem => groupItem.Key).Select(groupItem => new GroupedFoodItem(groupItem.Key, groupItem.ToList(), groupItem.Sum(food => food.Value), petId)));
    }

    // GET: api/Food/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FoodMeasurement>> GetFoodMeasurement(int id)
    {
      var foodMeasurement = await _context.Foods.FindAsync(id);

      if (foodMeasurement == null)
      {
        return NotFound();
      }

      return foodMeasurement;
    }

    // PUT: api/Food/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutFoodMeasurement(int id, FoodMeasurement foodMeasurement)
    {
      if (id != foodMeasurement.Id)
      {
        return BadRequest();
      }

      _context.Entry(foodMeasurement).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!FoodMeasurementExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/Food
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<FoodMeasurement>> PostFoodMeasurement(FoodMeasurement foodMeasurement)
    {
      if(foodMeasurement.Timestamp == DateTime.MinValue) foodMeasurement.Timestamp = DateTime.UtcNow;
      _context.Foods.Add(foodMeasurement);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetFoodMeasurement", new { id = foodMeasurement.Id }, foodMeasurement);
    }

    // DELETE: api/Food/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFoodMeasurement(int id)
    {
      var foodMeasurement = await _context.Foods.FindAsync(id);
      if (foodMeasurement == null)
      {
        _logger.LogInformation($"Delete Food Entry '{id}': Not Found");
        return NotFound();
      }

      _logger.LogInformation($"Delete Food Entry '{id}': {foodMeasurement}");
      _context.Foods.Remove(foodMeasurement);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool FoodMeasurementExists(int id)
    {
      return _context.Foods.Any(e => e.Id == id);
    }
  }

  public record GroupedFoodItem(DateTime Date, List<FoodMeasurement> Weights, int Sum, int? PetId);
}
