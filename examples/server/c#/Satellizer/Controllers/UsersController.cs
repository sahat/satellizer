using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Routing;

namespace Satellizer.Controllers
{
    public class UsersController : ApiController
    {
        [Route("api/me")]
        public IHttpActionResult GetMe()
        {
            return Ok("hello");
        } 

    }
}
    