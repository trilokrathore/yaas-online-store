/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.pickupstores')
    /** Controls the product detail view, which allows the shopper to add an item to the cart.
     * Listens to the 'cart:updated' event.  Once the item has been added to the cart, and the updated
     * cart information has been retrieved from the service, the 'cart' view will be shown.
     */
    .controller('PickupStoresCtrl', ['$scope', '$rootScope', 'CartSvc','PickupStoresSvc' ,'product', 'lastCatId', 'GlobalData', 'CategorySvc','$filter', '$modal', 'shippingZones', 'Notification', 'ProductExtensionHelper', 'variants', 'variantPrices', 'productFactory','Restangular',
        function($scope, $rootScope, CartSvc,PickupStoresSvc, product, lastCatId, GlobalData, CategorySvc, $filter, $modal, shippingZones, Notification, ProductExtensionHelper, variants, variantPrices, productFactory,Restangular) {
             $scope.lat='75.0';
             $scope.lng='80.0';
             //Starts code
            var mapOptions = {
                   zoom: 10,
                  center: new google.maps.LatLng($scope.lat, $scope.lng),
                  mapTypeId: google.maps.MapTypeId.TERRAIN
                            };
            console.info(document.getElementById('map'));
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);  
            var infoWindow = new google.maps.InfoWindow({map: map});
         
        if (navigator.geolocation) {
              console.info("Just to test");
             navigator.geolocation.getCurrentPosition(function(position) {
             var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            $scope.lat=pos.lat;
            $scope.lng=pos.lng;     
            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location ::'+$scope.pickstores[0].id);
            console.info("Just to test||||||||||");
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow);
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow);
        }
        
            function handleLocationError(isError, infoWindow){
                if(isError){
                     infoWindow.setContent('We could not get your current location. Try again');
                }else{
                    infoWindow.setContent('Please allow our site to know your location.');
                }
            };
            
         console.info('Get all store information');
        //Get data from YAAS and show to user.
        PickupStoresSvc.queryPickupStoresList('test').then(function (response) { 
            console.log(response);
            $scope.pickstores = Restangular.stripRestangular(response);
                console.info($scope.pickstores);
               
               var locationsArr=$scope.pickstores;
               for (var i=0; i<locationsArr.length; i++){
                   console.info(locationsArr[i].id);
                 }
            });
            
            console.info('Finish getting all store inforamtion');
            var modalInstance;
            
            $scope.showMapWithMarkers= function(pickstores){
           
            }
        
            
            //My Code ende here
            ///////////////////////////////////////////////
            //Code ends
            $scope.activeTab = 'description';
            $scope.openTab = function (tabName) {
                $scope.activeTab = tabName;
            };
            
            $scope.productMixins = ProductExtensionHelper.resolveMixins(product.product);
            $scope.productMixinsDefinitions = product.product.metadata.mixins;
                        
            $scope.product = productFactory.fromProduct(product.product, product.prices, variants.length === 0);
            $scope.variants = variants;

            $scope.shippingZones = shippingZones;
            $scope.noShippingRates = true;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            // used by breadcrumb directive
            $scope.category = product.categories;
            $scope.breadcrumbData = angular.copy($scope.category);

            $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();

            /*
             we need to shorten the tax label if it contains more than 60 characters, and give users the option of
             clicking a 'see more' link to view the whole label.
             */
            if ($scope.taxConfiguration && $scope.taxConfiguration.label && $scope.taxConfiguration.label.length > 60) {
                $scope.taxConfiguration.shortenedLabel = $scope.taxConfiguration.label.substring(0, 59);
                $scope.taxConfiguration.seeMoreClicked = false;
            }

            if(!!lastCatId) {
                if(lastCatId === 'allProducts'){
                    var allProductsName = $filter('translate')('ALL_PRODUCTS');
                    $scope.breadcrumbData = {
                        path: [{
                            id: '',
                            name: allProductsName,
                            slug: ''
                        }]
                    };
                }
                else
                {
                    CategorySvc.getCategoryById(lastCatId)
                        .then(function (cat) {
                            $scope.breadcrumbData = {};
                            $scope.breadcrumbData = cat;
                        });
                }
            }

            if ($scope.shippingZones.length) {
                for (var j = 0; j < $scope.shippingZones.length; j++) {
                    if ($scope.shippingZones[j].methods.length) {
                        $scope.noShippingRates = false;
                        break;
                    }
                }
            } else {
                $scope.noShippingRates = true;
            }

            //Event that product is loaded
            $scope.$emit('product:opened', product);

            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.error=null;

            //input default values must be defined in controller, not html, if tied to ng-model
            $scope.productDetailQty = 1;
            $scope.buyButtonEnabled = true;
            
            $scope.showShippingRates = function(){
                
                modalInstance = $modal.open({
                    templateUrl: 'js/app/shared/templates/shipping-dialog.html',
                    scope: $scope
                });
            };
            
            $scope.showPickupStores = function(){
                
                modalInstance = $modal.open({
                    templateUrl: 'js/app/pickupstores/templates/pick-storetest.html',
                    scope: $scope
                });
            };
            
             //Save id of the last viewed element, last viewed page and current sort
            $scope.openPickupStoresDetails = function (productId) {
                console.info(productId);
                GlobalData.products.lastViewedProductId = productId;
                GlobalData.products.lastSort = $scope.sort;
            };

            $scope.closeShippingZonesDialog = function () {
                modalInstance.close();
            };

            // scroll to top on load
            window.scrollTo(0, 0);

            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {

                $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();

                if(eveObj.source === 'manual'){
                    $rootScope.showCart = true;
                    //check to see if the cart should close after timeout
                    if(eveObj.closeAfterTimeout)
                    {
                        $rootScope.$emit('cart:closeAfterTimeout');

                    }
                    $scope.buyButtonEnabled = true;
                }
            });

            $scope.$on('$destroy', unbind);

            /** Add the product to the cart.  'Buy' button is disabled while cart update is in progress. */
            $scope.addToCartFromDetailPage = function () {
                $scope.error = false;
                $scope.buyButtonEnabled = false;
                // todo: this should be fixed to use $scope.product
                CartSvc.addProductToCart(product.product, $scope.product.prices, $scope.productDetailQty, { closeCartAfterTimeout: true, opencartAfterEdit: false })
                .then(function(){
                    var productsAddedToCart = $filter('translate')('PRODUCTS_ADDED_TO_CART');
                    Notification.success({message: $scope.productDetailQty + ' ' + productsAddedToCart, delay: 3000});
                }, function(){
                    $scope.error = 'ERROR_ADDING_TO_CART';
                }).finally(function() {
                    $scope.buyButtonEnabled = true;
                });
            };

            $scope.changeQty = function () {
                if (!$scope.productDetailQty){
                    $scope.buyButtonEnabled = false;
                } else {
                    $scope.buyButtonEnabled = true;
                }
            };


            function filterPricesForVariant(variantId) {
                return variantPrices.filter(function (price) {
                    var foundVariantId = price.itemYrn.split(';').pop();
                    return variantId === foundVariantId;
                });
            }

            $scope.onActiveVariantChanged = function (activeVariant) {
                if (_.isObject(activeVariant)) {
                    var prices = filterPricesForVariant(activeVariant.id);
                    $scope.product = productFactory.fromProductVariant(product.product, activeVariant, prices);
                } else {
                    $scope.product = productFactory.fromProduct(product.product, product.prices, false);
                }
            };
}]);
