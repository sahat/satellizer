<?php

class UserController extends BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
        return Response::json(User::get());
    }


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function getUser()
	{
        return Response::json(array('success' => true));
	}


	public function updateProfile()
	{
        $user = User::get();
        $user->displayName = Input::get('displayName', $user->displayName);
        $user->email = Input::get('email', $user->email);
        $user->save();

        $token = create_token($user);

        return Response::json(array('token' => $token));
	}


}
