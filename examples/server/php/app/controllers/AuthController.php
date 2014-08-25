<?php

class AuthController extends \BaseController {

    private function createToken($user)
    {
        $payload = array(
            'user' => $user->first(),
            'iat' => time(),
            'exp' => time() + (2 * 7 * 24 * 60 * 60)
        );

        return JWT::encode($payload, Config::get('secrets.TOKEN_SECRET'));
    }

    public function login()
    {
        $email = Input::get('email');
        $password = Input::get('password');

        $user = User::where('email', '=', $email)->first();

        if (!$user)
        {
            return Response::json(array('message' => 'Wrong email and/or password'), 401);
        }

        if (Hash::check($password, $user->password))
        {
            // The passwords match...
            unset($user->password);
            return Response::json(array('token' => $this->createToken($user)));
        }
        else
        {
            return Response::json(array('message' => 'Wrong email and/or password'), 401);
        }
    }

    public function signup()
    {
        $user = new User;
        $user->displayName = Input::get('displayName');
        $user->email = Input::get('email');
        $user->password = Hash::make(Input::get('password'));
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
            $user = User::where('facebook', '=', $profile['id']);

            if ($user->first())
            {
                return Response::json(array('message' => 'There is already a Facebook account that belongs to you'), 409);
            }

            $token = explode(' ', Request::header('Authorization'))[1];
            $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
            $payload = json_decode(json_encode($payloadObject), true);

            $user = User::find($payload['user']['id']);
            $user->facebook = $profile['id'];
            $user->displayName = $user->displayName || $profile['name'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('facebook', '=', $profile['id']);

            if ($user->first())
            {
                return Response::json(array('token' => $this->createToken($user)));
            }

            $user = new User;
            $user->facebook = $profile['id'];
            $user->displayName = $profile['name'];
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
            if ($user->first())
            {
                return Response::json(array('message' => 'There is already a Google account that belongs to you'), 409);
            }

            $token = explode(' ', Request::header('Authorization'))[1];
            $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
            $payload = json_decode(json_encode($payloadObject), true);

            $user = User::find($payload['user']['id']);
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
        $accessTokenUrl = 'https://github.com/login/oauth/access_token';
        $userApiUrl = 'https://api.github.com/user';

        $params = array(
            'code' => Input::get('code'),
            'client_id' => Input::get('clientId'),
            'redirect_uri' => Input::get('redirectUri'),
            'client_secret' => Config::get('secrets.GITHUB_SECRET')
        );

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->get($accessTokenUrl, ['query' => $params]);

        $accessToken = array();
        parse_str($accessTokenResponse->getBody(), $accessToken);

        $headers = array('User-Agent' => 'Satellizer');

        // Step 2. Retrieve profile information about the current user.
        $userApiResponse = $client->get($userApiUrl, [
            'headers' => $headers,
            'query' => $accessToken
        ]);
        $profile = $userApiResponse->json();

        // Step 3a. If user is already signed in then link accounts.
        if (Request::header('Authorization'))
        {
            $user = User::where('github', '=', $profile['id']);

            if ($user->first())
            {
                return Response::json(array('message' => 'There is already a GitHub account that belongs to you'), 409);
            }

            $token = explode(' ', Request::header('Authorization'))[1];
            $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
            $payload = json_decode(json_encode($payloadObject), true);

            $user = User::find($payload['user']['id']);
            $user->github = $profile['id'];
            $user->displayName = $user->displayName || $profile['name'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('github', '=', $profile['id']);

            if ($user->first())
            {
                return Response::json(array('token' => $this->createToken($user)));
            }

            $user = new User;
            $user->github = $profile['id'];
            $user->displayName = $profile['name'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
    }


}
