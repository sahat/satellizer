describe('Email and password flow', function() {
  beforeEach(module('Satellizer'));

  it('should have a login function', inject(function(Local) {
    expect(angular.isFunction(Local.login)).toBe(true);
  }));

  it('should return a user object on successful login', inject(function($httpBackend, Local) {
    var result = null;
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTU3ZDZiY2MzNmMxNTgwNzU4NDJkZCIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJfX3YiOjB9LCJpYXQiOjE0MDc1NDg3ODI5NzMsImV4cCI6MTQwODE1MzU4Mjk3M30.1Ak6mij5kfkSi6d_wtPOx4yK7pS7ZFSiwbkL7AJbnYs';
    var user = {
      email: 'foo@bar.com',
      password: '1234'
    };

    $httpBackend.expectPOST('/auth/login').respond({ token: token });

    Local.login(user).then(function(response) {
      result = response;
    });

    $httpBackend.flush();

    expect(result).toEqual({
      _id: '53e57d6bcc36c158075842dd',
      email: 'foo@bar.com',
      __v: 0
    });
  }));

  it('should fail login with incorrect credentials', inject(function($httpBackend, Local) {
    var result = null;
    var user = {
      email: 'foo@bar.com',
      password: 'invalid'
    };

    $httpBackend.expectPOST('/auth/login').respond(401, 'Wrong email or password');

    Local.login(user).catch(function(response) {
      result = response.data;
    });

    $httpBackend.flush();

    expect(result).toEqual('Wrong email or password');
  }));

  it('should have a logout function', inject(function(Local) {
    expect(Local.logout).toBeDefined();
    expect(angular.isFunction(Local.logout)).toBe(true);
  }));

  it('should log out a user', inject(function($window, $location, Local) {
    Local.logout();
    expect($window.localStorage.jwtToken).toBeUndefined();
    expect($location.path()).toEqual('/');
  }));

  it('should have a signup function', inject(function($window, Local) {
    expect(Local.signup).toBeDefined();
    expect(angular.isFunction(Local.signup)).toBe(true);
  }));

  it('should create a new user', inject(function($httpBackend, $location, Local) {
    var user = {
      email: 'john@email.com',
      password: '1234'
    };

    $httpBackend.expectPOST('/auth/signup').respond(200);

    Local.signup(user);

    $httpBackend.flush();

    expect($location.path()).toEqual('/login');
  }));

  it('should have a isAuthenticated function', inject(function(Local) {
    expect(Local.isAuthenticated).toBeDefined();
    expect(angular.isFunction(Local.isAuthenticated)).toBe(true);
  }));
});

