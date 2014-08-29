package com.example.helloworld.resources;

import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.errors.ErrorMessage;

import java.io.IOException;
import java.text.ParseException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.NotBlank;

import com.example.helloworld.HelloWorldConfiguration.ClientSecretsConfiguration;
import com.example.helloworld.core.Token;
import com.example.helloworld.core.User;
import com.example.helloworld.db.UserDAO;
import com.example.helloworld.util.AuthUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Optional;
import com.google.common.base.Preconditions;
import com.nimbusds.jose.JOSEException;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.core.util.MultivaluedMapImpl;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

	private Client client;
	private UserDAO dao;
	private ClientSecretsConfiguration secrets;

	public static final String CLIENT_ID_KEY = "client_id",
			REDIRECT_URI_KEY = "redirect_uri", CLIENT_SECRET = "client_secret",
			CODE_KEY = "code";

	public static final String CONFLICT_MSG = "There is already a %s account that belongs to you",
			NOT_FOUND_MSG = "User not found";

	public AuthResource(Client client, UserDAO dao,
			ClientSecretsConfiguration secrets) {
		this.client = client;
		this.dao = dao;
		this.secrets = secrets;
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
	@UnitOfWork
	public Response loginFacebook(@Valid Payload payload,
			@Context HttpServletRequest request) throws JsonParseException,
			JsonMappingException, ClientHandlerException,
			UniformInterfaceException, IOException, ParseException, JOSEException {
		String accessTokenUrl = "https://graph.facebook.com/oauth/access_token";
		String graphApiUrl = "https://graph.facebook.com/me";

		// Step 1. Exchange authorization code for access token.
		MultivaluedMap<String, String> authParams = new MultivaluedMapImpl();
		authParams.add(CLIENT_ID_KEY, payload.getClientId());
		authParams.add(REDIRECT_URI_KEY, payload.getRedirectUri());
		authParams.add(CLIENT_SECRET, secrets.getFacebook());
		authParams.add(CODE_KEY, payload.getCode());
		ClientResponse response = client.resource(accessTokenUrl)
				.queryParams(authParams).get(ClientResponse.class);

		String paramStr = Preconditions.checkNotNull(response
				.getEntity(String.class));
		// first param is token, second is expire
		String[] params = paramStr.split("&");
		String[] tokenPair = params[0].split("=");
		String[] expirePair = params[1].split("=");
		MultivaluedMap<String, String> accessParams = new MultivaluedMapImpl();
		accessParams.add(tokenPair[0], tokenPair[1]);
		accessParams.add(expirePair[0], expirePair[1]);

		// Step 2. Retrieve profile information about the current user.
		response = client.resource(graphApiUrl).queryParams(accessParams)
				.get(ClientResponse.class);
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> userInfo = mapper.readValue(
				response.getEntity(String.class),
				new TypeReference<Map<String, Object>>() {
				});
		String facebookId = userInfo.get("id").toString();
		String displayName = userInfo.get("name").toString();
		Optional<User> fbUser = dao.findByFacebook(facebookId);

		// Step 3a. If user is already signed in then link accounts.
		User user;
		String authHeader = request.getHeader(AuthUtils.AUTH_HEADER_KEY);
		if (StringUtils.isNotBlank(authHeader)) {
			if (fbUser.isPresent()) {
				return Response
						.status(Status.CONFLICT)
						.entity(new ErrorMessage(String.format(CONFLICT_MSG,
								"Facebook"))).build();
			}

			String subject = AuthUtils.getSubject(authHeader);
			Optional<User> foundUser = dao.findById(Long.parseLong(subject));
			if (!foundUser.isPresent()) {
				return Response.status(Status.NOT_FOUND)
						.entity(new ErrorMessage(NOT_FOUND_MSG)).build();
			}
			user = foundUser.get();
			user.setFacebook(facebookId);
			if (user.getDisplayName() == null) {
				user.setDisplayName(displayName);
			}
			user = dao.save(user);
		} else {
			if (fbUser.isPresent()) {
				user = fbUser.get();
			} else {
				// Step 3b. Create a new user account or return an existing one.
				user = new User();
				user.setFacebook(facebookId);
				user.setDisplayName(displayName);
				user = dao.save(user);
			}
		}

		Token token = AuthUtils.createToken(request.getRemoteHost(),
				user.getId(), secrets.getFacebook());
		return Response.ok().entity(token).build();
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
		// TODO: make provider id null then return 200
		return Response.ok().build();
	}

	/*
	 * Inner classes for entity wrappers
	 */
	public static class Payload {
		@NotBlank
		String clientId;

		@NotBlank
		String redirectUri;

		@NotBlank
		String code;

		public Payload(@JsonProperty("cliendId") String cliendId,
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
