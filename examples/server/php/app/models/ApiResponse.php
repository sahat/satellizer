<?php
/**
 *	@author Jeremy Legros
 *	@version 0.1.1
 * 	@license http://opensource.org/licenses/MIT MIT
 */

use Illuminate\Validation\Validator;
use Illuminate\Support\Facades\Response as Response;

/**
 *	Convenient method to format Json response messages, but not only
 */
class ApiResponse extends Response {

	/**
	 *	@param Validation $validator Illuminate\Validation\Validator instance to format errors
	 *	@param boolean $stringify Specify whether the response should be formatted in a string or as an array (default)
	 *	@param array $headers Additional header to append to the request
	 * 	@return json String or Array representation of the validation errors
	 */
	public static function validation ($validator, $stringify=false, $status='412', $headers=array() ) {
		if ( !($validator instanceof Validator) )
			throw new Exception('Argument is not a Validator instance ('.get_class($validator).' found).');

		$response = array('validation'=>'Passed!');

		if ( $validator->fails() ) {
			$errors = $validator->messages()->toArray();
			if ( $stringify ) {
				$response = '';
				if ( is_array($errors) ) {
					foreach ($errors as $key => $value) {
						if ( self::isAssocArray($value) ){
							$response .= $key.' ';
							foreach ($value as $key => $val) {
								$response .= strtolower($key).'. ';
							}
						}
						else for ($i=0; $i <count($value) ; $i++) { 
								$response .= $value[$i].' ';
						}
					}
				}
				else $response .= $errors;
			}
			else
				$response = $errors;
		}
		
		// return json_encode(array( 'validation' => $response) );
		return self::json( array( 'validation' => $response), $status, $headers);
	}

	/**
	 *	@param url $url protocol to redirect to
	 *	@return ApiResponse Response to client
	 */
	public static function makeProtocol ( $url ) {
        $response = self::make();
        $response->header('Location', $url);
        return $response;
    }

	/**
	 *	Similar to 403 Forbidden, but specifically for use when authentication is required and 
	 *  has failed or has not yet been provided. The response must include a WWW-Authenticate header field 
	 *  containing a challenge applicable to the requested resource.
	 *	@param array|string $date Message to format
	 *	@param array $headers Additional header to append to the request
	 * 	@return ApiResponse JSON representation of the error message
	 */
	public static function errorUnauthorized( $data=array(), $headers=array() ){
		return self::json( $data, '401', $headers );
	}

	/**
	 *	The request was a valid request, but the server is refusing to respond to it. 
	 *	Unlike a 401 Unauthorized response, authenticating will make no difference.
	 *	@param array|string $date Message to format
	 *	@param array $headers Additional header to append to the request
	 * 	@return ApiResponse JSON representation of the error message
	 */
	public static function errorForbidden( $data=array(), $headers=array() ){
		return self::json( $data, '403', $headers );
	}

	/**
	 *	The requested resource could not be found but may be available again in the future. 
	 *	Subsequent requests by the client are permissible.
	 *	@param array|string $date Message to format
	 *	@param array $headers Additional header to append to the request
	 * 	@return ApiResponse JSON representation of the error message
	 */
	public static function errorNotFound( $data=array(), $headers=array() ){
		return self::json( $data, '404', $headers );
	}

	/**
	 *	A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
	 *	@param array|string $date Message to format
	 *	@param array $headers Additional header to append to the request
	 * 	@return ApiResponse JSON representation of the error message
	 */
	public static function errorInternal( $data=array(), $headers=array() ){
		return self::json( $data, '500', $headers );
	}

	/**
	 *	@param array $array Message to format
	 *	@return boolean true is associative array, false otherwise
	 */
	protected static function isAssocArray( $array ){
		if ( empty($array) ) return false;
    	return (bool)count(array_filter(array_keys($array), 'is_string'));
	}


}