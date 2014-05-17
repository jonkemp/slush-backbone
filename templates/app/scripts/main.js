/* global <%= _.camelize(appNameSlug) %>, $ */


window.<%= _.camelize(appNameSlug) %> = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        console.log('Hello from Backbone!');
    }
};

$(document).ready(function () {
    <%= _.camelize(appNameSlug) %>.init();
});
