package com.example.helloworld;

import io.dropwizard.Configuration;
import io.dropwizard.client.JerseyClientConfiguration;
import io.dropwizard.db.DataSourceFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HelloWorldConfiguration extends Configuration {
	
    @Valid
    @NotNull
    @JsonProperty
    private DataSourceFactory database = new DataSourceFactory();

    @Valid
    @NotNull
    @JsonProperty
    private JerseyClientConfiguration httpClient = new JerseyClientConfiguration();
    
    @Valid
    @NotNull
    @JsonProperty
    private ClientSecretsConfiguration clientSecrets = new ClientSecretsConfiguration();
    
    public DataSourceFactory getDataSourceFactory() {
        return database;
    }

    public void setDataSourceFactory(DataSourceFactory dataSourceFactory) {
        this.database = dataSourceFactory;
    }

	public JerseyClientConfiguration getJerseyClient() {
        return httpClient;
    }
	
	public ClientSecretsConfiguration getClientSecrets() {
		return clientSecrets;
	}
	
	public static class ClientSecretsConfiguration {
		
		@NotBlank
		@JsonProperty
		String facebook;
		
		@NotBlank
		@JsonProperty
		String google;
		
		@NotBlank
		@JsonProperty
		String linkedin;
		
		@NotBlank
		@JsonProperty
		String github;
		
		@NotBlank
		@JsonProperty
		String foursquare;
		
		@NotBlank
		@JsonProperty
		String twitter;
		
		public String getFacebook() {
			return facebook;
		}
		
		public String getGoogle() {
			return google;
		}
		
		public String getLinkedin() {
			return linkedin;
		}
		
		public String getFoursquare() {
			return foursquare;
		}
		
		public String getTwitter() {
			return twitter;
		}
	}
}
