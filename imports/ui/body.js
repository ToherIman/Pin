import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Sites } from '../api/sites.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './body.html';
import './site.js';
import './input.html';
import './file.js';
import './file.html';

const EMBEDLY_KEY = '1d5c48f7edc34c54bdae4c37b681ea2b';

const embedly = require('embedly'),
    util = require('util');



const filterTag = new ReactiveVar();
const inputOpen = new ReactiveVar(false);

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('sites');
    console.log(Meteor.settings.public.embedly);

});

Template.body.helpers({
    inputIs() {
        return inputOpen.get();
    },
    sites() {
        return Sites.find({
            owner: { $regex: Meteor.userId() }
        }, { limit: 12 }, {
            sort: { createdAt: -1 }
        });
    },
    sitesCount() {
        return Sites.find().count();
    },
    searchResults() {
        if (filterTag.get()) {
            let sTag = filterTag.get().trim();
            console.log(sTag);
            return Sites.find({
                tag: {
                    $regex: ".*" + sTag + ".*"
                }
            }, { limit: 20 }, {
                sort: {
                    createdAt: -1
                }
            });
        }
    },
    listOfTags() {
        let arrayOfSites = Sites.find({
            owner: {
                $regex: Meteor.userId()
            }
        }, {
            sort: {
                createdAt: -1
            }
        }).fetch();
        let stringOfTags = "";
        arrayOfSites.forEach((item) => {
            if (item.tag) {
                stringOfTags += " " + item.tag;
            }
        });

        let arrayOfTags = stringOfTags.split(" ").map((tag) => {
            if (tag[0] == "#") {
                tag = tag.substring(1);
            }
            return tag;
        });
        let result = _.uniq(arrayOfTags);

        return result;

    }
});

Template.body.events({
    'click .tag' () {
        $('.tag').css({ "color": "black", "font-size": "1em" });
        const tag = this.innerHTML.trim().substr(1);
        filterTag.set(tag);
        chosen = filterTag.get() === tag;
        $(this).css({ "color": "#CDDC39", "font-size": "1.3em" });
        inputOpen.set(false);
    },
    'click .inputMenu' () {
        inputOpen.set(!inputOpen.get());
        $('.tag').css({ "color": "black", "font-size": "1em" });

    }
});
/*
(() => {
 const tenUrl = [];
  Sites.find({
            owner: {$regex: Meteor.userId()}}, {limit: 10},  {fields: {text: 1}}, {sort: {createdAt: -1}, 
        }).forEach(site => tenUrl.push(site.text));
        console.log(tenUrl);
        return tenUrl;
})();
*/