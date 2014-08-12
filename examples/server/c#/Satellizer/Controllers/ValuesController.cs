using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Satellizer.Controllers
{

    public class MyApiController : ApiController
    {

    }

    public class ValuesController : MyApiController
    {
        // GET api/values
        public IEnumerable<string> Get()
        {
            return new [] { "value1", "value2" };
        }


        // GET api/values/5
        public string Get(int id)
        {

            return "value";
        }

        public static int Temp(int x, int y)
        {
            return x + y;
        }





        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
