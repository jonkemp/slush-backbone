/*global <%= classifyAppName %>, Backbone*/

<%= classifyAppName %>.Models = <%= classifyAppName %>.Models || {};

(function () {
    'use strict';

    <%= classifyAppName %>.Models.<%= classifyClassName %> = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
