# xhtml5-esm-support

This repository is now repurposed to be example guide over library code. previously it is

> A polyfill for Safari, a shim for Chrome to make module scripts work in XHTML mode.

## Examples

How to import ES modules in XHTML, SVG

| Info \\ Type             | HTML5                                 | XHTML5                                  | XHTML5  with XML mime                | SVG                                 |
| ------------------------ | ------------------------------------- | --------------------------------------- | ------------------------------------ | ----------------------------------- |
| sample document          | see [test.html](./examples/test.html) | see [test.xhtml](./examples/test.xhtml) | see [test.xml](./examples/test.xml)  | see [test.svg](./examples/test.svg) |
| filename extension       | .html                                 | .xhtml or .xht                          | .xml                                 | .svg                                |
| MIME type                | text/html                             | application/xhtml+xml                   | text/xml, application/xml            | image/svg+xml                       |
| internal module support  | yes                                   | partial[^1]                             | partial[^1]                          | partial [^2]                        |
| external module support  | with `<script type="module">`         | with `<script>` and dynamic import      | *with `<script>` and dynamic import* | with `<script>` and dynamic import  |
| method to create element | createElement, createElementNS        | createElement, createElementNS          | createElementNS                      | createElementNS                     |

When a document is opened directly with browser (using file: protocol), then external ES module is not supported by browsers. thus you need build tool like Rollup to pack ES modules as IIFE js, see [test-file-protocol.xhtml](./examples/test-file-protocol.xhtml). 

## Maintainers

[@fuweichin](https://github.com/fuweichin)



## License

[MIT](./LICENSE)


## Appendix
### Footnotes

[^1]: Chrome supports module script in XHTML only if the async attribute is present, Safari doesn't support module script.
[^2]: Chrome and Safari don't support internal module script in XML/SVG/MathML

