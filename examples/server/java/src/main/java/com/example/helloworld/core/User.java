package com.example.helloworld.core;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.hibernate.validator.constraints.Email;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@NamedQueries({
		@NamedQuery(name = "User.findAll", query = "SELECT u FROM User u"),
		@NamedQuery(name = "User.findByEmail", query = "SELECT u FROM User u WHERE u.email = :email"),
		@NamedQuery(name = "User.findByFacebook", query = "SELECT u FROM User u WHERE u.facebook = :facebook") })
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Email
	@Column(name = "email", unique = true)
	private String email;

	@Column(name = "password")
	private String password;

	@Column(name = "display_name")
	private String displayName;

	@Column(name = "facebook")
	private String facebook;

	@Column(name = "google")
	private String google;

	@Column(name = "linkedin")
	private String linkedin;

	@Column(name = "github")
	private String github;

	@Column(name = "foursquare")
	private String foursquare;

	@Column(name = "twitter")
	private String twitter;
	
	public long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	@JsonIgnore
	public String getPassword() {
		return password;
	}

	public String getDisplayName() {
		return displayName;
	}

	public String getFacebook() {
		return facebook;
	}

	public String getGoogle() {
		return google;
	}

	public String getLinkedin() {
		return linkedin;
	}

	public String getGithub() {
		return github;
	}

	public String getFoursquare() {
		return foursquare;
	}

	public String getTwitter() {
		return twitter;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public void setDisplayName(String name) {
		this.displayName = name;
	}
	
	public void setFacebook(String facebook) {
		this.facebook = facebook;
	}
	
	public void setGoogle(String google) {
		this.google = google;
	}
	
	public void setLinkedin(String linkedin) {
		this.linkedin = linkedin;
	}
	
	public void setGithub(String github) {
		this.github = github;
	}
	
	public void setFouresquare(String foursquare) {
		this.foursquare = foursquare;
	}
	
	public void setTwitter(String twitter) {
		this.twitter = twitter;
	}
	
}
