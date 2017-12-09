'use strict';

//jjtodo: define gulp detection file change (--private add to dev path Wp dev path)

//different caches can be usefull when having different strategies
var siteCacheName = 'siteCacheNameV1'; //cache version - if modified cache will reload assets
var siteCacheNamePages = 'siteCacheNamePagesV1';
var siteCacheNameImages = 'siteCacheNameImagesV1';

var exampleImagesPath = '/wp-content/uploads/';

var siteCachedFiles = [

    '/css/app-shell.css',  //CSS
    '/css/alertify.css',  //CSS
    './',
    '/about.html',
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

//install event - when assets are cached
self.addEventListener('install',function(ev){

    console.log('SW--Core: Instal event',ev);

     //Immediate Control -  used to skip waiting state - when Service Worker controller change
    self.skipWaiting();
    ev.waitUntil(
        caches.open(siteCacheName).then(function(cache) {

           console.log('SW--Core:Files cached');
           return cache.addAll(siteCachedFiles)
        })
   );


})

//activate event - when assets are loaded
self.addEventListener('activate',function(event){
    console.log('SW--Core: Activate  event',event);

    //Immediate Control - force service worker controller to activate if changed without tab reload
   self.clients.claim();

    event.waitUntil(
        caches.keys().then(function(cachedKeys){
            var deletePromises= [];

            for(var i=0; i< cachedKeys.length; ++i){
                if(cachedKeys[i] != siteCacheName && cachedKeys[i] != siteCacheNamePages){
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
    console.log(event);
    console.log(requestPath);
    console.log(fileName);

    if(fileName == 'sw.js'){ //just pass request through - NETWORK ONLY STRATEGY, OFFLINE FAIL
        event.respondWith(fetch(event.request));

        console.log(1111111111111111);
    }else {
        fetchAndCacheRequst(event.request);
    }

});



//caching request as key,value pair - in desired cache name
function fetchAndCacheRequst(request){

    return fetch(request).then(function(networkResponse){
        caches.open(getCacheName(request)).then(function(cache){
               cache.put(request,networkResponse);
        })

        return networkResponse.clone();
    });

}

//cheking cache name in case of having few caches,
// ( ex. if You have different strategies for images, another for content etc..)

function getCacheName(request){
    var requestUrl = new URL(request.url); //convert request to URL object
    var requestPath = requestUrl.pathname;  //gets path (no domain, no params )- ex /css/app-shell.css

    if(exampleImagesPath ==  requestPath){
        //if request is going from samle images location then cache it in images cache and return its name
        return siteCacheNameImages

    }else {
        return siteCacheName;  //else use just default cache name = appshell
    }
}