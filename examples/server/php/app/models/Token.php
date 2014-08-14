<?php

use Jenssegers\Mongodb\Model as Eloquent;

class Token extends Eloquent {

	protected $collection = 'tokens';

    protected $guarded = array('key');

	public static function getInstance() {
        $token = new Token();
		do {
			 $key = openssl_random_pseudo_bytes ( 30 , $strongEnough );
		} while( !$strongEnough );
        $token->key = base64_encode($key);

        return $token;
    }

    public static function userFor($token) {
    	$token = Token::where('key', '=', $token)->first();
    	if ( empty($token) ) return null;

    	return User::find($token->user_id);
    }

    public static function isUserToken( $user_id, $token ) {
    	return Token::where('user_id', '=', $user_id)
        			->where('key', '=', $token)
        			->exists();
    }


}