describe('Local', function() {
  var $auth, $httpBackend, Local, $location, $window;

  beforeEach(module('Satellizer'));

  beforeEach(inject(function(_$auth_, _$httpBackend_, _Local_, _$location_, _$window_) {
    $auth = _$auth_;
    $httpBackend = _$httpBackend_;
    Local = _Local_;
    $location = _$location_;
    $window = _$window_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have a login function', function() {
    expect(angular.isFunction(Local.login)).toBe(true);
  });

  it('should return a user object on successful login', function() {
    var result = null;
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXQ_QG1lLmNvbSIsIl9fdiI6MH0sImlhdCI6MTQwODgyMTA5MTY3NiwiZXhwIjoxNDA5NDI1ODkxNjc2fQ.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';
    var user = {

      email: 'sahat?@me.com',
      password: '1234'
    };

    $httpBackend.expectPOST('/auth/login').respond({ token: token });

    Local.login(user).then(function(response) {
      result = response;
    });

    $httpBackend.flush();

    expect(Local.isAuthenticated()).toBe(true);
    expect(result).toEqual({
      _id: '53f61e106fc61a6c13b5278d',
      email: user.email,
      __v: 0
    });
  });

  it('should fail login with incorrect credentials', function() {
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
  });

  it('should have a logout function', function() {
    expect(Local.logout).toBeDefined();
    expect(angular.isFunction(Local.logout)).toBe(true);
  });

  it('should log out a user', function() {
    Local.logout();
    expect($window.localStorage.jwtToken).toBeUndefined();
    expect($location.path()).toEqual('/');
  });

  it('should have a signup function', function() {
    expect(Local.signup).toBeDefined();
    expect(angular.isFunction(Local.signup)).toBe(true);
  });

  it('should unlink a provider successfully', function() {
    var result = null;
    var provider = 'google';
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZjYxZTEwNmZjNjFhNmMxM2I1Mjc4ZCIsImVtYWlsIjoic2FoYXRAbWUuY29tIiwiX192IjowfSwiaWF0IjoxNDA4ODIxMDkxNjc2LCJleHAiOjE0MDk0MjU4OTE2NzZ9.0l-ql-ZVjHiILMcMegNb3bNqapt3TZwjHy_ieduioiQ';

    $httpBackend.expectGET('/auth/unlink/google').respond(200, { token: token });

    Local.unlink(provider).then(function(response) {
      result = response;
    });

    $httpBackend.flush();

    expect(Local.unlink).toBeDefined();
  });

  it('should unlink a provider and get an error', function() {
    var result = null;
    var provider = 'google';

    $httpBackend.expectGET('/auth/unlink/google').respond(400);

    Local.unlink(provider).catch(function(response) {
      result = response;
    });

    $httpBackend.flush();

    expect(result.status).toEqual(400);
  });

  it('should create a new user', function() {
    var user = {
      email: 'john@email.com',
      password: '1234'
    };

    $httpBackend.expectPOST('/auth/signup').respond(200);

    Local.signup(user);

    $httpBackend.flush();

    expect($location.path()).toEqual('/login');
  });

  it('should have a isAuthenticated function', function() {
    expect(Local.isAuthenticated).toBeDefined();
    expect(angular.isFunction(Local.isAuthenticated)).toBe(true);
  });
});

