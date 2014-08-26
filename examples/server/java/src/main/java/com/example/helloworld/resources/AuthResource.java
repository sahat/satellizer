package com.example.helloworld.resources;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import com.example.helloworld.db.UserDAO;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.core.util.MultivaluedMapImpl;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

	private Client client;
	private UserDAO dao;
	
	public static final String 
		CLIENT_ID_KEY = "client_id",
		REDIRECT_URI_KEY = "redirect_uri",
		CLIENT_SECRET = "client_secret",
		CODE_KEY = "code";

	public AuthResource(Client client, UserDAO dao) {
		this.client = client;
		this.dao = dao;
	}

	@POST
	@Path("login")
	public Response loginEmail() {
		return Response.ok().build();
	}

	@POST
	@Path("signup")
	public Response signup() {
		return Response.ok().build();
	}

	@POST
	@Path("facebook")
	public Response loginFacebook(FacebookPayload payload) {
		String accessTokenUrl = "https://graph.facebook.com/oauth/access_token";
		String graphApiUrl = "https://graph.facebook.com/me";
		
		// Step 1. Exchange authorization code for access token.
		MultivaluedMap<String, String> queryParams = new MultivaluedMapImpl();
		queryParams.add(CLIENT_ID_KEY, payload.getClientId());
		queryParams.add(REDIRECT_URI_KEY, payload.getRedirectUri());
		// FIXME: inject this from config or system properties
		queryParams.add(CLIENT_SECRET, "298fb6c080fda239b809ae418bf49700");
		queryParams.add(CODE_KEY, payload.getCode());
	
		ClientResponse response = client.resource(accessTokenUrl).queryParams(queryParams).get(ClientResponse.class);
		System.out.println(response.getStatus());

		// TODO: need to test this!
		List<String> auth = response.getHeaders().get("authorization");
		if (auth != null && !auth.isEmpty() && !auth.get(0).isEmpty()) {
			// user exists
			
		}
		
		// Step 2. Retrieve profile information about the current user.

		// Step 3a. If user is already signed in then link accounts.

		// Step 3b. Create a new user account or return an existing one.

		// Should return the token entity {key: key}
		return Response.ok().build();
	}

	@POST
	@Path("google")
	public Response loginGoogle() {
		return Response.ok().build();
	}

	@POST
	@Path("linkedin")
	public Response loginLinkedin() {
		return Response.ok().build();
	}

	@POST
	@Path("github")
	public Response loginGithub() {
		return Response.ok().build();
	}

	@POST
	@Path("foursquare")
	public Response loginFoursquare() {
		return Response.ok().build();
	}

	@GET
	@Path("twitter")
	public Response loginTwitter() {
		return Response.ok().build();
	}

	@GET
	@Path("unlink/{provider}")
	public Response unlink() {
		return Response.ok().build();
	}

	public static class FacebookPayload {
		String clientId;
		String redirectUri;
		String code;
		
		public FacebookPayload(@JsonProperty("cliendId") String cliendId, 
				@JsonProperty("redirectUri") String redirectUri, 
				@JsonProperty("code") String code) {
			this.clientId = cliendId;
			this.redirectUri = redirectUri;
			this.code = code;
		}
		
		public String getClientId() {
			return clientId;
		}
		
		public String getRedirectUri() {
			return redirectUri;
		}
		
		public String getCode() {
			return code;
		}
	}
}
