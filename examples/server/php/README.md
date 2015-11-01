<img src="http://blog.legacyteam.info/wp-content/uploads/2014/10/laravel-logo-white.png" width="280px">

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as authentication, routing, sessions, queueing, and caching.

## Usage

1. Download and install [Composer](https://getcomposer.org/).
2. Install [Laravel 5](http://laravel.com) via `composer global require "laravel/installer=~1.1"`.
3. Install Mcrypt PHP Extension:
 - <img src="http://deluge-torrent.org/images/apple-logo.gif" height="17"> **Mac OS X**: `brew install php55-mcrypt`.
 - <img src="https://lh5.googleusercontent.com/-2YS1ceHWyys/AAAAAAAAAAI/AAAAAAAAAAc/0LCb_tsTvmU/s46-c-k/photo.jpg" height="17"> **Ubuntu**: `sudo apt-get install php5-mcrypt`.
4. Install dependencies via `composer install`.
5. Run `php artisan serve --port 3000`, then go to `http://localhost:3000`.

### <img src="http://www.file-extensions.org/imgs/app-icon/128/10520/microsoft-windows-10-icon.png" height="24"> Windows Prerequisites

1. After you download and install PHP 5.5 (or 5.6), inside its directory find a file *php.ini-development*.
2. Rename *php.ini-development* to *php.ini*.
3. Open *php.ini* with a text editor, then uncomment the following extensions by removing semicolon in front:
 - `extension=php_openssl.dll`
 - `extension=php_mbstring.dll`
 - `extension=php_exif.dll`
4. You need above extensions to properly install Composer and Laravel.
5. Install the latest [OpenSSL](https://slproweb.com/products/Win32OpenSSL.html) library (Win32 or Win64 depending on which PHP you downloaded).
