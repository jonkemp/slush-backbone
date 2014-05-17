/* global <%= classifyAppName %>, $ */


window.<%= classifyAppName %> = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        console.log('Hello from Backbone!');
    }
};

$(document).ready(function () {
    <%= classifyAppName %>.init();
});
