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

Route::get('/', 'HomeController@index');

Route::get('api/me', 'UserController@getUser');
Route::put('api/me', 'UserController@updateProfile');

Route::post('auth/login', 'AuthController@login');
Route::post('auth/signup', 'AuthController@signup');

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
  return $provider.' content goes here.';
});
