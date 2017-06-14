import './file.html';
import {parcer} from '/imports/api/parcer.js';
import {Meteor} from 'meteor/meteor';
import '/imports/api/sites.js';

let bFile;
const fs = require('fs');

if(Meteor.isClient) {
  var fileReader = {
    read: function (file, callback) {
      const reader = new FileReader;

      const fileInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
        file: null,
      };

      reader.onload = function() {
        fileInfo.file = reader.result;
        callback(null, fileInfo);
      };
      reader.error = function() {
        callback(reader.error);
      };
      reader.readAsText(file);
    }
  };
};

Template.fileInput.events({
  "submit form": function(e, tmpl) {
    e.preventDefault();
    const file = tmpl.find('input[type=file]').files[0];
    fileReader.read(file, function(err, fileInfo){
      bFile = fileInfo.file;
      const parced = parcer(bFile);
      //console.log(parced);
      parced.map((link) => {
        Sites.insert({
          "text":link.url,
          "tag":link.tag,
          "createdAt": new Date(link.date * 1000)
        });
      });
    });
}
});

Template.fileInput.helpers({

});
