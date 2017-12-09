'use strict';

var debug = false; //debug flag -- see console

//cache version - modify cacheName to reaload
var siteAppShellCacheName = 'siteAppShellCacheName3';  //offline first strategy (LOAD FORM CACHE)
var siteCacheNameHtml = 'siteCacheNameHtmlV11'; //network first strategy

var siteAppShellFiles = [

    'css/app-shell.css',  //CSS
    'css/alertify.css',  //CSS
    'fonts/roboto/Roboto-Bold.woff',   //FONTS
    'fonts/roboto/Roboto-Bold.woff2',
    'fonts/roboto/Roboto-Light.woff',
    'fonts/roboto/Roboto-Light.woff2',
    'fonts/roboto/Roboto-Medium.woff',
    'fonts/roboto/Roboto-Medium.woff2',
    'fonts/roboto/Roboto-Regular.woff',
    'fonts/roboto/Roboto-Regular.woff2',
    'fonts/roboto/Roboto-Thin.woff',
    'fonts/roboto/Roboto-Thin.woff2',
    'js/init.js',  //JAVASCRIPT
    'js/vendor/materialize.js',
    'js/vendor/alettify.js',
    'js/vendor/jquery-3.2.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/alertify.js/0.5.0/alertify.min.js'

];

//install event - when assets are pre cached
self.addEventListener('install',function(ev){

    if(debug){ console.log('SW--Core: Instal event',ev); }

    //pre caching manualy defined files
    ev.waitUntil(
        caches.open(siteAppShellCacheName).then(function(cache) {

            if(debug){console.log('SW--Core:Files cached');}
            return cache.addAll(siteAppShellFiles)
        })
   );

   self.skipWaiting(); //Immediate Control -  used to skip waiting state


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

                if(cachedKeys[i] != siteAppShellCacheName && cachedKeys[i] != siteCacheNameHtml){
                    deletePromises.push(caches.delete(cachedKeys[i]));
                }
            }
            return Promise.all(deletePromises);
        })
    );

});



self.addEventListener('fetch',function(event){

    var requestUrl = new URL(event.request.url); //convert request to URL object
    var requestPath = requestUrl.pathname;  //gets path (no domain, no params )- ex /css/app-shell.css

    var acceptHeader = event.request.headers.get('Accept');
    var ajaxHeader = event.request.headers.get('x-requested-with');


    if(debug) {
        console.log(event); //pure event
        console.log(requestUrl); //url object
    }

    if(inAppShell(requestPath)){

        //CACHE FIRST STRATEGY
        event.respondWith(cacheFirstStrategy(event.request));

    }else if(acceptHeader.indexOf('text/html') !== -1 || ajaxHeader == 'XMLHttpRequest'){

        //if it is html file or ajax request - NETWORK FIRST STRATEGY
        event.respondWith(networkFirstStrategy(event.request));

    }else {
        //other go NETWORK ONLY
       event.respondWith(fetch(event.request));
    }

});

/* =================  CACHE  STRATEGIES */

function networkFirstStrategy(request){

    return fetchAndCacheRequst(request).catch(function(response){ //if network fail
        return caches.match(request);  //then it show from cache
    });

}
function cacheFirstStrategy(request){

    return caches.match(request).then(function(cacheResponse){
        return cacheResponse || fetchAndCacheRequst(request);
    });

}


function fetchAndCacheRequst(request){

    return fetch(request).then(function(networkResponse){

        caches.open(getCacheName(request)).then(function(cache){
            cache.put(request,networkResponse);
        });

        return networkResponse.clone();
    });
}


function getCacheName(request){


    var requestUrl = new URL(request.url);
    var requestPath = requestUrl.pathname;

    var acceptHeader = request.headers.get('Accept');
    var ajaxHeader = request.headers.get('x-requested-with');


    if(acceptHeader.indexOf('text/html') !== -1 || ajaxHeader == 'XMLHttpRequest') {

        //if it is html file or ajax request
        return siteCacheNameHtml;

    }else if(inAppShell(requestPath)){

        //if it is in pre cached assets
        return  siteAppShellCacheName;

    }

}



function inAppShell(requestPath){

    for (var i = 0; i < siteAppShellFiles.length; i++) {

        if(requestPath.indexOf(siteAppShellFiles[i]) != -1){
            return true;
        }
    }

    return false;

}