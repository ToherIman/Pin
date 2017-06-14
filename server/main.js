import '../imports/api/sites.js';

Meteor.publish('sites', function sitePublication() {
    return Sites.find({
        $or: [{ private: { $ne: true } }, { owner: this.userId }, ],
    });
});