<?php

class AuthController extends BaseController {

    public function login()
    {
        return 'Not implemented';
    }

	public function signup()
	{
        $user = new User;
        $user->display_name = Input::get('displayName');
        $user->email = Input::get('email');
        $user->password = Input::get('password');
        $user->save();

        return Response::make(200);
	}

}
