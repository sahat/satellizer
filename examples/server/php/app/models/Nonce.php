<?php

/*
 * Based on:
 * https://core.trac.wordpress.org/browser/tags/3.8/src/wp-includes/pluggable.php#L0
 * http://fullthrottledevelopment.com/php-nonce-library
 */

class Nonce {
	
	protected static $NONCE_KEY = '_nonce';

	protected static $SALT = 'gu6Wd3m$)bAg6[j9gZb4d8g[cn{hnNjg6d9A';

	/* nonce life is in a range of 5 minutes (for duration set to 300), as 2 windows of 2m30s
	 * actual life expectancy between 4m59s and 2m31s
	 */
	protected static $DURATION = 300;

	private $unique_key;
	private $value;

	public function __construct( $user_id='', $action='' ){
		$this->duration = $duration;
		$this->unique_key = uniqid();
		$this->value = self::generateHash($user_id, $action, self::$DURATION);
	}

	public function getValue() {
		return $this->value;
	}

	public function getKey() {
		return $this->unique_key;
	}

	public function getQueryArgument() {
		return self::$NONCE_KEY . '=' . $this->value;
	}

	public static function isValid($nonce, $user_id, $action){
		// Nonce generated between 0 to ($DURATION/2) seconds ago 
		if ( self::generateHash( $user_id . $action ) == $nonce )
			return true;

		// Nonce generated between $DURATION to ($DURATION/2) seconds ago 
		if ( self::generateHashPreviousWindow( $user_id . $action ) == $nonce )
			return true;

		return false;
	}

	protected static function generateHash( $user_id='', $action='' ) {
		$nb = ceil( time() / ( self::$DURATION / 2 ) );
		return substr( md5( $nb . $action . $user_id . self::$SALT ), -12, 10);
	}

	protected static function generateHashPreviousWindow( $user_id='', $action='' ) {
		$nb = ceil( time() / ( self::$DURATION / 2 ) );
		return substr( md5( $nb-1 . $action . $user_id . self::$SALT ), -12, 10);
	}

}