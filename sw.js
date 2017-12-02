'use strict';

//jjtodo: define gulp detection file change (--private add to dev path Wp dev path)

var siteCacheName = 'siteCacheNameV4'; //cache version - if modified cache will reload assets
var siteCacheNamePages = 'siteCacheNamePagesV1'; //cache pages version - if modified cache will reload pages

var siteCachedFiles = [

    'css/app-shell.css',  //CSS
    'css/alertify.css',  //CSS
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
    'js/vendor/alettify.js',
    'js/vendor/jquery-3.2.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/alertify.js/0.5.0/alertify.min.js'

];

//install event - when assets are cached
self.addEventListener('install',function(ev){


    console.log('SWinside: Instal event',ev);

    ev.waitUntil(
        caches.open(siteCacheName).then(function(cache) {

           console.log('SWinside:Files cached');
           return cache.addAll(siteCachedFiles)
        })
   );


})

//activate event - when cached assets are loaded
self.addEventListener('activate',function(event){
    console.log('SWinside: Activate  event',event);

    event.waitUntil(
        caches.keys().then(function(cachedKeys){
            var deletePromises= [];
            for(var i=0; i< cachedKeys.lenght; ++i){
                if(cachedKeys[i] != siteCacheName && cachedKeys[i] != siteCacheNamePages){
                    deletePromises.push(caches.delete(cachedKeys[i]));
                }

            }

            return Promise.all(deletePromises);
        })
    );

});