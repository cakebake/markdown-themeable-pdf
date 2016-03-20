Themeable markdown converter (Print to PDF, HTML, JPEG or PNG)
==============================================================

[![Version](https://img.shields.io/apm/v/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/releases) [![Total Downloads](https://img.shields.io/apm/dm/markdown-themeable-pdf.svg)](https://atom.io/packages/markdown-themeable-pdf) [![License](https://img.shields.io/apm/l/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/blob/master/package.json#L14)
[![Dependencies](https://img.shields.io/david/cakebake/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/blob/master/package.json#L18)

##### This [Atom package](https://atom.io/packages/markdown-themeable-pdf) converts / prints / exports your markdown file simple and pretty to `PDF`, `HTML`, `JPEG` or `PNG` format.

The package was created at the beginning to help in the daily work with manuals for customers. Many people are not familiar with Markdown and they will now receive a well-formatted PDF from their developers. **Important here is that the document looks good and professional**. This [Atom package](https://atom.io/packages/markdown-themeable-pdf) tries to ask about this task.

> If you find this module **useful**, you find **errors**, or you have **suggestions** - please send me your [FEEDBACK](https://github.com/cakebake/markdown-themeable-pdf/issues/new) - feel free to **CONTRIBUTE**. Keep in mind that this plugin is under active development. :)

### Installation

Search in atom under **Settings View -> Install -> Packages** the package `markdown-themeable-pdf` and start the installation.

### Usage

The PDF can be generated in various ways:

-	Right-click in the editor area when a file is opened and select `Markdown to PDF` **or**
-	Right-click on a markdown file in Tree-View and select `Markdown to PDF` **or**
-	Press `ctrl-shift-E` (E = Export) in the editor area when a file is opened

#### Page breaks

You can start any time a new PDF page with typing Snippet/Shortcode `page-break` in your markdown editor. So you can prevent such ugly breaks in lists or other contiguous areas.

#### Custom CSS

The package creates a CSS file `~/.atom/markdown-themeable-pdf/styles.css` in your atom configuration directory. You can use this file to customize everything. If you want to change the path, you can change it in the package settings. Alternatively, you can define with `project-path/markdown-themeable-pdf/styles.css` for each project its own CSS.

> Tip: Export your markdown as HTML to inspect it in your favorite browser. After CSS changes you must not restart atom.

#### Custom header & Custom footer

The pdf document can be decorated with your own header and footer. This can be flexibly adapted to JavaScript files. Each of these files represents a node.js module, which returns an object with two required properties `height` and `contents`. After you have made any changes you need to reload or restart atom.

To customize the document header, open `~/.atom/markdown-themeable-pdf/header.js` (*you can change this path in the package settings*) and change it to your needs:

```javascript
// EXAMPLE
module.exports = function () {
    return {
        height: '2cm',
        contents: '<div style="text-align: right;"><span>Created by</span> <img src="logo.png" alt="Logo" /> <span style="color: #EC4634; font-size: 120%; text-transform: uppercase;">markdown-themeable-pdf</span></div>'
    };
};
```

To customize the document footer, open `~/.atom/markdown-themeable-pdf/footer.js` (*you can change this path in the package settings*) and change it to your needs:

```javascript
// EXAMPLE
module.exports = function () {
    var dateFormat = function () {
        return (new Date()).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return {
        height: '1cm',
        contents: '<div style="float:left;">Page {{page}}/{{pages}}</div><div style="float:right;">&copy; Copyright ' + dateFormat() + ' by COMPANYNAME</div>'
    };
};
```

> Tip: Alternatively, you can define with `project-path/markdown-themeable-pdf/header.js` or `project-path/markdown-themeable-pdf/footer.js` for each project its own header and footer.

### Example / Demo

See [Demo.pdf](https://github.com/cakebake/markdown-themeable-pdf/raw/master/tests/Demo.pdf) - the PDF version of [Demo.md](https://github.com/cakebake/markdown-themeable-pdf/raw/master/tests/Demo.md).

![DEMO](https://raw.githubusercontent.com/cakebake/markdown-themeable-pdf/master/DEMO.gif)

### Todo

-	Fix: Open Markdown Preview with `ctrl-shift-M`, right-click in markdown-preview area and select `Save As PDF`
-	Better handling of long code lines
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
