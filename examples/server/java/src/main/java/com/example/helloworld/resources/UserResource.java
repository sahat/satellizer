package com.example.helloworld.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/me")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MeResource {
	
	@GET
	public Response getUser() {
		return Response.ok().build();
	}
	
	@PUT
	public Response updateUser() {
		return Response.ok().build();
	}

}
