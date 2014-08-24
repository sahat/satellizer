<?php

class AuthController extends BaseController {

    private function createToken($user) {
        return $user;
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

    public function facebook() {
        $accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
        $graphApiUrl = 'https://graph.facebook.com/me';

        $params = array(
            'code' => Input::get('code'),
            'client_id' => Input::get('clientId'),
            'redirect_uri' => Input::get('redirectUri'),
            'client_secret' => Config::get('secrets.FACEBOOK_SECRET')
        );

        $client = new GuzzleHttp\Client();
        $response1 = $client->get($accessTokenUrl, ['query' => $params]);

        $accessToken = array();
        parse_str($response1->getBody(), $accessToken);

        $response2 = $client->get($graphApiUrl, ['query' => $accessToken]);
        $profile = $response2->json();

        $user = User::where('facebook', $profile->id);

        if ($user->exists) {
            return Response::json(array('token' => $this->createToken($user)));
        }

        $user = new User;
        $user->facebook = profile.id;
        $user->displayName = profile.name;
        $user->save();

        return Response::json(array('token' => $this->createToken($user)));
    }



}
