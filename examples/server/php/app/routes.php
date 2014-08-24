<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
    return File::get(public_path().'/index.html');
});

Route::get('api/me', function()
{
	return 'Not implemented';
});

Route::put('api/me', function()
{
    $user = User::find();
    $user->display_name = Input::get('displayName', $user->display_name);
    $user->email = Input::get('email', $user->email);
    $user->save();

    $token = create_token($user);

    return Response::json(array('token' => $token));
});

Route::post('auth/login', function()
{
    return 'Not implemented';
});

Route::post('auth/signup', function()
{
    $user = new User;
    $user->display_name = Input::get('displayName');
    $user->email = Input::get('email');
    $user->password = Input::get('password');
    $user->save();

    return Response::make(200);
});

Route::post('auth/facebook', function()
{
	return 'Not implemented';
});

Route::post('auth/google', function()
{
	return 'Not implemented';
});

Route::post('auth/github', function()
{
	return 'Not implemented';
});

Route::post('auth/linkedin', function()
{
	return 'Not implemented';
});

Route::post('auth/foursquare', function()
{
	return 'Not implemented';
});

Route::get('auth/twitter', function()
{
	return 'Not implemented';
});

Route::get('auth/unlink/{provider}', function($provider)
{
  return $provider.' conteent goes here.';
});
