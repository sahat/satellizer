package com.example.helloworld.util;

import java.text.ParseException;

import org.joda.time.DateTime;

import com.example.helloworld.core.Token;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.ReadOnlyJWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

public final class AuthUtils {
	
	public static final JWSHeader JWT_HEADER = new JWSHeader(JWSAlgorithm.HS256);
	public static final String AUTH_HEADER_KEY = "Authorization";
	
	public static String getSerializedToken(String authHeader) {
		return authHeader.split(" ")[1];
	}
	
	public static String getSubject(String authHeader) throws ParseException {
		return decodeToken(authHeader).getSubject();
	}
	
	public static ReadOnlyJWTClaimsSet decodeToken(String authHeader) throws ParseException {
		return SignedJWT.parse(getSerializedToken(authHeader)).getJWTClaimsSet();
	}
	
	public static Token createToken(String host, long sub, String clientSecret) throws JOSEException {
		JWTClaimsSet claim = new JWTClaimsSet();
		claim.setSubject(Long.toString(sub));
		claim.setIssuer(host);
		claim.setIssueTime(DateTime.now().toDate());
		claim.setExpirationTime(DateTime.now().plusDays(14).toDate());
		
		JWSSigner signer = new MACSigner(clientSecret);
		SignedJWT jwt = new SignedJWT(JWT_HEADER, claim);
		jwt.sign(signer);
		
		return new Token(jwt.serialize());
	}
}
