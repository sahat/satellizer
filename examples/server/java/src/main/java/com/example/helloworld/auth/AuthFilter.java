package com.example.helloworld.util;

import java.io.IOException;
import java.text.ParseException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import com.nimbusds.jwt.JWTClaimsSet;

public class AuthFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;
		String authHeader = httpRequest.getHeader(AuthUtils.AUTH_HEADER_KEY);
		
		if (StringUtils.isBlank(authHeader) || authHeader.split(" ").length != 2) {
			httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
		} else {
			JWTClaimsSet claimSet = null;
			try {
				claimSet = (JWTClaimsSet) AuthUtils.decodeToken(authHeader);
			} catch (ParseException e) {
				httpResponse.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unable to parse JWT");
			}
			// ensure that the token is not expired
			if (new DateTime(claimSet.getExpirationTime()).isBefore(DateTime.now())) {
				httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			} else {
				chain.doFilter(request, response);
			}
		}	
	}

    @Override
    public void destroy() { /* unused */ }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException { /* unused */ }

}
