# Service Worker implementation with Cache API
Service Worker implementation with Cache API - (Progressive Web App concept) using Materialize template as app shell.

Service workers provide a way for webpages to run scripts in the background even when the page is not open. A service worker can act as a proxy to a web page, intercepting requests and controlling responses, and this makes them well suited to dealing with many exciting web features, such as offline capabilities, background syncing, and push notifications. Features like these have traditionally given native apps an edge over web apps, but with service workers, all kinds of previously impossible things are now possible on the web.

## Achieved goals

* Blazing fast app-shell rendering and page load (after first visit)
* Any viewed content work offline

App shell files are pre cached and use OFFLINE FIRST - then network strategy
HTML content and AJAX HTML requests and any other resources
(like images, or third part css, js) are cached and use NETWORK FIRST strategy (when app is offline content still can be viewed)


## Installation

Install dependencies using npm:

```sh
$ npm install -g gulp && npm install
```

## Usage

### Build

```sh
$ gulp
```

Once you've got a build of gulp done, server with browser-sync will start under
```sh
localhost:3000
```

## You need HTTPS

During development you'll be able to use service worker through localhost, but to deploy it on a site you'll need to have HTTPS setup on your server.

Using service worker you can hijack connections, fabricate, and filter responses. Powerful stuff. While you would use these powers for good, a man-in-the-middle might not. To avoid this, you can only register service workers on pages served over HTTPS, so we know the service worker the browser receives hasn't been tampered with during its journey through the network.

https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features


## Manifest.json

Generated with Web App manifest generator to make web app installable.
https://app-manifest.firebaseapp.com/

Full specification
https://www.w3.org/TR/appmanifest/


## .htaccess
Contain, max age=0 rule to prevent browser from cacheing service worker file

It is important to set Cache-Control header with low max-age time like max-age=0
otherwise sw.js (service-worker) will be cached by browser native cache.
In result it will not update instantly his contents and neither the cache.

<filesMatch "\.(js)$">
      Header set Cache-Control "max-age=0, public"
</filesMatch>
