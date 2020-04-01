This is a module cloned from https://github.com/krakenjs/grumbler-scripts. Props to krakenjs!

The goal is to trim down the dependencies, particularly those with out-of-date dependencies.
I've removed the flow-specific stuff, (as I use typescript) and trimed away dependencies that don't pass a `yarn audit` command.

I have yet to decide to publish it, and not fully updated this README.md

## Grumbler Scripts

Shared scripts for grumbler based modules.

## Package.json scripts

```json
 "scripts": {
    "setup": "npm install && npm run flow-typed",
    "lint": "eslint --ext js,jsx config/ test/ *.js",
    "flow-typed": "echo ===== deprecated for create-ts-library =====",
    "flow": "echo ===== deprecated for create-ts-library =====",
    "flow:build": "echo ===== deprecated for create-ts-library =====",
    "babel": "babel ./config --ignore=node_modules --out-dir ./config",
    "webpack": "babel-node --plugins=transform-es2015-modules-commonjs ./node_modules/.bin/webpack --progress",
    "test": "npm run lint && npm run flow && npm run test-babel && npm run test-webpack && npm run find-eslint-rules",
    "build": "npm run test && npm run babel && npm run webpack && npm run flow:build",
    "release": "./publish.sh",
    "release:patch": "./publish.sh patch",
    "release:minor": "./publish.sh minor",
    "release:major": "./publish.sh major",
    "clean": "rimraf dist coverage",
    "reinstall": "rimraf flow-typed && rimraf node_modules && npm install",
    "debug": "cross-env NODE_ENV=debug",
    "prepublish": "in-publish && npm run babel || not-in-publish",
    "postpublish": "git checkout config",
    "test-babel": "babel --config-file ./config/.babelrc-node test/* > /dev/null && babel --config-file ./config/.babelrc-browser test/* > /dev/null",
    "test-webpack": "babel-node --plugins=transform-es2015-modules-commonjs ./node_modules/.bin/webpack --progress",
    "check-updates": "npm-check-updates"
  }
```

## ESLint

### `.eslintrc.js`

#### Node

```javascript
/* @flow */

module.exports = {
  extends: "./node_modules/grumbler-scripts/config/.eslintrc-node.js"
};
```

#### Browser

```javascript
/* @flow */

module.exports = {
  extends: "./node_modules/grumbler-scripts/config/.eslintrc-browser.js"
};
```

## Babel

### `.babelrc`

#### Node

```json
{
  "extends": "grumbler-scripts/config/.babelrc-node"
}
```

#### Browser

```json
{
  "extends": "grumbler-scripts/config/.babelrc-browser"
}
```

## Webpack

### `webpack.config.js`

```javascript
/* @flow */

import { getWebpackConfig } from "grumbler-scripts/config/webpack.config";

const FILE_NAME = "mylibrary";
const MODULE_NAME = "mylibrary";

export let WEBPACK_CONFIG = getWebpackConfig({
  filename: `${FILE_NAME}.min.js`,
  modulename: MODULE_NAME,
  minify: true
});

export default [WEBPACK_CONFIG];
```

## Karma

### `karma.conf.js`

```javascript
/* @flow */

import { getKarmaConfig } from "grumbler-scripts/config/karma.conf";
import { getWebpackConfig } from "grumbler-scripts/config/webpack.config";

export default (karma: Object) =>
  karma.set(
    getKarmaConfig(karma, {
      basePath: __dirname,
      webpack: getWebpackConfig()
    })
  );
```
