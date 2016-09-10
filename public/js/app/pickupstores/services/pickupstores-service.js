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
/**
 *  Encapsulates access to the CAAS pickstore API.
 */
angular.module('ds.pickupstores')
    .factory('PickupStoresSvc', ['PickupStoreREST', function(PickupStoreREST){

        var getPickupStoresList = function (parms) {
            return PickupStoreREST.PickupStores.all('pickupstores').getList();
        };

        return {
            queryPickupStoresList: function(parms) {
               return getPickupStoresList(parms);
            }
        };
}]);