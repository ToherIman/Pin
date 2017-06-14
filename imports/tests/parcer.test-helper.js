const fs = require('fs');
const parcer = require('../api/parcer.js');
exports = { parcerInputType };

var file;

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
