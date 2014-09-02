package com.example.helloworld.db;

import java.util.List;

import io.dropwizard.hibernate.AbstractDAO;

import org.hibernate.SessionFactory;

import com.example.helloworld.core.User;
import com.example.helloworld.core.User.Provider;
import com.google.common.base.Optional;

public class UserDAO extends AbstractDAO<User> {
    public UserDAO(SessionFactory factory) {
        super(factory);
    }

    public Optional<User> findById(Long id) {
        return Optional.fromNullable(get(id));
    }
    
    public Optional<User> findByEmail(String email) {
    	User foundUser = (User) namedQuery("User.findByEmail")
				.setParameter("email", email)
				.uniqueResult();
    	return Optional.fromNullable(foundUser);
    }
    
    public Optional<User> findByProvider(Provider provider, String providerId) {
    	User foundUser = (User) namedQuery(String.format("User.findBy%s", provider.capitalize()))
    							.setParameter(provider.getName(), providerId)
    							.uniqueResult();
    	return Optional.fromNullable(foundUser);
    }

    public User save(User user) {
        return persist(user);
    }

    public List<User> findAll() {
        return list(namedQuery("User.findAll"));
    }

}
