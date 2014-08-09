describe('Login with email and password', function() {
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

    $httpBackend.expectPOST('/auth/login').respond(token);

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
});

