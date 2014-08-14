<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;

use Jenssegers\Mongodb\Model as Eloquent;
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class User extends Eloquent implements UserInterface, RemindableInterface {

	use SoftDeletingTrait;

	/**
	 * The database collection used by the model.
	 *
	 * @var string
	 */
	protected $collection = 'users';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password');
	protected $dates = ['deleted_at'];

	protected static $createRules = array(
		'firstname'				=>	'required',
		'lastname'				=>	'required',
		'password'				=>	'required|min:6|confirmed',
		'password_confirmation'	=>	'required|min:6',
		'email'					=>	'required|email|unique:users,email',
	);
	protected static $authRules = array(
		'email'					=>	'required|email',
		'password'				=>	'required',
		// 'device_id'				=>	'required',
		// 'device_type'			=>	'required',
		// 'device_token'			=>	'required',
	);
	protected static $fb_authRules = array(
		'access_token'			=>	'required',
		// 'device_id'				=>	'required',
		// 'device_type'			=>	'required',
		// 'device_token'			=>	'required',
	);

	public static function getCreateRules() {		return self::$createRules; }
	public static function getAuthFBRules() {		return self::$fb_authRules; }
	public static function getAuthRules() {			return self::$authRules; }

	public function isOwnerOf($token) {
        $owner = Token::userFor( $token );
        if ( empty($owner) || $owner->user_id!=$this->id )
            return false;
        else
            return true;
    }

    public function sessions() {
    	return $this->hasMany('Token');
    }

	/**
	 * Generate a token to authenticate a user
	 *
	 * @return mixed
	 */
	public function login( $device_id=null, $device_type=null, $device_token=null ) {

    	// clear old sessions for any user with: same(device_id, os)
    	$to_remove = Token::where('device_id', '=', $device_id)
					->where('device_os', '=', $device_type)
					->delete();

		$token = Token::getInstance();
		$token->user_id	= $this->id;
		$token->device_id = $device_id;
		$token->device_os =	$device_type;
		$token->device_token = $device_token;
		$token->save();
		
		return $token;
    }

	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the token value for the "remember me" session.
	 *
	 * @return string
	 */
	public function getRememberToken()
	{
		return $this->remember_token;
	}

	/**
	 * Set the token value for the "remember me" session.
	 *
	 * @param  string  $value
	 * @return void
	 */
	public function setRememberToken($value)
	{
		$this->remember_token = $value;
	}

	/**
	 * Get the column name for the "remember me" token.
	 *
	 * @return string
	 */
	public function getRememberTokenName()
	{
		return 'remember_token';
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}

}
