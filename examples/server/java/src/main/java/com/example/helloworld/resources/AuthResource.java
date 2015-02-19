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
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.NotBlank;

import com.example.helloworld.HelloWorldConfiguration.ClientSecretsConfiguration;
import com.example.helloworld.auth.AuthUtils;
import com.example.helloworld.auth.PasswordService;
import com.example.helloworld.core.Token;
import com.example.helloworld.core.User;
import com.example.helloworld.core.User.Provider;
import com.example.helloworld.db.UserDAO;
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

	public static final String CLIENT_ID_KEY = "client_id", REDIRECT_URI_KEY = "redirect_uri",
			CLIENT_SECRET = "client_secret", CODE_KEY = "code",
			GRANT_TYPE_KEY = "grant_type",
			AUTH_CODE = "authorization_code";

	public static final String CONFLICT_MSG = "There is already a %s account that belongs to you",
			NOT_FOUND_MSG = "User not found",
			LOGING_ERROR_MSG = "Wrong email and/or password",
			UNLINK_ERROR_MSG = "Could not unlink %s account because it is your only sign-in method";

	public static final ObjectMapper MAPPER = new ObjectMapper();

	public AuthResource(Client client, UserDAO dao, ClientSecretsConfiguration secrets) {
		this.client = client;
		this.dao = dao;
		this.secrets = secrets;
	}

	@POST
	@Path("login")
	@UnitOfWork
	public Response login(@Valid User user, @Context HttpServletRequest request)
			throws JOSEException {
		Optional<User> foundUser = dao.findByEmail(user.getEmail());
		if (foundUser.isPresent()
				&& PasswordService.checkPassword(user.getPassword(), foundUser.get().getPassword())) {
			Token token = AuthUtils.createToken(request.getRemoteHost(), foundUser.get().getId());
			return Response.ok().entity(token).build();
		}
		return Response.status(Status.UNAUTHORIZED).entity(new ErrorMessage(LOGING_ERROR_MSG))
				.build();
	}

	@POST
	@Path("signup")
	@UnitOfWork
	public Response signup(@Valid User user, @Context HttpServletRequest request) throws JOSEException {
		user.setPassword(PasswordService.hashPassword(user.getPassword()));
		User savedUser = dao.save(user);
		Token token = AuthUtils.createToken(request.getRemoteHost(), savedUser.getId());
		return Response.status(Status.CREATED).entity(token).build();
	}

	@POST
	@Path("facebook")
	@UnitOfWork
	public Response loginFacebook(@Valid Payload payload, @Context HttpServletRequest request)
			throws JsonParseException, JsonMappingException, ClientHandlerException,
			UniformInterfaceException, IOException, ParseException, JOSEException {
		String accessTokenUrl = "https://graph.facebook.com/oauth/access_token";
		String graphApiUrl = "https://graph.facebook.com/me";
		ClientResponse response;

		// Step 1. Exchange authorization code for access token.
		MultivaluedMap<String, String> accessData = new MultivaluedMapImpl();
		accessData.add(CLIENT_ID_KEY, payload.getClientId());
		accessData.add(REDIRECT_URI_KEY, payload.getRedirectUri());
		accessData.add(CLIENT_SECRET, secrets.getFacebook());
		accessData.add(CODE_KEY, payload.getCode());
		response = client.resource(accessTokenUrl).queryParams(accessData)
				.get(ClientResponse.class);

		String paramStr = Preconditions.checkNotNull(response.getEntity(String.class));
		// first param is token, second is expire
		String[] params = paramStr.split("&");
		String[] tokenPair = params[0].split("=");
		String[] expirePair = params[1].split("=");
		MultivaluedMap<String, String> accessParams = new MultivaluedMapImpl();
		accessParams.add(tokenPair[0], tokenPair[1]);
		accessParams.add(expirePair[0], expirePair[1]);

		// Step 2. Retrieve profile information about the current user.
		response = client.resource(graphApiUrl).queryParams(accessParams).get(ClientResponse.class);
		Map<String, Object> userInfo = getResponseEntity(response);

		// Step 3. Process the authenticated the user.
		return processUser(request, Provider.FACEBOOK, userInfo.get("id").toString(),
				userInfo.get("name").toString());
	}

	@POST
	@Path("google")
	@UnitOfWork
	public Response loginGoogle(@Valid Payload payload, @Context HttpServletRequest request)
			throws JOSEException, ParseException, JsonParseException, JsonMappingException,
			ClientHandlerException, UniformInterfaceException, IOException {
		String accessTokenUrl = "https://accounts.google.com/o/oauth2/token";
		String peopleApiUrl = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";
		ClientResponse response;

		// Step 1. Exchange authorization code for access token.
		MultivaluedMap<String, String> accessData = new MultivaluedMapImpl();
		accessData.add(CLIENT_ID_KEY, payload.getClientId());
		accessData.add(REDIRECT_URI_KEY, payload.getRedirectUri());
		accessData.add(CLIENT_SECRET, secrets.getGoogle());
		accessData.add(CODE_KEY, payload.getCode());
		accessData.add(GRANT_TYPE_KEY, AUTH_CODE);
		response = client.resource(accessTokenUrl).entity(accessData).post(ClientResponse.class);
		accessData.clear();

		// Step 2. Retrieve profile information about the current user.
		String accessToken = (String) getResponseEntity(response).get("access_token");
		response = client.resource(peopleApiUrl)
				.header(AuthUtils.AUTH_HEADER_KEY, String.format("Bearer %s", accessToken))
				.get(ClientResponse.class);
		Map<String, Object> userInfo = getResponseEntity(response);

		// Step 3. Process the authenticated the user.
		return processUser(request, Provider.GOOGLE, userInfo.get("sub").toString(),
				userInfo.get("name").toString());
	}

	@POST
	@Path("linkedin")
	@UnitOfWork
	public Response loginLinkedin() {
		return Response.ok().build();
	}

	@POST
	@Path("github")
	@UnitOfWork
	public Response loginGithub() {
		return Response.ok().build();
	}

	@POST
	@Path("foursquare")
	@UnitOfWork
	public Response loginFoursquare() {
		return Response.ok().build();
	}

	@GET
	@Path("twitter")
	@UnitOfWork
	public Response loginTwitter() {
		return Response.ok().build();
	}

	@GET
	@Path("unlink/{provider}")
	@UnitOfWork
	public Response unlink(@PathParam("provider") String provider,
			@Context HttpServletRequest request) throws ParseException, IllegalArgumentException,
			IllegalAccessException, NoSuchFieldException, SecurityException, JOSEException {
		String subject = AuthUtils.getSubject(request.getHeader(AuthUtils.AUTH_HEADER_KEY));
		Optional<User> foundUser = dao.findById(Long.parseLong(subject));

		if (!foundUser.isPresent()) {
			return Response.status(Status.NOT_FOUND).entity(new ErrorMessage(NOT_FOUND_MSG))
					.build();
		}

		User userToUnlink = foundUser.get();

		// check that the user is not trying to unlink the only sign-in method
		if (userToUnlink.getSignInMethodCount() == 1) {
			return Response.status(Status.BAD_REQUEST)
					.entity(new ErrorMessage(String.format(UNLINK_ERROR_MSG, provider))).build();
		}

		try {
			userToUnlink.setProviderId(Provider.valueOf(provider.toUpperCase()), null);
		} catch (IllegalArgumentException e) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		dao.save(userToUnlink);

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

	/*
	 * Helper methods
	 */
	private Map<String, Object> getResponseEntity(ClientResponse response)
			throws JsonParseException, JsonMappingException, ClientHandlerException,
			UniformInterfaceException, IOException {
		return MAPPER.readValue(response.getEntity(String.class),
				new TypeReference<Map<String, Object>>() {});
	}

	private Response processUser(HttpServletRequest request, Provider provider, String id,
			String displayName) throws JOSEException, ParseException {
		Optional<User> user = dao.findByProvider(provider, id);

		// Step 3a. If user is already signed in then link accounts.
		User userToSave;
		String authHeader = request.getHeader(AuthUtils.AUTH_HEADER_KEY);
		if (StringUtils.isNotBlank(authHeader)) {
			if (user.isPresent()) {
				return Response
						.status(Status.CONFLICT)
						.entity(new ErrorMessage(String.format(CONFLICT_MSG, provider.capitalize())))
						.build();
			}

			String subject = AuthUtils.getSubject(authHeader);
			Optional<User> foundUser = dao.findById(Long.parseLong(subject));
			if (!foundUser.isPresent()) {
				return Response.status(Status.NOT_FOUND).entity(new ErrorMessage(NOT_FOUND_MSG))
						.build();
			}

			userToSave = foundUser.get();
			userToSave.setProviderId(provider, id);
			if (userToSave.getDisplayName() == null) {
				userToSave.setDisplayName(displayName);
			}
			userToSave = dao.save(userToSave);
		} else {
			// Step 3b. Create a new user account or return an existing one.
			if (user.isPresent()) {
				userToSave = user.get();
			} else {
				userToSave = new User();
				userToSave.setProviderId(provider, id);
				userToSave.setDisplayName(displayName);
				userToSave = dao.save(userToSave);
			}
		}

		Token token = AuthUtils.createToken(request.getRemoteHost(), userToSave.getId());
		return Response.ok().entity(token).build();
	}
}
