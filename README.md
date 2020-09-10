# `Sifer`
[![npm](https://img.shields.io/npm/v/sifer.svg?style=flat-square)](https://npmjs.org/sifer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Sifer is a dependency scanner and updater, with which it is possible to validate if your project's dependencies are always up to date

![Scan Example](https://raw.githubusercontent.com/adlerluiz/sifer/master/example/scan.gif)

![Update Example](https://raw.githubusercontent.com/adlerluiz/sifer/master/example/update.gif)

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
## Scan
```
sifer scan [path]

Path to be scanned, can be file or directory (note: if the path is not provided,
it will use the current path where it is being executed)


Positionals:
  path  Path to be scanned                [string] [default: current workdir]
```

## Update
```
sifer update [path]

Update file following increment type

Positionals:
  path  File path                                   [string] [default: "--patch"]

Options:
  --patch        Update patch version
  --minor        Update minor version
  --major        Update major version
```