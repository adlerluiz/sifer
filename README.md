# `Sifer`
[![npm](https://img.shields.io/npm/v/sifer.svg?style=flat-square)](https://npmjs.org/sifer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Sifer is a dependency scanner, with which it is possible to check if your project's dependencies have the latest versions.

![Input Example](https://raw.githubusercontent.com/adlerluiz/sifer/master/example/input-example.gif)

# Install
`NPM`
```
npm install sifer --save-dev
```

```
npm install sifer --global
```

`YARN`
```
yarn add sifer --dev
```
```
yarn add global sifer
```
# Usage
`sifer scan [path]` - Path to be scanned, can be file or directory (note: if the  path is not provided, it will use the current workdir) 