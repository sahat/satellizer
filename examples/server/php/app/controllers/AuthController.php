<?php

use GuzzleHttp\Subscriber\Oauth\Oauth1;

class AuthController extends \BaseController {

    public function unlink($provider)
    {
        $token = explode(' ', Request::header('Authorization'))[1];
        $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
        $payload = json_decode(json_encode($payloadObject), true);
        
        $user = User::find($payload['sub']);

        if (!$user)
        {
            Response::json(array('message' => 'User not found'));
        }

        $user->$provider = '';
        $user->save();
        return Response::json(array('token' => $this->createToken($user)));
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
        $input['displayName'] = Input::get('displayName');
        $input['email'] = Input::get('email');
        $input['password'] = Input::get('password');

        $rules = array('displayName' => 'required',
                       'email' => 'required|email|unique:users,email',
                       'password' => 'required');

        $validator = Validator::make($input, $rules);

        if ($validator->fails()) {
            return Response::json(array('message' => $validator->messages()), 400);
        }
        else
        {
            $user = new User;
            $user->displayName = Input::get('displayName');
            $user->email = Input::get('email');
            $user->password = Hash::make(Input::get('password'));
            $user->save();
            return Response::json(array('token' => $this->createToken($user)));

        }
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

            $user = User::find($payload['sub']);
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
                return Response::json(array('token' => $this->createToken($user->first())));
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

            $user = User::find($payload['sub']);
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
                return Response::json(array('token' => $this->createToken($user->first())));
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
        $accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
        $peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address)';

        $params = array(
            'code' => Input::get('code'),
            'client_id' => Input::get('clientId'),
            'redirect_uri' => Input::get('redirectUri'),
            'grant_type' => 'authorization_code',
            'client_secret' => Config::get('secrets.LINKEDIN_SECRET'),
        );

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->post($accessTokenUrl, ['body' => $params]);

        $apiParams = array(
            'oauth2_access_token' => $accessTokenResponse->json()['access_token'],
            'format' => 'json'
        );

        // Step 2. Retrieve profile information about the current user.
        $peopleApiResponse = $client->get($peopleApiUrl, ['query' => $apiParams]);
        $profile = $peopleApiResponse->json();

        // Step 3a. If user is already signed in then link accounts.
        if (Request::header('Authorization'))
        {
            $user = User::where('linkedin', '=', $profile['id']);

            if ($user->first())
            {
                return Response::json(array('message' => 'There is already a LinkedIn account that belongs to you'), 409);
            }

            $token = explode(' ', Request::header('Authorization'))[1];
            $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
            $payload = json_decode(json_encode($payloadObject), true);

            $user = User::find($payload['sub']);
            $user->linkedin = $profile['id'];
            $user->displayName = $user->displayName || $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('linkedin', '=', $profile['id']);

            if ($user->first())
            {
                return Response::json(array('token' => $this->createToken($user->first())));
            }

            $user = new User;
            $user->linkedin = $profile['id'];
            $user->displayName =  $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
    }

