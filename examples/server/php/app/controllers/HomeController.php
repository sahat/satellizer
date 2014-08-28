<?php

class HomeController extends BaseController {

    public function index()
    {
        return File::get(public_path().'/index.html');
    }

}