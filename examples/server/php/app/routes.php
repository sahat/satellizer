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
    return View::make('hello');
});

Route::get('api/me', function()
{
	return 'Not implemented';
});

Route::put('api/me', function()
{
  return 'Not implemented';
});

Route::post('auth/login', function()
{
  return 'Not implemented';
});

Route::post('auth/signup', function()
{
  return 'Not implemented';
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
