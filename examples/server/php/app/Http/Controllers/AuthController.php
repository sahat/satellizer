<?php namespace App\Http\Controllers;

use JWT;
use Hash;
use Config;
use Validator;
use Illuminate\Http\Request;
use GuzzleHttp;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
use App\User;

class AuthController extends Controller {

    /**
     * Generate JSON Web Token.
     */
    protected function createToken($user)
    {
        $payload = [
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + (2 * 7 * 24 * 60 * 60)
        ];
        return JWT::encode($payload, Config::get('app.token_secret'));
    }


    /**
     * Unlink provider.
     */
    public function unlink(Request $request, $provider)
    {
        $user = User::find($request['user']['sub']);

        if (!$user)
        {
            return response()->json(['message' => 'User not found']);
        }

        $user->$provider = '';
        $user->save();
        
        return response()->json(array('token' => $this->createToken($user)));
    }

    /**
     * Log in with Email and Password.
     */
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', '=', $email)->first();

        if (!$user)
        {
            return response()->json(['message' => 'Wrong email and/or password'], 401);
        }

        if (Hash::check($password, $user->password))
        {
            unset($user->password);

            return response()->json(['token' => $this->createToken($user)]);
        }
        else
        {
            return response()->json(['message' => 'Wrong email and/or password'], 401);
        }
    }

    /**
     * Create Email and Password Account.
     */
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'displayName' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->messages()], 400);
        }

        $user = new User;
        $user->displayName = $request->input('displayName');
        $user->email = $request->input('email');
        $user->password = Hash::make($request->input('password'));
        $user->save();

        return response()->json(['token' => $this->createToken($user)]);
    }

    /**
     * Login with Facebook.
     */
    public function facebook(Request $request)
    {
        $accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
        $graphApiUrl = 'https://graph.facebook.com/v2.3/me';

        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'redirect_uri' => $request->input('redirectUri'),
            'client_secret' => Config::get('app.facebook_secret')
        ];

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessToken = $client->get($accessTokenUrl, ['query' => $params])->json();

        // Step 2. Retrieve profile information about the current user.
        $profile = $client->get($graphApiUrl, ['query' => $accessToken])->json();


        // Step 3a. If user is already signed in then link accounts.
        if ($request->header('Authorization'))
        {
            $user = User::where('facebook', '=', $profile['id']);

            if ($user->first())
            {
                return response()->json(['message' => 'There is already a Facebook account that belongs to you'], 409);
            }

            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));

            $user = User::find($payload['sub']);
            $user->facebook = $profile['id'];
            $user->displayName = $user->displayName || $profile['name'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('facebook', '=', $profile['id']);

            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }

            $user = new User;
            $user->facebook = $profile['id'];
            $user->displayName = $profile['name'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
    }

    /**
     * Login with Google.
     */
    public function google(Request $request)
    {
        $accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
        $peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => Config::get('app.google_secret'),
            'redirect_uri' => $request->input('redirectUri'),
            'grant_type' => 'authorization_code',
        ];

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->post($accessTokenUrl, ['body' => $params]);
        $accessToken = $accessTokenResponse->json()['access_token'];

        $headers = array('Authorization' => 'Bearer ' . $accessToken);

        // Step 2. Retrieve profile information about the current user.
        $profileResponse = $client->get($peopleApiUrl, ['headers' => $headers]);

        $profile = $profileResponse->json();

        // Step 3a. If user is already signed in then link accounts.
        if ($request->header('Authorization'))
        {
            $user = User::where('google', '=', $profile['sub']);

            if ($user->first())
            {
                return response()->json(['message' => 'There is already a Google account that belongs to you'], 409);
            }

            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));

            $user = User::find($payload['sub']);
            $user->google = $profile['sub'];
            $user->displayName = $user->displayName || $profile['name'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('google', '=', $profile['sub']);

            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }

            $user = new User;
            $user->google = $profile['sub'];
            $user->displayName = $profile['name'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
    }

    /**
     * Login with LinkedIn.
     */
    public function linkedin(Request $request)
    {
        $accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
        $peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address)';

        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => Config::get('app.linkedin_secret'),
            'redirect_uri' => $request->input('redirectUri'),
            'grant_type' => 'authorization_code',
        ];

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
        if ($request->header('Authorization'))
        {
            $user = User::where('linkedin', '=', $profile['id']);

            if ($user->first())
            {
                return response()->json(['message' => 'There is already a LinkedIn account that belongs to you'], 409);
            }

            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));

            $user = User::find($payload['sub']);
            $user->linkedin = $profile['id'];
            $user->displayName = $user->displayName || $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('linkedin', '=', $profile['id']);

            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }

            $user = new User;
            $user->linkedin = $profile['id'];
            $user->displayName =  $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
    }

    /**
     * Login with Twitter.
     */
    public function twitter(Request $request)
    {
        $requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        $accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        $profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

        $client = new GuzzleHttp\Client();

        // Part 1 of 2: Initial request from Satellizer.
        if (!$request->input('oauth_token') || !$request->input('oauth_verifier'))
        {
            $requestTokenOauth = new Oauth1([
              'consumer_key' => Config::get('app.twitter_key'),
              'consumer_secret' => Config::get('app.twitter_secret'),
              'callback' => Config::get('app.twitter_callback')
            ]);

            $client->getEmitter()->attach($requestTokenOauth);

            // Step 1. Obtain request token for the authorization popup.
            $requestTokenResponse = $client->post($requestTokenUrl, ['auth' => 'oauth']);

            $oauthToken = array();
            parse_str($requestTokenResponse->getBody(), $oauthToken);

            // Step 2. Send OAuth token back to open the authorization screen.
            return response()->json($oauthToken);

        }
        // Part 2 of 2: Second request after Authorize app is clicked.
        else
        {
            $accessTokenOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'token' => $request->input('oauth_token'),
                'verifier' => $request->input('oauth_verifier')
            ]);

            $client->getEmitter()->attach($accessTokenOauth);

            // Step 3. Exchange oauth token and oauth verifier for access token.
            $accessTokenResponse = $client->post($accessTokenUrl, ['auth' => 'oauth'])->getBody();

            $accessToken = array();
            parse_str($accessTokenResponse, $accessToken);

            $profileOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'oauth_token' => $accessToken['oauth_token']
            ]);

            $client->getEmitter()->attach($profileOauth);

            // Step 4. Retrieve profile information about the current user.
            $profile = $client->get($profileUrl . $accessToken['screen_name'], ['auth' => 'oauth'])->json();


            // Step 5a. Link user accounts.
            if ($request->header('Authorization'))
            {
                $user = User::where('twitter', '=', $profile['id']);
                if ($user->first())
                {
                    return response()->json(['message' => 'There is already a Twitter account that belongs to you'], 409);
                }

                $token = explode(' ', $request->header('Authorization'))[1];
                $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));

                $user = User::find($payload['sub']);
                $user->twitter = $profile['id'];
                $user->displayName = $user->displayName || $profile['screen_name'];
                $user->save();

                return response()->json(['token' => $this->createToken($user)]);
            }
            // Step 5b. Create a new user account or return an existing one.
            else
            {
                $user = User::where('twitter', '=', $profile['id']);

                if ($user->first())
                {
                    return response()->json(['token' => $this->createToken($user->first())]);
                }

                $user = new User;
                $user->twitter = $profile['id'];
                $user->displayName = $profile['screen_name'];
                $user->save();

                return response()->json(['token' => $this->createToken($user)]);
            }
        }
    }

    /**
     * Login with Foursquare.
     */
    public function foursquare(Request $request)
    {
        $accessTokenUrl = 'https://foursquare.com/oauth2/access_token';
        $userProfileUrl = 'https://api.foursquare.com/v2/users/self';

        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => Config::get('app.foursquare_secret'),
            'redirect_uri' => $request->input('redirectUri'),
            'grant_type' => 'authorization_code',
        ];

        $client = new GuzzleHttp\Client();

        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->post($accessTokenUrl, ['body' => $params]);
        $accessToken = $accessTokenResponse->json()['access_token'];

        $profileParams = [
            'v' => '20140806',
            'oauth_token' => $accessToken
        ];

        // Step 2. Retrieve profile information about the current user.
        $profileResponse = $client->get($userProfileUrl, ['query' => $profileParams]);

        $profile = $profileResponse->json()['response']['user'];

        // Step 3a. If user is already signed in then link accounts.
        if ($request->header('Authorization'))
        {
            $user = User::where('foursquare', '=', $profile['id']);
            if ($user->first())
            {
                return response()->json(array('message' => 'There is already a Foursquare account that belongs to you'), 409);
            }

            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));

            $user = User::find($payload['sub']);
            $user->foursquare = $profile['id'];
            $user->displayName = $user->displayName || $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('foursquare', '=', $profile['id']);

            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }

            $user = new User;
            $user->foursquare = $profile['id'];
            $user->displayName =  $profile['firstName'] . ' ' . $profile['lastName'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
    }

    /**
     * Login with GitHub.
     */
    public function github(Request $request)
    {
        $accessTokenUrl = 'https://github.com/login/oauth/access_token';
        $userApiUrl = 'https://api.github.com/user';

        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => Config::get('app.github_secret'),
            'redirect_uri' => $request->input('redirectUri')
        ];

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
        if ($request->header('Authorization'))
        {
            $user = User::where('github', '=', $profile['id']);

            if ($user->first())
            {
                return response()->json(['message' => 'There is already a GitHub account that belongs to you'], 409);
            }

            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));

            $user = User::find($payload['sub']);
            $user->github = $profile['id'];
            $user->displayName = $user->displayName || $profile['name'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('github', '=', $profile['id']);

            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }

            $user = new User;
            $user->github = $profile['id'];
            $user->displayName = $profile['name'];
            $user->save();

            return response()->json(['token' => $this->createToken($user)]);
        }
    }
}
