package com.example.helloworld.core;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.Email;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@NamedQueries({
    @NamedQuery(name = "User.findAll", query = "SELECT u FROM User u"),
    @NamedQuery(name = "User.findByEmail", query = "SELECT u FROM User u WHERE u.email = :email"),
    @NamedQuery(name = "User.findByFacebook",
        query = "SELECT u FROM User u WHERE u.facebook = :facebook"),
    @NamedQuery(name = "User.findByGoogle", query = "SELECT u FROM User u WHERE u.google = :google"),
    @NamedQuery(name = "User.findByGithub", query = "SELECT u FROM User u WHERE u.github = :github"),
    @NamedQuery(name = "User.findByLinkedin",
        query = "SELECT u FROM User u WHERE u.linkedin = :linkedin"),
    @NamedQuery(name = "User.findByFoursquare",
        query = "SELECT u FROM User u WHERE u.foursquare = :foursquare"),
    @NamedQuery(name = "User.findByTwitter",
        query = "SELECT u FROM User u WHERE u.twitter = :twitter")})
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

  public enum Provider {
    FACEBOOK("facebook"), GOOGLE("google"), LINKEDIN("linkedin"), GITHUB("github"), FOURSQUARE(
        "foursquare"), TWITTER("twitter");

    String name;

    Provider(final String name) {
      this.name = name;
    }

    public String getName() {
      return this.name;
    }

    public String capitalize() {
      return StringUtils.capitalize(this.name);
    }
  }

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

  public void setEmail(final String email) {
    this.email = email;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  public void setDisplayName(final String name) {
    this.displayName = name;
  }

  public void setProviderId(final Provider provider, final String value) {
    switch (provider) {
      case FACEBOOK:
        this.facebook = value;
        break;
      case GOOGLE:
        this.google = value;
        break;
      case LINKEDIN:
        this.linkedin = value;
        break;
      case GITHUB:
        this.github = value;
        break;
      case FOURSQUARE:
        this.facebook = value;
        break;
      case TWITTER:
        this.twitter = value;
        break;
      default:
        throw new IllegalArgumentException();
    }
  }

  @JsonIgnore
  public int getSignInMethodCount() throws IllegalArgumentException, IllegalAccessException,
      NoSuchFieldException, SecurityException {
    int count = 0;

    if (this.getPassword() != null) {
      count++;
    }

    for (final Provider p : Provider.values()) {
      if (this.getClass().getDeclaredField(p.name).get(this) != null) {
        count++;
      }
    }

    return count;
  }

}
