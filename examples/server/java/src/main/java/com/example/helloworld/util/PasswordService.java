package com.example.helloworld.util;

import org.mindrot.jbcrypt.BCrypt;

public final class PasswordService {
	public String hashPassword(String plaintext) {
		return BCrypt.hashpw(plaintext, BCrypt.gensalt());
	}
	
	public boolean checkPassword(String plaintext , String hashed) {
		return BCrypt.checkpw(plaintext, hashed);
	}
}
