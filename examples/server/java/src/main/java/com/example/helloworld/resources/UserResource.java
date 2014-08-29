package com.example.helloworld.resources;

import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.errors.ErrorMessage;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.example.helloworld.core.User;
import com.example.helloworld.db.UserDAO;
import com.example.helloworld.util.AuthUtils;
import com.google.common.base.Optional;
import com.nimbusds.jwt.SignedJWT;

@Path("/api/me")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {
	
	private final UserDAO dao;
	
	public UserResource(UserDAO userDAO) {
		this.dao = userDAO;
	}

	@GET
	@UnitOfWork
	public Response getUser(@Context HttpServletRequest request) throws ParseException {
		String[] auth = request.getHeader("Authorization").split(" ");
		if (auth.length != 2 || !auth[0].equals("Bearer")) {
			return Response.status(Status.UNAUTHORIZED).build();
		}
		
		String subject = SignedJWT.parse(auth[1]).getJWTClaimsSet().getSubject();
		Optional<User> foundUser = dao.findById(Long.parseLong(subject));
		if (!foundUser.isPresent()) {
			return Response.status(Status.NOT_FOUND).build();
		}
		return Response.ok().entity(foundUser.get()).build();
	}
	
	// for testing
	@GET
	@Path("/all")
	@UnitOfWork
	public Response getAllUsers() {
		return Response.ok().entity(dao.findAll()).build();
	}

	@PUT
	@UnitOfWork
	public Response updateUser(@Valid User user, @Context HttpServletRequest request) throws ParseException {
		String authHeader = request.getHeader(AuthUtils.AUTH_HEADER_KEY);
		String subject = AuthUtils.getSubject(authHeader);
		Optional<User> foundUser = dao.findById(Long.parseLong(subject));
		
		if (!foundUser.isPresent()) {
			return Response
					.status(Status.NOT_FOUND)
					.entity(new ErrorMessage(AuthResource.NOT_FOUND_MSG)).build();
		}
		
		User userToUpdate = foundUser.get();
		userToUpdate.setDisplayName(user.getDisplayName());
		userToUpdate.setEmail(user.getEmail());
		dao.save(userToUpdate);
		
		return Response.ok().entity(AuthUtils.getToken(authHeader)).build();
	}

}
