'use strict';

//jjtodo: define gulp detection file change (--private add to dev path Wp dev path)

var siteCacheName = 'siteCacheNameV1'; //cache version - if modified cache will reload assets

var siteCachedFiles = [

    'css/app-shell.css',  //CSS
    'https://cdnjs.cloudflare.com/ajax/libs/alertify.js/0.5.0/alertify.default.min.css',  //CSS
    './',
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
    'js/vendor/jquery-3.2.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/alertify.js/0.5.0/alertify.min.js'

];

//install event - when assets are cached
self.addEventListener('install',function(ev){

    //jjtodo: add alertify
    console.log('Service Worker: Instal event',ev);

    ev.waitUntil(
        caches.open(siteCacheName).then(function(cache) {
           console.log('cached');
           return cache.addAll(siteCachedFiles)
        })
   );


})

//activate event - when cached assets are loaded
self.addEventListener('activate',function(ev){
    //jjtodo: add alertify
    console.log('Service Worker: Activate  event',ev);

    //jjtodo: cache referesh inmplementation needed

});