<?php

class UserController extends \BaseController {

	public function getUser()
	{
        $token = explode(' ', Request::header('Authorization'))[1];
        $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
        $payload = json_decode(json_encode($payloadObject), true);

        $user = User::find($payload['sub']);

        return $user;
	}

	public function updateUser()
	{
        $token = explode(' ', Request::header('Authorization'))[1];
        $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
        $payload = json_decode(json_encode($payloadObject), true);

        $user = User::find($payload['sub']);
        $user->displayName = Input::get('displayName', $user->displayName);
        $user->email = Input::get('email', $user->email);
        $user->save();

        $token = $this->createToken($user);

        return Response::json(array('token' => $token));
	}
}
