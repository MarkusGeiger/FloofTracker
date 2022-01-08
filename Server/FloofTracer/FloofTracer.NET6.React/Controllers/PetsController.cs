#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FloofTracer.NET6.React;
using FloofTracer.NET6.React.Entities;

namespace FloofTracer.NET6.React.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public PetsController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/Pets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetEntry>>> GetPets()
        {
            return await _context.Pets.ToListAsync();
        }

        // GET: api/Pets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PetEntry>> GetPetEntry(int id)
        {
            var petEntry = await _context.Pets.FindAsync(id);

            if (petEntry == null)
            {
                return NotFound();
            }

            return petEntry;
        }

        // PUT: api/Pets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPetEntry(int id, PetEntry petEntry)
        {
            if (id != petEntry.Id)
            {
                return BadRequest();
            }

            _context.Entry(petEntry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PetEntryExists(id))
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

        // POST: api/Pets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PetEntry>> PostPetEntry(PetEntry petEntry)
        {
            _context.Pets.Add(petEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPetEntry", new { id = petEntry.Id }, petEntry);
        }

        // DELETE: api/Pets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePetEntry(int id)
        {
            var petEntry = await _context.Pets.FindAsync(id);
            if (petEntry == null)
            {
                return NotFound();
            }

            _context.Pets.Remove(petEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PetEntryExists(int id)
        {
            return _context.Pets.Any(e => e.Id == id);
        }
    }
}
