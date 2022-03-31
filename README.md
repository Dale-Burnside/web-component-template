# Zea WebComponent Template

This is a template project to facilitate quickly setting up a custom web component that includes the zea-engine and various tools.

## Web Components

https://developer.mozilla.org/en-US/docs/Web/Web_Components

Web components enable embedding custom functionality directly into the DOM tree by specifying the custom element name.


## Customizing the Zea Web Component

This template provides a simple starting point for building your own embedable component that you can integrate into existing applications.

Once the code for the custom element has been inported into your project, the tags in the domce tree

```html
<main class="flex flex-1 h-full">
  <zea-web-component
    id="zea-web-component"
    class="h-full w-full"
  ></zea-web-component>
</main>
```

JavaScript code can then get a handle to the web component, and can then invoke methods directly on the web component. 
> The Web Component runs in the same JavaScript context as the host page, so there is no need for message passing system that are typically required when working with iFrames. This makes code development and debugging a lot easier. 
> 
```javascript
const $wc = document.getElementById('zea-web-component')
```

```javascript
$wc.loadAsset('data/Dead_eye_bearing.stp.zcad')
```

```javascript
$wc.frameView()
```

# Build System

The Zea Web Component is built using TSDX and TypeScript.

## TSDX User Guide

> This TSDX setup is meant for developing libraries (not apps!) that can be published to NPM. If you’re looking to build a Node app, you could use `ts-node-dev`, plain `ts-node`, or simple `tsc`.

> If you’re new to TypeScript, checkout [this handy cheatsheet](https://devhints.io/typescript)

### Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

### Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

#### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

#### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

### Continuous Integration

#### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

### Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean

// inside your code...
if (__DEV__) {
  console.log('foo')
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

### Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

### Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

### Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

### Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
