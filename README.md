Themeable markdown converter (Print to PDF, HTML, JPEG or PNG)
==============================================================

##### This [Atom package](https://atom.io/packages/markdown-themeable-pdf) converts / prints / exports your markdown file simple and pretty to `PDF`, `HTML`, `JPEG` or `PNG` format.

The package was created at the beginning to help in the daily work with manuals for customers. Many people are not familiar with Markdown and they will now receive a well-formatted PDF from their developers. **Important here is that the document looks good and professional**. This [Atom package](https://atom.io/packages/markdown-themeable-pdf) tries to ask about this task.

> If you find this module **useful**, you find **errors**, or you have **suggestions** - please send me your [FEEDBACK](https://github.com/cakebake/markdown-themeable-pdf/issues/new) - feel free to **CONTRIBUTE**. Keep in mind that this plugin is under active development. :)

### Installation

Search in atom under **Settings View -> Install -> Packages** the package `markdown-themeable-pdf` and start the installation.

### Usage

The PDF can be generated in various ways:

-	Right-click in the editor area when a file is opened (and saved) and select `Markdown to PDF` **or**
-	Press `ctrl-shift-E` (E = Export) in the editor area when a file is opened (and saved)

#### Page breaks

You can start any time a new page with typing Snippet/Shortcode `page-break` in your markdown editor.

#### Custom CSS

The package creates a CSS file `~/.atom/markdown-themeable-pdf/styles.css` in your atom configuration directory. You can use this file to customize everything. If you want to change the path, you can change it in the package settings.

### Example / Demo

See [Demo.pdf](https://github.com/cakebake/markdown-themeable-pdf/raw/master/tests/Demo.pdf) - the PDF version of [Demo.md](https://github.com/cakebake/markdown-themeable-pdf/raw/master/tests/Demo.md).

![DEMO](https://raw.githubusercontent.com/cakebake/markdown-themeable-pdf/master/DEMO.gif)

### Todo

-	Fix: Open Markdown Preview with `ctrl-shift-M`, right-click in markdown-preview area and select `Save As PDF`
-	Custom header and footer
-	Font Awesome integration
-	Emojis
-	Inline Links (Anchors)

### Known Issues

-	**Table header glitches when a table starts directly on a new page**

	When that happens, you can put in your markdown in front of the table an html code `<div class="page-break" />` to prevent this.

### Credits

Special thanks to ...

-	[Atom](https://atom.io/) for this wonderful editor!
-	[markdown-it/markdown-it](https://github.com/markdown-it/markdown-it) - Markdown parser, done right.
-	[marcbachmann/node-html-pdf](https://github.com/marcbachmann/node-html-pdf) - Html to pdf converter in nodejs.
-	[isagalaev/highlight.js](https://github.com/isagalaev/highlight.js) - Javascript syntax highlighter.
