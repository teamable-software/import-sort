# Teamble import-sort

These are packages for [reneke/import-sort](https://github.com/renke/import-sort) tool which
sorts import declaration in JavaScript code.

This monorepo contains two packages:

- import-sort-parser-babylon-ignore
- import-sort-style-react

## import-sort-parser-babylon-ignore

This is the same package as [import-sort-parser-babylon](https://www.npmjs.com/package/import-sort-parser-babylon) but with
ignore comment `// import-sort-ignore`. So if you want to skip sorting for the particular import declaration you can do:

```js
// import-sort-ignore
import b from './b';
import a from './a';
```

## import-sort-style-react

Import sorting rules used in Teamable for React applications.
