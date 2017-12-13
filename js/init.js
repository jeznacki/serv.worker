var debug = false;

(function($){
    $(function(){

        $('.button-collapse').sideNav();

    }); // end of document ready


})(jQuery); // end of jQuery name space




/*  Service Worker init -  availability check and register */
if ('serviceWorker' in navigator) {


    navigator.serviceWorker
        .register('sw.js') //should be root level or higher level than cached assests
        .then(function(swRegistration){

            var serviceWorker;

            if(swRegistration.installing){
                if(debug) {
                    console.log('ServiceWorker:  Resolved at Installing');
                    alertify.warning('ServiceWorker:  Resolved at Installing');
                }
                serviceWorker = swRegistration.installing;

            }else if(swRegistration.waiting){
                if(debug) {
                    console.log('ServiceWorker:  Resolved at Waiting');
                    alertify.warning('ServiceWorker: Resolved at Waiting');
                }
                serviceWorker = swRegistration.waiting;

            }else if(swRegistration.active){
                if(debug) {
                    console.log('ServiceWorker:  Resolved at activated');
                    alertify.success('ServiceWorker: Resolved at activated');
                }
                serviceWorker = swRegistration.active;
            }

            if(serviceWorker){

                serviceWorker.addEventListener('statechange',function(e){
                    if(debug) {
                        console.log('ServiceWorker state change: ' + e.target.state);
                        alertify.warning('State change: ' + e.target.state);
                    }
                })

            }




        }).catch(function (err) {
             console.log('Error occured', err);
        });

        //event fired when Service Worker controller change - sw.js


        navigator.serviceWorker.addEventListener('controllerchange',function(e){
            if(debug){ console.log('Controller Changed');}
        });



}

/*
SERVICE WORKERS UNREGISTER EXAMPLE
navigator.serviceWorker.getRegistrations().then(function(registrations) {

 for(let registration of registrations) {
  registration.unregister()
	}
 }
)
*/