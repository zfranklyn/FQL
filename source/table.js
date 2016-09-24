'use strict';

var fs = require('fs');
var FQL = require('./fql.js');

function Table (folderPath) {
  this.folderPath = folderPath;
  this.indexTables = {};

  // {year: {}, name:{1972: []}}
}

// example
// 0 => '0000.json'
Table.toFilename = function (id) {
  var filename = (`000${id}.json`).slice(-9);
  return filename;
};

// example
// '0000.json' => 0
Table.toId = function (filename) {
  var id = parseInt(filename);
  return id;
};

// example
// 0 => {
//   "id": 0,
//   "name": "Aliens",
//   "year": 1986,
//   "rank": 8.2
// }
Table.prototype.read = function (id) {
  var filepath = `${this.folderPath}/${Table.toFilename(id)}`;
  var filecontents = fs.readFileSync(filepath);
  var row = JSON.parse(filecontents);
  return row;
};

// example
// => [0,1,2,5,6]
Table.prototype.getRowIds = function () {
  var filenames = fs.readdirSync(this.folderPath);
  var rowIds = filenames.map(Table.toId);
  return rowIds;
};

Table.prototype.hasIndexTable = function(type){
  return !!this.indexTables[type];
}

Table.prototype.addIndexTable = function(type){
  var newIndexTable = {}

  // first extract all years
  // filter duplicates

  var typeQuery = new FQL(this);

  // gives us all different values of "type" in our db
  var typeResult = typeQuery.select('*').get(); // select all types
  // [{year:1999}, {year:2000}...]
  
  // we want this: [1999,2000,2001,2002], so map it out:
  var typeArray = typeResult.forEach((obj)=>{
    var key = obj[type];
    if (!newIndexTable[key]){
      newIndexTable[key] = [];
    } 
    newIndexTable[key].push(obj.id);
  })

  this.indexTables[type] = newIndexTable;

}

Table.prototype.getIndexTable = function(type){
  if (this.hasIndexTable(type)){
    return this.indexTables[type];
  }
}

module.exports = Table;
