﻿#nullable disable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FloofTracer.NET6.React.Entities;

namespace FloofTracer.NET6.React.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class WeightController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly ILogger<WeightController> _logger;

    public WeightController(ApplicationDBContext context, ILogger<WeightController> logger)
    {
      _context = context;
      _logger = logger;
    }

    // GET: api/Weight
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WeightMeasurement>>> GetWeights()
    {
      return await _context.Weights.ToListAsync();
    }

    // GET: api/Weight/5
    [HttpGet("{id}")]
    public async Task<ActionResult<WeightMeasurement>> GetWeightMeasurement(int id)
    {
      var weightMeasurement = await _context.Weights.FindAsync(id);

      if (weightMeasurement == null)
      {
        return NotFound();
      }

      return weightMeasurement;
    }

    // PUT: api/Weight/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutWeightMeasurement(int id, WeightMeasurement weightMeasurement)
    {
      if (id != weightMeasurement.Id)
      {
        return BadRequest();
      }

      _context.Entry(weightMeasurement).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!WeightMeasurementExists(id))
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

    // POST: api/Weight
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<WeightMeasurement>> PostWeightMeasurement(WeightMeasurement weightMeasurement)
    {
      _context.Weights.Add(weightMeasurement);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetWeightMeasurement", new { id = weightMeasurement.Id }, weightMeasurement);
    }

    // DELETE: api/Weight/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWeightMeasurement(int id)
    {
      var weightMeasurement = await _context.Weights.FindAsync(id);
      if (weightMeasurement == null)
      {
        _logger.LogInformation($"Delete Weight Entry '{id}': Not Found");
        return NotFound();
      }

      _logger.LogInformation($"Delete Weight Entry '{id}': {weightMeasurement}");
      _context.Weights.Remove(weightMeasurement);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool WeightMeasurementExists(int id)
    {
      return _context.Weights.Any(e => e.Id == id);
    }
  }
}
