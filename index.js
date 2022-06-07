/*!
 * a polyfill (for Safari), a shim (for Chrome) to load module script in XHTML mode
 */
(() => {
  if (document.documentElement.tagName !== 'html') {
    console.warn('This document is not served as application/xhtml+xml, xhtml-esm-support won\'t work');
    return;
  }
  let browser = {
    chrome: navigator.vendor ===  'Google Inc.',
    safari: navigator.vendor ===  'Apple Computer, Inc.',
    firefox: window.sidebar !== undefined
  };
  let support = {  // XXX as of 2022
    module: browser.chrome || browser.firefox,
    syncModule: browser.firefox,
  };
  let utoa = (text) => {
    let str;
    if (window.TextEncoder) {
      str = '';
      let arr = new TextEncoder().encode(text);
      for (let i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
      }
    } else {
      str = unescape(encodeURIComponent(text));
    }
    return window.btoa(str);
  };
  class Srcset extends Map {
    constructor(entries) {
      super(entries);
    }
    static from(srcset) {
      let entries = [];
      for (let i = 0, a = srcset.split(/,\s*/), e; i < a.length; i++) {
        e = a[i].split(/\s+/);
        entries.push([e[1] || '', e[0]]);
      }
      return new Srcset(entries);
    }
  }
  let cloneNode = (el, deep) => {
    let newEl = document.createElement(el.tagName);
    let attrs = Array.prototype.slice.call(el.attributes);
    for (let i = 0, attr; i < attrs.length; i++) {
      attr = attrs[i];
      newEl.setAttribute(attr.name, attr.value);
    }
    if (deep) {
      newEl.textContent = el.textContent;
    }
    return newEl;
  };
  /**
   *
   * @param {string|HTMLScriptElement} source
   * @param {Object} props
   * @returns {HTMLScriptElement}
   * @async
   */
  let importScript = function(source, props) {
    return new Promise(function(resolve, reject) {
      let script;
      let src;
      if (typeof source === 'string' || source == null) {
        src = source;
        script = document.createElement('script');
        if (src) {
          script.src = src;
        }
      } else if (source && source.tagName === 'script') {
        script = cloneNode(source, true);
      } else {
        throw new Error('Invalis source');
      }
      if (props && typeof props === 'object') {
        for (let key in props) {
          if (key === 'dataset') {
            Object.assign(script.dataset, props[key]);
          } else {
            script[key] = props[key];
          }
        }
      }
      src = script.src;
      if (src) {
        let onLoad = () => {
          resolve(script);
          script.onload = null;
          script.onerror = null;
        };
        let onError = () => {
          reject(new Error('Error loading ' + src));
          script.onload = null;
          script.onerror = null;
        };
        script.onload = onLoad;
        script.onerror = onError;
      }
      document.body.appendChild(script);
      if (!src) {
        resolve(script);
      }
    });
  };
  let loadImportmaps = () => {
    let promises = [];
    let scripts = Array.prototype.slice.call(document.querySelectorAll('script[type="importmap"]'));
    scripts.forEach((script) => {
      let newScript = script.cloneNode(true);
      newScript.type = 'systemjs-importmap';
      if (script.src)
        newScript.crossOrigin = 'anonymous';
      script.insertAdjacentElement('afterend', newScript);
      promises.push(newScript);
    });
    return Promise.all(promises);
  };
  let loadDependencies = (srcset) => {
    if (!srcset) {
      return Promise.resolve([]);
    }
    loadImportmaps();
    let map = Srcset.from(srcset);
    let promises = [];
    ['systemjs', 'systemjs-babel'].forEach((dep) => {
      let url = map.get(dep);
      if (!url) {
        console.warn('cannot find dependency "' + dep + '" in data-srcset, errors may occur');
        return;
      }
      promises.push(importScript(url, {
        async: false,
        dataset: {title: dep}
      }));
    });
    return Promise.all(promises);
  };

  let processScripts = () => {
    let promises = [];
    if (!support.module) {
      /* global System */
      let scripts =  Array.prototype.slice.call(document.querySelectorAll('script[type="module"]'));
      scripts.forEach((script) => {
        let {src} = script;
        let specifier;
        if (!src) {
          specifier = 'data:text/javascript;base64,' + utoa(script.textContent);
        } else if (/^(\.\.?\/|\/|https?:\/\/|data:)/.test(src)) {
          specifier = src;
        } else {
          specifier = './' + src;
        }
        let importOptions, assertType;
        if ((assertType = script.getAttribute('asserttype')) !== null) {
          importOptions = {
            assert: {type: assertType}
          };
        }
        let promise = System.import(specifier, importOptions);
        promises.push(promise);
        promise.then(() => {
          script.dispatchEvent(new Event('load'));
        }, () => {
          script.dispatchEvent(new Event('error'));
        });
      });
    } else if (!support.syncModule) {
      let scripts =  Array.prototype.slice.call(document.querySelectorAll('script[type="module"]:not([async])'));
      scripts.forEach((script) => {
        let promise = importScript(script, {async: true});
        promise.then((newScript) => {
          script.parentNode.replaceChild(newScript, script);
        });
        promises.push(promise);
      });
    }
    return Promise.all(promises);
  };
  if (!support.module) {
    loadDependencies(document.currentScript.dataset.peerDependencies).then(processScripts);
  } else if (!support.syncModule) {
    processScripts();
  }
})();
