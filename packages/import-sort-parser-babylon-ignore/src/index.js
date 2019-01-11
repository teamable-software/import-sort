import * as babylon from 'import-sort-parser-babylon';

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const BABYLON_PLUGINS = [
  'jsx',
  'flow',
  'flowComments',
  'doExpressions',
  'objectRestSpread',
  ['decorators', { decoratorsBeforeExport: true }],
  'classProperties',
  'classPrivateProperties',
  'classPrivateMethods',
  'exportDefaultFrom',
  'exportNamespaceFrom',
  'asyncGenerators',
  'functionBind',
  'functionSent',
  'dynamicImport',
  'numericSeparator',
  'optionalChaining',
  'importMeta',
  'bigInt',
  'optionalCatchBinding',
  'throwExpressions',
  ['pipelineOperator', { proposal: 'minimal' }],
  'nullishCoalescingOperator',
];

const BABYLON_OPTIONS = {
  allowImportExportEverywhere: true,
  allowAwaitOutsideFunction: true,
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,

  sourceType: 'module',

  plugins: BABYLON_PLUGINS,
};

export function parseImports(code) {
  const imports = babylon.parseImports(code);

  const parsed = parse(code, BABYLON_OPTIONS);

  traverse(parsed, {
    ImportDeclaration(path) {
      const node = path.node;

      const importStart = node.start;
      const importEnd = node.end;

      if (node.leadingComments) {
        const comments = node.leadingComments;

        if (
          comments.some(comment => /import-sort-ignore/.test(comment.value))
        ) {
          const importIndex = imports.findIndex(
            imp =>
              imp.importStart === importStart && imp.importEnd === importEnd
          );
          if (importIndex !== -1) {
            imports.splice(importIndex, 1);
          }
        }
      }
    },
  });

  return imports;
}

export function formatImport(code, imported, eol) {
  return babylon.formatImport(code, imported, eol);
}
