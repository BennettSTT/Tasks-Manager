using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using TasksManagerFinal.DataAccess.DbImplementation.Extensions;
using TasksManagerFinal.DataAccess.UnitOfWork;
using TasksManagerFinal.DataAccess.UnitOfWork.EFCore.Extensions;
using TasksManagerFinal.Services.UnitOfWork.Extensions;
using TasksManagerFinal.ViewModel;

namespace TasksManagerFinal
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            RegisterModules(services);
            ConfigureJwtAuthService(services);
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IUnitOfWork uow)
        {
            uow.Migrate();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }

        private void RegisterModules(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("TasksContext");
            services
                .RegisterUnitOfWorkEFCore(connectionString)
                .RegisterUnitOfWorkDataAccess()
                .RegisterServicesUnitOfWork()
                ;
        }

        private void ConfigureJwtAuthService(IServiceCollection services)
        {
            services.Configure<JWTAuthOptions>(Configuration.GetSection("JWTAuthOptions"));

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        LifetimeValidator = CustomLifetimeValidator,

                        ValidIssuer = Configuration["JWTAuthOptions:Issuer"],
                        ValidAudience = Configuration["JWTAuthOptions:Audience"],

                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(
                            Configuration["JWTAuthOptions:Key"])
                        )
                    };
                });
        }

        private static bool CustomLifetimeValidator(DateTime? notBefore, DateTime? expires, 
            SecurityToken securityToken, TokenValidationParameters validationParameters)
        {
            if (expires != null)
            {
                return DateTime.UtcNow < expires;
            }
            return false;
        }
    }
}
