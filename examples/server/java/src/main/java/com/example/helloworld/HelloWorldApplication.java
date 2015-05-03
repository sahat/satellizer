package com.example.helloworld;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.client.JerseyClientBuilder;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

import javax.ws.rs.client.Client;

import com.example.helloworld.HelloWorldConfiguration.ClientSecretsConfiguration;
import com.example.helloworld.auth.AuthFilter;
import com.example.helloworld.core.User;
import com.example.helloworld.db.UserDAO;
import com.example.helloworld.resources.AuthResource;
import com.example.helloworld.resources.ClientResource;
import com.example.helloworld.resources.UserResource;

public class HelloWorldApplication extends Application<HelloWorldConfiguration> {
  public static void main(final String[] args) throws Exception {
    new HelloWorldApplication().run(args);
  }

  private final HibernateBundle<HelloWorldConfiguration> hibernateBundle =
      new HibernateBundle<HelloWorldConfiguration>(User.class) {
        @Override
        public DataSourceFactory getDataSourceFactory(final HelloWorldConfiguration configuration) {
          return configuration.getDataSourceFactory();
        }
      };

  @Override
  public String getName() {
    return "hello-world";
  }

  @Override
  public void initialize(final Bootstrap<HelloWorldConfiguration> bootstrap) {
    bootstrap.addBundle(new MigrationsBundle<HelloWorldConfiguration>() {
      @Override
      public DataSourceFactory getDataSourceFactory(final HelloWorldConfiguration configuration) {
        return configuration.getDataSourceFactory();
      }
    });

    bootstrap.addBundle(hibernateBundle);

    bootstrap.addBundle(new AssetsBundle("/assets/app.js", "/app.js", null, "app"));
    bootstrap.addBundle(new AssetsBundle("/assets/stylesheets", "/stylesheets", null, "css"));
    bootstrap.addBundle(new AssetsBundle("/assets/directives", "/directives", null, "directives"));
    bootstrap
        .addBundle(new AssetsBundle("/assets/controllers", "/controllers", null, "controllers"));
    bootstrap.addBundle(new AssetsBundle("/assets/services", "/services", null, "services"));
    bootstrap.addBundle(new AssetsBundle("/assets/vendor", "/vendor", null, "vendor"));
    bootstrap.addBundle(new AssetsBundle("/assets/partials", "/partials", null, "partials"));
  }

  @Override
  public void run(final HelloWorldConfiguration configuration, final Environment environment)
      throws ClassNotFoundException {

    final UserDAO dao = new UserDAO(hibernateBundle.getSessionFactory());
    final Client client =
        new JerseyClientBuilder(environment).using(configuration.getJerseyClient())
            .build(getName());
    final ClientSecretsConfiguration clientSecrets = configuration.getClientSecrets();

    environment.jersey().register(new ClientResource());
    environment.jersey().register(new UserResource(dao));
    environment.jersey().register(new AuthResource(client, dao, clientSecrets));

    environment.servlets().addFilter("AuthFilter", new AuthFilter())
        .addMappingForUrlPatterns(null, true, "/api/me");
  }
}
