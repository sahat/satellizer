<?php

class UserController extends BaseController {

	public $restful = true;

	public function index() {
		return User::all();
	}
	
	public function store() {

		$input = Input::all();
		$user = '';

		$validator = Validator::make( $input, User::getCreateRules() );

		if ( $validator->passes() ) {

			$user = new User();
			$user->email 				= Input::has('email')? $input['email'] : '';
			$user->firstname 			= Input::has('firstname')? $input['firstname'] : '';
			$user->lastname 			= Input::has('lastname')? $input['lastname'] : '';
			$user->password 			= Hash::make( $input['password'] );

			if ( !$user->save() )
				$user = ApiResponse::errorInternal('An error occured. Please, try again.');

		}
		else {
			return ApiResponse::validation($validator);
		}
		Log::info('<!> Created : '.$user);

		return ApiResponse::json($user);
	}

	public function authenticate() {

		$input = Input::all();
		$validator = Validator::make( $input, User::getAuthRules() );

		if ( $validator->passes() ){

			$user = User::where('email', '=', $input['email'])->first();
			if ( !($user instanceof User) ) {
				return ApiResponse::json("User is not registered.");
			}
			
			if ( Hash::check( $input['password'] , $user->password) ) {

				$device_id = Input::has('device_id')? $input['device_id'] : '';
				$device_type = Input::has('device_type')? $input['device_type'] : '';
				$device_token = Input::has('device_token')? $input['device_token'] : '';

				$token = $user->login( $device_id, $device_type, $device_token );

				Log::info('<!> Device Token Received : '. $device_token .' - Device ID Received : '. $device_id .' for user id: '.$token->user_id);
				Log::info('<!> Logged : '.$token->user_id.' on '.$token->device_os.'['.$token->device_id.'] with token '.$token->key);
				
				$token->user = $user->toArray();
				$token = ApiResponse::json($token, '202');
			}
			else $token = ApiResponse::json("Incorrect password.", '412');
			
			return $token;
		}
		else {
			return ApiResponse::validation($validator);
		}
	}

	public function authenticateFacebook() {

		$input = Input::all();
		$validator = Validator::make( $input, User::getAuthFBRules() );

		if ( $validator->passes() ){

			$facebook = new FacebookWrapper();
			$facebook->loginAsUser( $input['access_token'] );

			$profile = $facebook->getMe();

			if ( is_array($profile) && isset($profile['error']) )
				return json_encode($profile);

			Log::info( json_encode( $profile->asArray() ) );

			$user = User::where('facebook.id', '=', $profile->getId() )->first();
			
			if ( !($user instanceof User) )
				$user = User::where('email', '=', $profile->getProperty('email') )->first();

			if ( !($user instanceof User) ){
				// Create an account if none is found
				$user = new User();
				$user->firstname = $profile->getFirstName();
				$user->lastname = $profile->getLastName();
				$user->email = $profile->getProperty('email');
				$user->password = Hash::make( uniqid() );
			}
				
			$user->facebook = array('id'	=>	$profile->getId() );
			$user->save();

			$device_id = Input::has('device_id')? $input['device_id'] : '';
			$device_type = Input::has('device_type')? $input['device_type'] : '';
			$device_token = Input::has('device_token')? $input['device_token'] : '';

			$token = $user->login( $device_id, $device_type, $device_token );
			
			Log::info('<!> Device Token Received : '. $device_token .' - Device ID Received : '. $device_id .' for user id: '.$token->user_id);
			Log::info('<!> FACEBOOK Logged : '.$token->user_id.' on '.$token->device_os.'['.$token->device_id.'] with token '.$token->token);

			$token = $token->toArray();
			$token['user'] = $user->toArray();

			Log::info( json_encode($token) );
			
			return ApiResponse::json($token);
		}
		else {
			return ApiResponse::validation($validator);
		}
	}

	public function logout( $user ) {

		if ( !Input::has('token') ) return ApiResponse::json('No token given.');

		$input_token = Input::get('token');
		$token = Token::where('key', '=', $input_token)->first();

		if ( empty($token) ) return ApiResponse::json('No active session found.');

		if ( $token->user_id !== $user->id ) return ApiResponse::errorForbidden('You do not own this token.');

		if ( $token->delete() ){
			Log::info('<!> Logged out from : '.$input_token );
			return ApiResponse::json('User logged out successfully.', '202');
		}	
		else
			return ApiResponse::errorInternal('User could not log out. Please try again.');

	}

	public function sessions() {

		if ( !Input::has('token') ) return ApiResponse::json('No token given.');

		$user = Token::userFor ( Input::get('token') );

		if ( empty($user) ) return ApiResponse::json('User not found.');

		$user->sessions;

		return ApiResponse::json( $user );
	}

	public function forgot() {
		$input = Input::all();
		$validator = Validator::make( $input, User::getForgotRules() );

		if ( $validator->passes() ) {

			$user = User::where('email', '=', $input['email'])->first();
			// $reset = $user->generatePassResetKey();

			// $sent = TriggerEmail::send( 'lost_password', $user, $reset );
			$sent = false;

			if ( $sent )
				return ApiResponse::json('Email sent successfully.');
			else
				return ApiResponse::json('An error has occured, the Email was not sent.');
		}
		else {
			return ApiResponse::validation($validator);
		}
	}

	public function resetPassword() {
		$input = Input::all();
		$validator = Validator::make( $input, User::getResetPassRules() );

		if ( $validator->passes() ) {
			$reset = ResetKeys::where('key', $input['key'])->first();
			if ( !($reset instanceof ResetKeys) )
				return ApiResponse::errorUnauthorized("Invalid reset key.");

			$user = $reset->user;

			$user->password = Hash::make($input['password']);
			$user->save();

			$reset->delete();

			return ApiResponse::json($user);
		}
		else {
			return ApiResponse::validation($validator);
		}
	}

	public function show($user) {
		$user->sessions;
		// Log::info('<!> Showing : '.$user );
		return $user;
	}

	public function missingMethod( $parameters = array() )
	{
	    return ApiResponse::errorNotFound('Sorry, no method found');
	}

}