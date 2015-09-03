using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace Satellizer.Controllers
{
    [Route("api")]
    public class UserController : Controller
    {
        // GET: api/me
        [HttpGet("me")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // PUT api/me
        [HttpPut("me")]
        public string Get(int id)
        {
            return "value";
        }
    }
}
