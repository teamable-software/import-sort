"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseImports = parseImports;
exports.formatImport = formatImport;

var babylon = _interopRequireWildcard(require("import-sort-parser-babylon"));

var _parser = require("@babel/parser");

var _traverse = _interopRequireDefault(require("@babel/traverse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const BABYLON_PLUGINS = ['jsx', 'flow', 'flowComments', 'doExpressions', 'objectRestSpread', ['decorators', {
  decoratorsBeforeExport: true
}], 'classProperties', 'classPrivateProperties', 'classPrivateMethods', 'exportDefaultFrom', 'exportNamespaceFrom', 'asyncGenerators', 'functionBind', 'functionSent', 'dynamicImport', 'numericSeparator', 'optionalChaining', 'importMeta', 'bigInt', 'optionalCatchBinding', 'throwExpressions', ['pipelineOperator', {
  proposal: 'minimal'
}], 'nullishCoalescingOperator'];
const BABYLON_OPTIONS = {
  allowImportExportEverywhere: true,
  allowAwaitOutsideFunction: true,
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  sourceType: 'module',
  plugins: BABYLON_PLUGINS
};

function parseImports(code) {
  const imports = babylon.parseImports(code);
  const parsed = (0, _parser.parse)(code, BABYLON_OPTIONS);
  (0, _traverse.default)(parsed, {
    ImportDeclaration(path) {
      const node = path.node;
      const importStart = node.start;
      const importEnd = node.end;

      if (node.leadingComments) {
        const comments = node.leadingComments;

        if (comments.some(comment => /import-sort-ignore/.test(comment.value))) {
          const importIndex = imports.findIndex(imp => imp.importStart === importStart && imp.importEnd === importEnd);

          if (importIndex !== -1) {
            imports.splice(importIndex, 1);
          }
        }
      }
    }

  });
  return imports;
}

function formatImport(code, imported, eol) {
  return babylon.formatImport(code, imported, eol);
}