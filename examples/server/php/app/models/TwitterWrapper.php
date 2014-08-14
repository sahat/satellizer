<?php

require_once( "../vendor/abraham/twitteroauth/twitteroauth/twitteroauth.php" );

class TwitterWrapper extends TwitterOAuth {


	public function __construct($oauth_token = NULL, $oauth_token_secret = NULL){

		// Set the Consumer Key
		$key = Config::get('social.twitter.app_id');

		// Set the Consumer Secret
		$secret = Config::get('social.twitter.app_secret');

		$oauth_token = Config::get('social.twitter.access_token');
		$oauth_token_secret = Config::get('social.twitter.access_token_secret');

		// Log::info('app key '.$key);
		// Log::info('app secret '.$secret);
		// Log::info('client token '.$oauth_token);
		// Log::info('client token secret '.$oauth_token_secret);
		
		parent::__construct($key, $secret, $oauth_token, $oauth_token_secret);
	}


	public function getConsumer() {
		return $this->consumer;
	}

	public function getToken() {
		return $this->token;
	}

	public function getProfileURL( $screen_name ) {
		return 'https://twitter.com/' . $screen_name;
	}

	public function showUserById( $user_id, $include_entities = false ) {
		$params['user_id'] = $user_id;
		$params['include_entities'] = $include_entities;
		return $this->get('users/show', $params);
	}

	public function showUserByName( $screen_name, $include_entities = false ) {
		$params['screen_name'] = $screen_name;
		$params['include_entities'] = $include_entities;
		return $this->get('users/show', $params);
	}

	public function getSettings($params = array()) {
		return $this->get('account/settings', $params);
	}

	public function verifyCredentials( $skip_status = true, $include_entities = false ) {
		$params['skip_status'] = $skip_status;
		$params['include_entities'] = $include_entities;
		$response = $this->get('account/verify_credentials', $params);

		if ( isset($response->errors) && is_array($response->errors) ){
			$errors = $response->errors[0]->message;
	    	return array('error' => $errors );
		}

	    if ( empty($response) )
	    	return array('error' => 'User profile was not found');

	    if ( isset($response->error) )
	    	return array('error' => $response->error);

	    return $response;
	}

	public function testURL( $url, $params = array() ) {
		$array = array(
			'url'			=>	$url,
			'response'		=>	$this->get($url, $params),
			'http_code'		=>	$this->http_code,
		);
		return json_encode($array);
	}

}