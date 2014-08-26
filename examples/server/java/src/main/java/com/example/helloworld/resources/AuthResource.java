package com.example.helloworld.resources;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
	
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
	public Response loginFacebook(@Context HttpServletRequest request) {
		//request.getHeader(arg0)
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
	
	@GET
	@Path("twitter")
	public Response loginTwitter() {
		return Response.ok().build();
	}
	
	@POST
	@Path("foursquare")
	public Response loginFoursquare() {
		return Response.ok().build();
	}
	
	@GET
	@Path("unlink/{provider}")
	public Response unlink() {
		return Response.ok().build();
	}

}
