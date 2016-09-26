'use strict';

angular.module('ds.pickupstores')
   .factory('PickupStoreREST', ['Restangular', 'SiteConfigSvc', function(Restangular, siteConfig){
       return {
           /** Endpoint for wishlist.*/
           PickupStores: Restangular.withConfig(function (RestangularConfigurer) {
               RestangularConfigurer.setBaseUrl(siteConfig.apis.pickupstores.baseUrl);
           }),
           PickupStoresByPincode: Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(siteConfig.apis.pickupstores.baseUrl+'/pickupstores/pincode/');
           })
       };

   }]);