'use strict';

var debug = true; //debug flag -- see console

//different caches for different strategies
//cache version - if modified cacheName it will reload assets
var siteCacheName = 'siteCacheNameV1';
var siteCacheNameHtml = 'siteCacheNameHtmlV1';


var siteCachedFiles = [

    '/css/app-shell.css',  //CSS
    '/css/alertify.css',  //CSS
    './',
    '/fonts/roboto/Roboto-Bold.woff',   //FONTS
    '/fonts/roboto/Roboto-Bold.woff2',
    '/fonts/roboto/Roboto-Light.woff',
    '/fonts/roboto/Roboto-Light.woff2',
    '/fonts/roboto/Roboto-Medium.woff',
    '/fonts/roboto/Roboto-Medium.woff2',
    '/fonts/roboto/Roboto-Regular.woff',
    '/fonts/roboto/Roboto-Regular.woff2',
    '/fonts/roboto/Roboto-Thin.woff',
    '/fonts/roboto/Roboto-Thin.woff2',
    '/js/init.js',  //JAVASCRIPT
    '/js/vendor/materialize.js',
    '/js/vendor/alettify.js',
    '/js/vendor/jquery-3.2.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/alertify.js/0.5.0/alertify.min.js'

];

//install event - when assets are pre cached
self.addEventListener('install',function(ev){

    if(debug){ console.log('SW--Core: Instal event',ev); }

    //pre caching manualy defined files
    ev.waitUntil(
        caches.open(siteCacheName).then(function(cache) {

            if(debug){console.log('SW--Core:Files cached');}
            return cache.addAll(siteCachedFiles)
        })
   );

   self.skipWaiting(); //Immediate Control -  used to skip waiting state - when Service Worker controller change


})

//activate event - when assets are loaded
self.addEventListener('activate',function(event){

    if(debug){ console.log('SW--Core: Activate  event',event); }

    self.clients.claim();  //Immediate Control - force service worker controller to activate if changed without tab reload

    //clearing caches if any cache name change
    event.waitUntil(
        caches.keys().then(function(cachedKeys){
            var deletePromises= [];

            for(var i=0; i< cachedKeys.length; ++i){
                if(cachedKeys[i] != siteCacheName && cachedKeys[i] != siteCacheNameHtml){
                    deletePromises.push(caches.delete(cachedKeys[i]));
                }
            }
            return Promise.all(deletePromises);
        })
    );

});


//fetching requests Listener
self.addEventListener('fetch',function(event){

    var requestUrl = new URL(event.request.url); //convert request to URL object
    var requestPath = requestUrl.pathname;  //gets path (no domain, no params )- ex /css/app-shell.css
    var fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1); // - ex app-shell.css

    var acceptHeader = event.request.headers.get('Accept');
    var ajaxHeader = event.request.headers.get('x-requested-with');

    if(debug) {
        console.log(event); //pure event
        console.log(requestUrl); //url object
    }

    if(fileName == 'sw.js' || event.request.method =='POST'){
        //POST requests can't be cached
        //just pass request through - NETWORK ONLY STRATEGY (dtandard) - OFFLINE FAIL
        event.respondWith(fetch(event.request));

    }else if(acceptHeader.indexOf('text/html') !== -1 || ajaxHeader == 'XMLHttpRequest'){  //if it is html file or ajax request

        event.respondWith(networkFirstStrategy(event.request));

    }else {
        event.respondWith(networkFirstStrategy(event.request));
    }

});

function networkFirstStrategy(request){

    return fetchAndCacheRequst(request).catch(function(response){ //if network fail
         return caches.match(request);  //then it show from cache
    });

}

//caching request as key,value pair - in desired cache name
function fetchAndCacheRequst(request){

    return fetch(request).then(function(networkResponse){

        caches.open(getCacheName(request)).then(function(cache){
            cache.put(request,networkResponse);
        });

        return networkResponse.clone();
    });

}

//cheking cache name in case of having few caches,
// ( ex. if You have different strategies for images, another for html etc..)

function getCacheName(request){

    var requestUrl = new URL(request.url);

    var acceptHeader = request.headers.get('Accept');
    var ajaxHeader = request.headers.get('x-requested-with');

    if(acceptHeader.indexOf('text/html') !== -1 || ajaxHeader == 'XMLHttpRequest'){  //if it is html file or ajax request

        return siteCacheNameHtml; //it use pages cache name

    }else {

        return siteCacheName;  //else use just default cache name = appshell

    }
}