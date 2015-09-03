using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace Satellizer.Controllers
{
    [Route("auth")]
    public class AuthController : Controller
    {
        // POST auth/login
        [HttpPost("login")]
        public ActionResult Login([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/signup
        [HttpPost("signup")]
        public ActionResult Signup([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/facebook
        [HttpPost("facebook")]
        public ActionResult Facebook([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/google
        [HttpPost("google")]
        public ActionResult Google([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/github
        [HttpPost("github")]
        public ActionResult Github([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/instagram
        [HttpPost("instagram")]
        public ActionResult Instagram([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/linkedin
        [HttpPost("linkedin")]
        public ActionResult Linkedin([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/live
        [HttpPost("live")]
        public ActionResult WindowsLive([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/yahoo
        [HttpPost("yahoo")]
        public ActionResult Yahoo([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/twitter
        [HttpPost("twitter")]
        public ActionResult Twitter([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/foursquare
        [HttpPost("foursquare")]
        public ActionResult Foursquare([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }

        // POST auth/unlink
        [HttpPost("unlink")]
        public ActionResult UnlinkProvider([FromBody]string value)
        {
            return Json(new { foo = "bar", baz = "Blech" });
        }
    }
}
