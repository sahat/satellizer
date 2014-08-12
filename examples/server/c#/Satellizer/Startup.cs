using System;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Security;
using Microsoft.AspNet.Routing;
using Microsoft.AspNet.Security.Cookies;
using Microsoft.Data.Entity;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;
using Satellizer.Models;

namespace Satellizer
{
    public class Startup
    {
        public void Configure(IBuilder app)
        {
            // Setup configuration sources
            var configuration = new Configuration();
            configuration.AddJsonFile("config.json");
            configuration.AddEnvironmentVariables();

            // Set up application services
            app.UseServices(services =>
            {
                // Add EF services to the services container
                services.AddEntityFramework()
                    .AddSqlServer();

                // Configure DbContext
                services.SetupOptions<DbContextOptions>(options =>
                {
                    options.UseSqlServer(configuration.Get("Data:DefaultConnection:ConnectionString"));
                });
                
                // Add Identity services to the services container
                services.AddIdentity<ApplicationUser>()
                    .AddEntityFramework<ApplicationUser, ApplicationDbContext>()
                    .AddHttpSignIn();

                // Add MVC services to the services container
                services.AddMvc();
            });

            // Enable Browser Link support
            app.UseBrowserLink();

            // Add static files to the request pipeline
            app.UseStaticFiles();

            // Add cookie-based authentication to the request pipeline
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
            });

            // Add MVC to the request pipeline
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default", 
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });

                routes.MapRoute(
                    name: "api",
                    template: "{controller}/{id?}");
            });
        }
    }
}
