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

            alertify.warning('Service Worker: Registered');
            console.log(swRegistration);


        }).catch(function (err) {
        console.log('Error occured', err);
    })



}