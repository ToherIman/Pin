//const fs = require('fs');
export {parcer};
const s = require("underscore.string");
//const file = fs.readFileSync('bookmarks_12_1_16.html', 'utf-8');

function parcer(file) {

  const lines = s.lines(file);

  var fLines = lines.map((line) => {

    if (line.indexOf('HREF') > 0) {//link field

      const urlS = line.indexOf('=') + 2;
      const urlF = line.indexOf('" A');
      const finish = line.indexOf('ADD_DATE') + 10;
      //console.log(line.substr(start, finish));
      const url = line.substring(urlS, urlF);
      const date = line.substr(finish, 10);
      const dateF = date; //new Date(date * 1000);
      const link = { 'url': url, 'date': dateF };
      //console.log(link);
      return link;

    } if (line.indexOf('LAST_MODIFIED') > 0) {//tag field
      const st = line.indexOf('">') + 2;
      const fn = line.indexOf('</H3>');
      const deep = line.indexOf('<DT>');
      const tag = line.substring(st, fn);
      const dt = deep + " " + tag;
      //console.log(dt);
      return dt;
    }
  });

  fLines = fLines.filter((line) => { return line != undefined; });


  var tag = "";
  var combinedTag = "";
  const ffLines = fLines.map((fline) => {
    if (typeof fline == "string") {
      const d = fline.match('[0-9]*')[0];
      const w = fline.match('[^0-9]+')[0].trim();
      var g = w;
      if (d == 4) { tag = w; combinedTag = tag; };
      if (d > 4) { combinedTag = tag + " " + w; };
      //return combinedTag;
    }

    if (typeof fline == "object") {
      if (tag) {
        fline.tag = combinedTag;
        return fline;
      } else {
        return fline;
      }
    }

  });
  return ffLines.filter((line) => { if (line) { return line; } });
};
//console.log(parcer(file));
