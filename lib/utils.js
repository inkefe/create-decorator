"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = void 0;

var isObject = function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
};

exports.isObject = isObject;