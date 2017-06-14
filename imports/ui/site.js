import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './site.html';

import '/imports/api/sites.js';

Template.site.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
    editMode: function() {
        return Template.instance().editMode.get();
    },
    updateSiteId: function() {
        return this._id;
    },
    likeCounter: function() {
        return this.likes;
    },
    shoot: function() {
        return Meteor.call('shoot');
    }
});

Template.site.onCreated(function() {
    this.editMode = new ReactiveVar(false);


});

Template.site.events({
    'click .delete' () {
        Meteor.call('sites.remove', this._id, this.owner);
    },
    'click .toggle-private' () {
        Meteor.call('sites.setPrivate', this._id, !this.private);
    },
    'click .fa-pencil': function(event, template) {
        console.log(template.editMode.get());
        template.editMode.set(!template.editMode.get());
    },
    'click .jsLikeButton' () {
        Meteor.call('sites.incrementLikes', this._id);
        console.log(this._id);
    },
    'mousedown .site' () {
        let instance = this;

        $('.site').draggable();

    },
});