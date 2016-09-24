'use strict';

function Plan () {}

Plan.prototype.setLimit = function (amount) {
  this.limit = amount;
};

Plan.prototype.withinLimit = function (rows) {
  if (this.limit === undefined) return true;
  var isWithinLimit = rows.length < this.limit;
  return isWithinLimit;
};

Plan.prototype.setSelected = function (columnNames) {
  if (columnNames.indexOf('*') !== -1) {
    this.selected = undefined;
  } else {
    this.selected = columnNames;
  }
};

Plan.prototype.selectColumns = function (row) {
  if (this.selected === undefined) return row;
  var selectedRow = {};
  this.selected.forEach(function (columnName) {
    selectedRow[columnName] = row[columnName];
  });
  return selectedRow;
};

Plan.prototype.setCriteria = function (criteria) {
  this.criteria = criteria;
};

Plan.prototype.matchesRow = function (row) {
  if (this.criteria === undefined) return true;
  for (var columnName in this.criteria) {
    var cond = this.criteria[columnName];
    var rowValue = row[columnName];
    if (typeof cond === 'function') {
      if (!cond(rowValue)) {
        return false;
      }
    } else {
      if (rowValue !== cond) {
        return false;
      }
    }
  }
  return true;
};

module.exports = Plan;