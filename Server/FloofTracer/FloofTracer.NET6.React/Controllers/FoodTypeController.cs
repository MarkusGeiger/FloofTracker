using FloofTracer.NET6.React.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FloofTracer.NET6.React.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FoodTypeController : ControllerBase
  {
    private readonly ApplicationDBContext _context;

    public FoodTypeController(ApplicationDBContext context)
    {
      _context = context;
    }

    // GET: api/<FoodTypeController>
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<FoodType>>> GetFoodTypes()
    {
      return await _context.FoodTypes.ToListAsync();
    }

    // GET api/<FoodTypeController>/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FoodType>> GetFoodType(int id)
    {
      var foodType = await _context.FoodTypes.FindAsync(id);

      if (foodType == null)
      {
        return NotFound();
      }
      return foodType;
    }

    // PUT api/<FoodTypeController>/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutFoodType(int id, [FromBody] FoodType foodType)
    {
      if (id != foodType.Id)
      {
        return BadRequest();
      }

      _context.Entry(foodType).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException) 
      {
        if(!FoodTypeExists(id))
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

    // POST api/<FoodTypeController>
    [HttpPost]
    public async Task<ActionResult<FoodType>> PostFoodType([FromBody] FoodType foodType)
    {
      _context.FoodTypes.Add(foodType);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetFoodType", new { id = foodType.Id }, foodType);
    }

    // DELETE api/<FoodTypeController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFoodType(int id)
    {
      var foodType = await _context.FoodTypes.FindAsync(id);
      if (foodType == null)
      {
        return NotFound();
      }

      _context.FoodTypes.Remove(foodType);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool FoodTypeExists(int id)
    {
      return _context.FoodTypes.Any(e => e.Id == id);
    }
  }
}
