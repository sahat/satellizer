package com.example.helloworld.resources;

import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.example.helloworld.core.User;
import com.example.helloworld.db.UserDAO;

@Path("/me")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {
	
	private final UserDAO userDAO;
	
	public UserResource(UserDAO userDAO) {
		this.userDAO = userDAO;
	}

	@GET
	@UnitOfWork
	public Response getUser(User user) {
		return Response.ok().entity(user).build();
	}

	@PUT
	@UnitOfWork
	public Response updateUser(User user) {
		userDAO.save(user);
		return Response.ok().build();
	}

}
