W A T

R A N

S L A

T O R

#

[![npm version](https://badge.fury.io/js/watranslator.svg)](https://www.npmjs.com/package/watranslator)

A WAT to WASM compiler

**[Try the live demo →](https://martinericsson.github.io/watranslator/demo/)**

* The target is the version 2.0 of the WASM core specification with the Threads proposal.
* Main runtime environment is the browser.

## Motivation
Note: This is a toy project

* Smaller bundle size than other alternatives.
* Included selected WASM proposals.
* Only support stack-style notation for simplicity.

## Usage

From npm

> npm i watranslator

Or clone and build it locally to the `/dist` folder with

> npm i && npm run build:prod

There is also a demo application

> npm run start:demo

There is only one exported function `compile` that return the wasm binary.

```javascript
import {compile} from "watranslator"

const src = `(module)`;
const binary = await compile(src);
```
