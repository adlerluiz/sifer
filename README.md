# <img src="https://raw.githubusercontent.com/adlerluiz/sifer/master/example/sifer.png" width="160">

[![npm](https://img.shields.io/npm/v/sifer.svg?style=flat-square)](https://npmjs.org/sifer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Sifer is a dependency scanner and updater, with which it is possible to validate if your project's dependencies are always up to date

<img src="https://raw.githubusercontent.com/adlerluiz/sifer/master/example/scan.gif" >

<img src="https://raw.githubusercontent.com/adlerluiz/sifer/master/example/update.gif" width="585">

# Install
`NPM`
```bash
npm install sifer --save-dev
```

```bash
npm install sifer --global
```

`YARN`
```bash
yarn add sifer --dev
```
```bash
yarn add global sifer
```
# Usage
## Scan
```bash
sifer scan [path]

Path to be scanned, can be file or directory (note: if the path is not provided,
it will use the current path where it is being executed)


Positionals:
  path  Path to be scanned                [string] [default: current workdir]
```

## Update
```bash
sifer update [path]

Update file following increment type

Positionals:
  path  File path                                   [string] [default: "--patch"]

Options:
  --use          Force use of specific manager                      [default: ""]
  --patch        Update patch version
  --minor        Update minor version
  --major        Update major version
```

# Supports
- Dart
  - Flutter [--use flutter]
  - Pub (Default)
- Node
  - Npm (Default)
  - Yarn [--use yarn]
- Php
  - Composer