    public function twitter()
    {

        $requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        $accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        $authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

        $client = new GuzzleHttp\Client();

        if (!Request::get('oauth_token') || !Request::get('oauth_verifier'))
        {
            $oauth = new Oauth1([
              'consumer_key' => Config::get('secrets.TWITTER_KEY'),
              'consumer_secret' => Config::get('secrets.TWITTER_SECRET'),
              'callback' => Config::get('secrets.TWITTER_CALLBACK')
            ]);

            $client->getEmitter()->attach($oauth);

            // Step 1. Obtain request token for the authorization popup.
            $requestTokenResponse = $client->post($requestTokenUrl, ['auth' => 'oauth']);

            $oauthToken = array();
            parse_str($requestTokenResponse->getBody(), $oauthToken);

            $params = http_build_query(array(
                'oauth_token' => $oauthToken['oauth_token']
            ));

            // Step 2. Redirect to the authorization screen.
            return Redirect::to($authenticateUrl . '?' . $params);
        }
        else
        {
            $oauth = new Oauth1([
                'consumer_key' => Config::get('secrets.TWITTER_KEY'),
                'consumer_secret' => Config::get('secrets.TWITTER_SECRET'),
                'token' => Request::get('oauth_token'),
                'verifier' => Request::get('oauth_verifier')
            ]);

            $client->getEmitter()->attach($oauth);

            // Step 3. Exchange oauth token and oauth verifier for access token.
            $accessTokenResponse = $client->post($accessTokenUrl, ['auth' => 'oauth']);

            $profile = array();
            parse_str($accessTokenResponse, $profile);

            // Step 4a. If user is already signed in then link accounts.
            if (Request::header('Authorization'))
            {
                $user = User::where('twitter', '=', $profile['user_id']);
                if ($user->first())
                {
                    return Response::json(array('message' => 'There is already a Twitter account that belongs to you'), 409);
                }

                $token = explode(' ', Request::header('Authorization'))[1];
                $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
                $payload = json_decode(json_encode($payloadObject), true);

                $user = User::find($payload['sub']);
                $user->twitter = $profile['user_id'];
                $user->displayName = $user->displayName || $profile['screen_name'];
                $user->save();

                return Response::json(array('token' => $this->createToken($user)));
            }
            // Step 4b. Create a new user account or return an existing one.
            else
            {
                $user = User::where('twitter', '=', $profile['user_id']);

                if ($user->first())
                {
                    return Response::json(array('token' => $this->createToken($user->first())));
                }

                $user = new User;
                $user->twitter = $profile['user_id'];
                $user->displayName = $profile['screen_name'];
                $user->save();

                return Response::json(array('token' => $this->createToken($user)));
            }

        }
    }

    public function foursquare()
    {
        $accessTokenUrl = 'https://foursquare.com/oauth2/access_token';
        $userProfileUrl = 'https://api.foursquare.com/v2/users/self';

        $params = array(
            'code' => Input::get('code'),
            'client_id' => Input::get('clientId'),
            'redirect_uri' => Input::get('redirectUri'),
            'grant_type' => 'authorization_code',
            'client_secret' => Config::get('secrets.FOURSQUARE_SECRET')
        );

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->post($accessTokenUrl, ['body' => $params]);
        $accessToken = $accessTokenResponse->json()['access_token'];

        $profileParams = array(
            'v' => '20140806',
            'oauth_token' => $accessToken
        );

        // Step 2. Retrieve profile information about the current user.
        $profileResponse = $client->get($userProfileUrl, ['query' => $profileParams]);

        $profile = $profileResponse->json()['response']['user'];

        // Step 3a. If user is already signed in then link accounts.
        if (Request::header('Authorization'))
        {
            $user = User::where('foursquare', '=', $profile['id']);
            if ($user->first())
            {
                return Response::json(array('message' => 'There is already a Foursquare account that belongs to you'), 409);
            }

            $token = explode(' ', Request::header('Authorization'))[1];
            $payloadObject = JWT::decode($token, Config::get('secrets.TOKEN_SECRET'));
            $payload = json_decode(json_encode($payloadObject), true);

            $user = User::find($payload['sub']);
            $user->foursquare = $profile['id'];
            $user->displayName = $user->displayName || $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('foursquare', '=', $profile['id']);

            if ($user->first())
            {
                return Response::json(array('token' => $this->createToken($user->first())));
            }

            $user = new User;
            $user->foursquare = $profile['id'];
            $user->displayName =  $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
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

            $user = User::find($payload['sub']);
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
                return Response::json(array('token' => $this->createToken($user->first())));
            }

            $user = new User;
            $user->github = $profile['id'];
            $user->displayName = $profile['name'];
            $user->save();

            return Response::json(array('token' => $this->createToken($user)));
        }
    }


}
