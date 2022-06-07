# xhtml5-esm-support

A polyfill for Safari, a shim for Chrome to make module scripts work in XHTML mode.

**Contents:**

<!--ts-->

   * [Background](#background)
   * [Install](#install)
   * [Usage](#usage)
      * [Common Issues:](#common-issues)
   * [Maintainers](#maintainers)
   * [License](#license)
<!--te-->



## Background

You may use ES Module along with [XHTML5](https://en.wikipedia.org/wiki/HTML5#XHTML_5_(XML-serialized_HTML_5)), but in Chromium based browsers: <q>Module scripts without the `async` attribute do not load when the page is served as XHTML</q>, and in Safari: <q>Module scripts do not load when the page is served as XHTML</q>. See [notes at caniuse.com](https://caniuse.com/mdn-html_elements_script_type_module)



## Install

```sh
npm install xhtml5-esm-support

# install peer dependencies to support Safari
npm install systemjs systemjs-babel
```



## Usage

In your XHTML5 document, put `<scipt>` below after your module `<script>`s

```html
<script src="./node_modules/xhtml5-esm-support/index.js"
    data-peer-dependencies="./node_modules/systemjs/dist/system.min.js systemjs, ./node_modules/systemjs-babel/dist/systemjs-babel.js systemjs-babel"></script>
<!-- specify data-peer-dependencies to support Safari -->
```

Notes:

+ This package is not necessary for Chrome if all your module scripts were declared async
+ Package "systemjs" and "systemjs-babel" are reuqired for Safari
+ This package is not necessary for Firefox, but it's OK if loaded
+ Don't use this package in HTML mode, but if loaded, a console warning will appear
+ This package works for XHTML5, not XHTML1.0, so don't declare a DTD in DOCTYPE

### Common Issues:

+ module scripts run out of order
  + It doesn't matter in most cases

+ module scripts run deferred
  + You may replace code like `document.addEventListener('DOMCOntentLoaded', main);` with `document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', main) : main();` to make it work.

+ internal module script cannot static import or dynamic import to import other modules (Safari-only)
  + you may extract internal modules as external.



## Examples

See [examples/test.xhtml](./examples/test.xhtml)



## Maintainers

[@fuweichin](https://github.com/fuweichin)



## License

[MIT](./LICENSE)
