/*global <%= classifyAppName %>, Backbone*/

<%= classifyAppName %>.Collections = <%= classifyAppName %>.Collections || {};

(function () {
    'use strict';

    <%= classifyAppName %>.Collections.<%= classifyCollectionName %> = Backbone.Collection.extend({

        model: <%= classifyAppName %>.Models.<%= classifyCollectionName %>

    });

})();
