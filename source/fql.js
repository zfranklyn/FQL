'use strict';

var Plan = require('./plan');

function FQL (table) {
  this.table = table;
  this.plan = new Plan();
}

FQL.merge = function (objA, objB) {
  // return merged;
};

// // this problems, closure solution
// FQL.prototype.get = function () {
//   var rowIds = this.table.getRowIds();
//   var outerThis = this;
//   var rows = rowIds.map(function iter (id) {
//     return outerThis.table.read(id);
//   });
//   return rows;
// };

// // this problems, the example below fails
// FQL.prototype.get = function () {
//   var rowIds = this.table.getRowIds();
//   var rows = rowIds.map(this.table.read);
//   return rows;
// };


// this problems, arrow function solution
// FQL.prototype.get = function () {
//   var rowIds = this.table.getRowIds();
//   var rows = rowIds.map((id) => {
//     return this.table.read(id);
//   });
//   return rows;
// };

// // this problems, shorter arrow function solution
// FQL.prototype.get = function () {
//   var rowIds = this.table.getRowIds();
//   var rows = rowIds.map((id) => this.table.read(id));
//   return rows;
// };

// // this problems, bind solution
// FQL.prototype.get = function () {
//   var rowIds = this.table.getRowIds();
//   var boundRead = this.table.read.bind(this.table);
//   var rows = rowIds.map(boundRead);
//   return rows;
// };

FQL.prototype.get = function () {
  var rowIds = this.table.getRowIds();
  var key = this.plan.criteria;

    if(this.table.hasIndexTable(key)){
        var iTable = this.table.getIndexTable(key);
        var rowIds = iTable[this.plan.criteria[key]];

    } 


  var rows = [];
  for (var i = 0; i < rowIds.length && this.plan.withinLimit(rows); i++) {
    var initialRow = this.table.read(rowIds[i]);
    if (this.plan.matchesRow(initialRow)) {
      var selectedRow = this.plan.selectColumns(initialRow);
      rows.push(selectedRow);
    }
  }
  return rows;
};

FQL.prototype.count = function () {
  var amountOfRows = this.get().length;
  return amountOfRows;
};

FQL.prototype.limit = function (amount) {
  this.plan.setLimit(amount);
  return this;
};

FQL.prototype.select = function () {
  var columnNames = Array.prototype.slice.call(arguments);
  this.plan.setSelected(columnNames);
  return this;
};

FQL.prototype.where = function (criteria) {
  this.plan.setCriteria(criteria);
  return this;
};

module.exports = FQL;