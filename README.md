Themeable markdown converter (Print to PDF, HTML, JPEG or PNG)
==============================================================

[![Version](https://img.shields.io/apm/v/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/releases) [![Total Downloads](https://img.shields.io/apm/dm/markdown-themeable-pdf.svg)](https://atom.io/packages/markdown-themeable-pdf) [![License](https://img.shields.io/apm/l/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/blob/master/package.json#L14) [![Dependencies](https://img.shields.io/david/cakebake/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/blob/master/package.json#L18)

##### This [Atom package](https://atom.io/packages/markdown-themeable-pdf) converts / prints / exports your markdown file simple and pretty to `PDF`, `HTML`, `JPEG` or `PNG` format.

The package was created at the beginning to help in the daily work with manuals for customers. Many people are not familiar with Markdown and they will now receive a well-formatted PDF from their developers. **Important here is that the document looks good and professional**. This [Atom package](https://atom.io/packages/markdown-themeable-pdf) tries to ask about this task.

> If you find this module **useful**, you find **errors**, or you have **suggestions** - please send me your [FEEDBACK](https://github.com/cakebake/markdown-themeable-pdf/issues/new) - feel free to **CONTRIBUTE**. Keep in mind that this plugin is under active development. :)

### Installation

Search in atom under **Settings View -> Install -> Packages** the package `markdown-themeable-pdf` and start the installation.

### Usage

The PDF can be generated in various ways:

-	Right-click in the editor area when a file is opened and select `Markdown Print/Convert` **or**
-	Right-click on a markdown file in Tree-View and select `Markdown Print/Convert` **or**
-	Press a shortcut in the editor area when a file is opened for
	-	convert to PDF: `ctrl-alt-p`
	-	convert to HTML: `ctrl-alt-h`
	-	convert to Image: `ctrl-alt-i` (jpeg or png defined in package settings)

#### Page breaks

You can start any time a new PDF page with typing snippet/shortcode `page-break` or insert the HTML-Code `<div class="page-break"></div>` in your markdown editor. So you can prevent such ugly breaks in lists or other contiguous areas.

#### Custom CSS

The package creates a CSS file `~/.atom/markdown-themeable-pdf/styles.css` in your atom configuration directory. You can use this file to customize everything. If you want to change the path, you can change it in the package settings. Alternatively, you can define with `project-path/markdown-themeable-pdf/styles.css` for each project its own CSS.

> Tip: Export your markdown as HTML to inspect it in your favorite browser. After CSS changes you must not restart atom.

### Examples

Conversion of [Demo.md](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.md) to

-	[Demo.pdf](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.pdf)
-	[Demo.html](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.html)
-	[Demo.jpeg](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.jpeg)

### Credits

Special thanks to [Atom](https://atom.io/) Team for this wonderful editor and ...

-	[charset-detector](https://ghub.io/charset-detector): ICU based port of charset detection
-	[cheerio](https://ghub.io/cheerio): Tiny, fast, and elegant implementation of core jQuery designed specifically for the server
-	[encoding](https://ghub.io/encoding): Convert encodings, uses iconv by default and fallbacks to iconv-lite if needed
-	[lodash](https://ghub.io/lodash): Lodash modular utilities.
-	[markdown-it](https://ghub.io/markdown-it): Markdown-it - modern pluggable markdown parser.
-	[markdown-it-checkbox](https://ghub.io/markdown-it-checkbox): Plugin to create checkboxes for markdown-it markdown parser
-	[markdown-it-emoji](https://ghub.io/markdown-it-emoji): Emoji plugin for markdown-it markdown parser.
-	[markdown-it-footnote](https://ghub.io/markdown-it-footnote): Footnotes for markdown-it markdown parser.
-	[markdown-it-highlightjs](https://ghub.io/markdown-it-highlightjs): Preset to use highlight.js with markdown-it.
-	[markdown-it-imsize](https://ghub.io/markdown-it-imsize): Markdown-it plugin to specify image size
-	[markdown-it-smartarrows](https://ghub.io/markdown-it-smartarrows): markdown-it plugin that adds &quot;smart arrows&quot; to markdown-it&#39;s typographic enhancements
-	[markdown-it-toc-and-anchor](https://ghub.io/markdown-it-toc-and-anchor): markdown-it plugin to add toc and anchor links in headings
-	[ncp](https://ghub.io/ncp): Asynchronous recursive file copy utility.
-	[puppeteer](https://ghub.io/puppeteer): A high-level API to control headless Chrome over the DevTools Protocol
-	[units-css](https://ghub.io/units-css): Parse length and angle CSS values and convert between units

### License

MIT
