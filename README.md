# Service Worker implementation with Cache API
Service Worker implementation with Cache API - (Progressive Web App concept) using Materialize template as app shell.

Service workers provide a way for webpages to run scripts in the background even when the page is not open. A service worker can act as a proxy to a web page, intercepting requests and controlling responses, and this makes them well suited to dealing with many exciting web features, such as offline capabilities, background syncing, and push notifications. Features like these have traditionally given native apps an edge over web apps, but with service workers, all kinds of previously impossible things are now possible on the web.

## Aimed goals

* Time to first paint is extremely fast
* Content is rendered. App shell can be a placeholder.
* User can scroll, but doesn’t necessarily need to be able to navigate or deeply interact.
* First pageload < 1000ms
* App shell is progressively enhanced in.
* User can now navigate within the app.
* Second pageload
* Shell is loaded from SW cache
* Content loads off the network


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

##You need HTTPS

During development you'll be able to use service worker through localhost, but to deploy it on a site you'll need to have HTTPS setup on your server.

Using service worker you can hijack connections, fabricate, and filter responses. Powerful stuff. While you would use these powers for good, a man-in-the-middle might not. To avoid this, you can only register service workers on pages served over HTTPS, so we know the service worker the browser receives hasn't been tampered with during its journey through the network.