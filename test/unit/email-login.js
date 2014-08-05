describe('Local sign-in via email', function() {
  beforeEach(module('ngAuth'));

//  afterEach(function() {
//    $httpBackend.verifyNoOutstandingExpectation();
//    $httpBackend.verifyNoOutstandingRequest();
//  });

  it('should have a login function', inject(function($auth) {
    expect(angular.isFunction($auth.login)).toBe(true);
  }));

  it('should throw an error without params', inject(function($auth) {
    var login = function() {
      $auth.login();
    };
    expect(login).toThrow();
  }));

  it('should return a current user', inject(function($httpBackend, $auth) {
    var result;
    $httpBackend.expectPOST('/auth/login').respond({
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjUzZTEzYjIxMzczNjA2NjgwMjhjOWU3OCIsImVtYWlsIjoic2FoYXRAbWUuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQVZTVFZmS3kyZDFFeUFnYWFYVTlydUdKTlplUUNjS1RzREJOL1lGUWFVNEpVb0VDdEtULnUiLCJfX3YiOjB9LCJpYXQiOjE0MDcyNzAyNDQ5MDEsImV4cCI6MTQwNzg3NTA0NDkwMn0.hjVTwHh1xjzq5BhLA1bw1iI_STQwhDLFxqyDxZ8mnaY'
    });

    $auth.login({ email: 'foo@bar.com', password: '1234' }).then(function(response) {
      result = response;
    });

    $httpBackend.flush();

    expect(angular.isObject(result)).toBe(true);
    expect(result).toEqual({
      _id: '53e13b2137360668028c9e78',
      email: 'sahat@me.com',
      password: '$2a$10$AVSTVfKy2d1EyAgaaXU9ruGJNZeQCcKTsDBN/YFQaU4JUoECtKT.u',
      __v: 0
    });
  }));


});

