<?php

class BaseController extends Controller {

    /**
     * Setup the layout used by the controller.
     *
     * @return void
     */
    protected function setupLayout()
    {
        if (!is_null($this->layout)) {
            $this->layout = View::make($this->layout);
        }
    }

    protected function createToken($user)
    {
        $payload = array(
            'iss' => Request::url(),
            'sub' => $user->first()->id,
            'iat' => time(),
            'exp' => time() + (2 * 7 * 24 * 60 * 60)
        );

        return JWT::encode($payload, Config::get('secrets.TOKEN_SECRET'));
    }

}
