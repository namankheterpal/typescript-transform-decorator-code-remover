#!/usr/bin/env node

/**
 * @author: Naman Kheterpal<namankheterpal@gmail.com>
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
var ts = require("typescript");
var tsIsKind = require("ts-is-kind");

function createTransformer(options) {
  var transformer = function (context) {
    var visitor = function (node) {
      if (options.decoratorName &&
        node.decorators &&
        node.decorators.some((decorator, i) =>
          decorator.expression.getText() === options.decoratorName)) {
        return undefined;
      }
      if (options.jsxAttribute) {
        if (tsIsKind.isJsxElement(node)) {
          if (node.openingElement &&
            node.openingElement.attributes &&
            node.openingElement.attributes.properties) {
            if (node.openingElement.attributes.properties.some(element => element.name.text === options.jsxAttribute)) {
              return undefined;
            }
          }
        } else if (tsIsKind.isJsxSelfClosingElement(node)) {
          if (node.attributes &&
            node.attributes.properties) {
            if (node.attributes.properties.some(element => {
                if (element.name && element.name.text === options.jsxAttribute) {
                  return true;
                }
              })) {
              return undefined;
            }
          }
        }
      }
      return ts.visitEachChild(node, visitor, context);
    };
    return function (node) {
      return ts.visitNode(node, visitor);
    };
  };
  return transformer;
}
exports.createTransformer = createTransformer;
exports.default = createTransformer;