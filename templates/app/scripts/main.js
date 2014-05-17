/* global <%= camelizeAppName %>, $ */


window.<%= camelizeAppName %> = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        console.log('Hello from Backbone!');
    }
};

$(document).ready(function () {
    <%= camelizeAppName %>.init();
});
