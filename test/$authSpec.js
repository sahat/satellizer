describe('$auth provider', function() {
  beforeEach(module('Satellizer'));

  it('shouldbe able to call login', inject(function($auth, $httpBackend) {
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTU3ZDZiY2MzNmMxNTgwNzU4NDJkZCIsImVtYWlsIjoiZm9vQGJhci5jb20iLCJfX3YiOjB9LCJpYXQiOjE0MDc1NDg3ODI5NzMsImV4cCI6MTQwODE1MzU4Mjk3M30.1Ak6mij5kfkSi6d_wtPOx4yK7pS7ZFSiwbkL7AJbnYs';
    var user = {
      email: 'foo@bar.com',
      password: '1234'
    };

    $httpBackend.expectPOST('/auth/login').respond({ token: token });

    $auth.login(user);

    $httpBackend.flush();

    expect(angular.isFunction($auth.login)).toBe(true);
  }));

  it('should be able to handle login errors', inject(function($auth, $httpBackend) {
    var user = {
      email: 'foo@bar.com',
      password: '1234'
    };
    var rejected = false;

    $httpBackend.expectPOST('/auth/login').respond(404);

    $auth.login(user).then(angular.noop, function() {
      rejected = true;
    });

    $httpBackend.flush();

    expect(rejected).toBe(true);
  }));

  it('should be able to call signup', inject(function($auth, $httpBackend, $location) {
    var user = {
      email: 'foo@bar.com',
      password: '1234'
    };

    $httpBackend.expectPOST('/auth/signup').respond(200);

    $auth.signup(user);

    $httpBackend.flush();

    expect(angular.isFunction($auth.signup)).toBe(true);
    expect($location.path()).toEqual('/login');
  }));

  it('should be able to handle signup errors', inject(function(Local, $httpBackend) {
    var user = {
      email: 'foo@bar.com',
      password: '1234'
    };
    var rejected = false;

    $httpBackend.expectPOST('/auth/signup').respond(400);

    Local.signup(user).catch(function() {
      rejected = true;
    });

    $httpBackend.flush();

    expect(rejected).toBe(true);
  }));

  it('should log out a user', inject(function($window, $location, $auth) {
    $auth.logout();
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
    var isAuthed = Local.isAuthenticated();
    expect(Local.isAuthenticated).toBeDefined();
    expect(isAuthed).toBe(false);
  }));
});

