/*global <%= classifyAppName %>, Backbone*/

<%= classifyAppName %>.Views = <%= classifyAppName %>.Views || {};

(function () {
    'use strict';

    <%= classifyAppName %>.Views.<%= classifyViewName %> = Backbone.View.extend({

        template: '',

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });

})();
