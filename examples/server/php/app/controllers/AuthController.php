<?php

class AuthController extends \BaseController {

    private function createToken($user)
    {
        $payload = array(
            'user' => $user,
            'iat' => 'today',
            'exp' => '14days'
        );
        return JWT::encode($payload, Config::get('secrets.TOKEN_SECRET'));
    }

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

    public function facebook()
    {
        $accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
        $graphApiUrl = 'https://graph.facebook.com/me';

        $params = array(
            'code' => Input::get('code'),
            'client_id' => Input::get('clientId'),
            'redirect_uri' => Input::get('redirectUri'),
            'client_secret' => Config::get('secrets.FACEBOOK_SECRET')
        );

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->get($accessTokenUrl, ['query' => $params]);

        $accessToken = array();
        parse_str($accessTokenResponse->getBody(), $accessToken);

        // Step 2. Retrieve profile information about the current user.
        $graphiApiResponse = $client->get($graphApiUrl, ['query' => $accessToken]);
        $profile = $graphiApiResponse->json();

        // Step 3a. If user is already signed in then link accounts.
        if (Request::header('Authorization'))
        {
            $user = User::where('facebook', $profile->id);

            if ($user->exists)
            {
                return Response::json(array('message' => 'There is already a Facebook account that belongs to you'));
            }

            $token = explode(' ', Request::header('Authorization'))[1];
            $payload = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));

            $user = User::find($payload->id);
            $user->facebook = $profile->id;
            $user->displayName = $user->displayName || $profile->name;
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('facebook', $profile->id);

            if ($user->exists)
            {
                return Response::json(array('token' => $this->createToken($user)));
            }

            $user = new User;
            $user->facebook = $profile->id;
            $user->displayName = $profile->name;
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
    }

    public function google()
    {
        $accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
        $peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

        $params = array(
            'code' => Input::get('code'),
            'client_id' => Input::get('clientId'),
            'redirect_uri' => Input::get('redirectUri'),
            'grant_type' => 'authorization_code',
            'client_secret' => Config::get('secrets.GOOGLE_SECRET')
        );

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->post($accessTokenUrl, ['body' => $params]);
        $accessToken = $accessTokenResponse->json()['access_token'];

        $headers = array('Authorization' => 'Bearer ' . $accessToken);

        // Step 2. Retrieve profile information about the current user.
        $profileResponse = $client->get($peopleApiUrl, ['headers' => $headers]);

        $profile = $profileResponse->json();

        // Step 3a. If user is already signed in then link accounts.
        if (Request::header('Authorization'))
        {
            $user = User::where('google', '=', $profile['sub']);

            if ($user->exists)
            {
                return Response::json(array('message' => 'There is already a Google account that belongs to you'));
            }

            $token = explode(' ', Request::header('Authorization'))[1];
            $payload = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));

            $user = User::find($payload->id);
            $user->google = $profile['sub'];
            $user->displayName = $user->displayName || $profile['name'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('google', '=', $profile['sub']);

            if ($user->first())
            {
                return Response::json(array('token' => $this->createToken($user)));
            }

            $user = new User;
            $user->google = $profile['sub'];
            $user->displayName = $profile['name'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }



    }

    public function linkedin()
    {

    }

    public function twitter()
    {

    }

    public function foursquare()
    {

    }

    public function github()
    {

    }


}
