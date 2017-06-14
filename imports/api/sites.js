import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
export {Sites};
Sites = new Mongo.Collection('sites');

Sites.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  update: function(userId, doc) {
    return !!userId;
  }
});

SimpleSchema.debug = true;

SitesSchema = new SimpleSchema({
  text: {
    label: "URL",
    type: String,
    max: 200,
    autoform: {
      afFieldInput: {
        type: "url"
      }
  }},
  tag: {
    label: "Tag",
    type: "String",
    max: 200,
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function() {
      return new Date();
    },
    autoform: {
      type: "hidden"
    }
  },
    owner: {
      type: String,
      label: "Owner ID",
      autoValue: function () {
        return this.userId;
      },
      autoform: {
        type: "hidden"
      }
    },
    username: {
      type: String,
      label: "Owner name",
      autoValue: function () {
        return Meteor.user().username;
      },
      autoform: {
        type: "hidden"
      }
    },
    private: {
      type: Boolean,
      label: "Private or Public",
      defaultValue: false,
      autoform: {
        type: "hidden"
      }
    },
    likes: {
      type: Number,
      label: "Number of likes",
      defaultValue: 0,
      autoform: {
        type: "hidden"
      },
    },
    likers: {
      type: Array,
      label: "Likers",
      defaultValue: [],
      autoform: {
        type: "hidden"
      },
    },
    "likers.$": {
      type: String,
      autoform: {
        type: "hidden"
      },
    }
});

Sites.attachSchema(SitesSchema);

Meteor.methods({
  /*
    'sites.insert' (text, tag) {
        check(text, String);
        check(tag, String);

        if (!this.userId)
            throw new Meteor.Error('not-authorized');


        Sites.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            tag: tag,
        });
    },
    */

    'sites.remove' (siteId, siteOwner) {
        check(siteId, String);

        const site = Sites.findOne(siteId);
        if (siteOwner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        Sites.remove(siteId);
    },

    'sites.setPrivate' (siteId, setToPrivate) {
        check(siteId, String);
        check(setToPrivate, Boolean);

        const site = Sites.findOne(siteId);

        // Make sure only the task owner can make a task private
        if (site.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Sites.update(siteId, {
            $set: {
                private: setToPrivate
            }
        });
    },

    'sites.incrementLikes' (siteId) {
      if(Sites.findOne(siteId).likers.includes(Meteor.userId())) {
        console.log("-1");
        Sites.update(siteId, {
          $inc: {
            likes: -1,
          },
          $pull: {
            likers: Meteor.userId(),
          }
        });
      } else {
        console.log("+1");
        Sites.update(siteId, {
          $inc: {
            likes: +1,
          },
          $push: {
            likers: Meteor.userId(),
          }
        });
      }
  }

});
