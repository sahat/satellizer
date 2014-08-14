<?php

/**
 *	@see https://github.com/facebook/facebook/php-sdk-v4
 */

use Facebook\FacebookRequest;
use Facebook\FacebookSession;
use Facebook\GraphUser;

class FacebookWrapper {

	/**
	 *	The current facebook session
	 *	@var FacebookSession
	 */
	public $session = NULL;

	public function __construct() {
		FacebookSession::setDefaultApplication(
				Config::get('social.facebook.app_id'), 
				Config::get('social.facebook.app_secret')
			);
		FacebookSession::enableAppSecretProof( Config::get('social.facebook.app_secret_proof') );
	}

	public function loginAsUser( $access_token ) {
		$this->session = new FacebookSession( $access_token );
		return $this;
	}

	public function loginAsApp() {
		$this->session = FacebookSession::newAppSession();
		return $this;
	}

	public function loginAsSignedRequest( $signed_request ) {
		$this->session = FacebookSession::newSessionFromSignedRequest( $signed_request );
		return $this;
	}

	public function isLoggedIn() {
		$logged = false;
		if ( !empty( $this->session ) ){
			try {
				$this->session->validate();
				$logged = true;
			}
			catch (FacebookRequestException $ex) {
			  	// Session not valid, Graph API returned an exception with the reason.
			  	Log::warning( $ex->getMessage() );
			} catch (Exception $ex) {
			  	// Graph API returned info, but it may mismatch the current app or have expired.
			  	Log::warning( $ex->getMessage() );
			}
			return $logged;
		}
		else return $logged;
	}

	public function makeRequest( $http_method , $path, $params = NULL, $version = NULL ) {
		return new FacebookRequest( $this->session , $http_method, $path, $params, $version );
	}

	public function post($path, $classname, $params=NULL, $version = NULL) {
		$profile = null;
		try {
			$profile = $this->makeRequest('POST', $path, $params, $version )->execute()->getGraphObject( $classname );
		}
		catch(FacebookRequestException $ex) {
			Log::warning( "Facebook Request Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		catch (Exception $ex) {
			Log::warning( "Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		return $profile;
	}

	public function get($path, $classname, $params=NULL, $version = NULL) {
		$profile = null;
		try {
			$profile = $this->makeRequest('GET', $path, $params, $version)->execute()->getGraphObject( $classname );
		}
		catch(FacebookRequestException $ex) {
			Log::warning( "Facebook Request Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		catch (Exception $ex) {
			Log::warning( "Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		return $profile;
	}

	public function getMe( $params=NULL, $version = NULL ) {
		$profile = null;
		try {
			$profile = $this->makeRequest('GET', '/me', $params, $version)->execute()->getGraphObject( GraphUser::className() );
		}
		catch(FacebookRequestException $ex) {
			Log::warning( "Facebook Request Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		catch (Exception $ex) {
			Log::warning( "Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		return $profile;
	}

	public function getUserById( $uid, $params=NULL, $version = NULL ) {
		$profile = null;
		try {
			$profile = $this->makeRequest('GET', '/'.$uid, $params, $version)->execute()->getGraphObject( GraphUser::className() );
		}
		catch(FacebookRequestException $ex) {
			Log::warning( "Facebook Request Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		catch (Exception $ex) {
			Log::warning( "Exception occured, code: " . $ex->getCode() . " with message: " . $ex->getMessage() );
			$profile =  array('error' => $ex->getMessage() );
		}
		return $profile;
	}


}