Markdown Converter
==============================================================

[![Version](https://img.shields.io/apm/v/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/releases) [![Total Downloads](https://img.shields.io/apm/dm/markdown-themeable-pdf.svg)](https://atom.io/packages/markdown-themeable-pdf) [![Build Status](https://travis-ci.org/cakebake/markdown-themeable-pdf.svg?branch=rewrite)](https://travis-ci.org/cakebake/markdown-themeable-pdf) [![Build status](https://ci.appveyor.com/api/projects/status/3wglnf4du2teyn33/branch/rewrite?svg=true)](https://ci.appveyor.com/project/cakebake/markdown-themeable-pdf/branch/rewrite) [![Dependencies](https://img.shields.io/david/cakebake/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/blob/rewrite/package.json) [![License](https://img.shields.io/apm/l/markdown-themeable-pdf.svg)](https://github.com/cakebake/markdown-themeable-pdf/blob/rewrite/LICENSE.md) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-yellow.svg)](http://standardjs.com)

#### This [Atom package](https://atom.io/packages/markdown-themeable-pdf) converts / prints / exports your markdown file simple and pretty to `PDF`, `HTML`, `JPEG` or `PNG` format.

The package was created at the beginning to help in the daily work with manuals for customers. Many people are not familiar with Markdown and they will now receive a well-formatted PDF from their developers. **Important here is that the document looks good and professional**.

## Examples

Conversion of [Demo.md](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.md) to
[PDF](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.pdf),
[HTML](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.html),
[JPEG](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.jpeg) and
[PNG](https://github.com/cakebake/markdown-themeable-pdf/raw/rewrite/spec/markdown/Demo.png)

## Installation

Search in atom under **Settings View -> Install -> Packages** the package `markdown-themeable-pdf` and start the installation.

## Configuration

...

## Usage

The PDF can be generated in various ways:

-	Right-click in the editor area when a file is opened and select `Markdown Print/Convert` **or**
-	Right-click on a markdown file in Tree-View and select `Markdown Print/Convert` **or**
-	Press a shortcut in the editor area when a file is opened for
	-	convert to PDF: `ctrl-alt-p`
	-	convert to HTML: `ctrl-alt-h`
	-	convert to Image: `ctrl-alt-i` (jpeg or png defined in package settings)

### Page breaks

You can start any time a new PDF page with typing snippet/shortcode `page-break` or insert the HTML-Code `<div class="page-break"></div>` in your markdown editor. So you can prevent such ugly breaks in lists or other contiguous areas.

### Custom CSS

The package creates a CSS file `~/.atom/markdown-themeable-pdf/styles.css` in your atom configuration directory. You can use this file to customize everything. If you want to change the path, you can change it in the package settings. Alternatively, you can define with `project-path/markdown-themeable-pdf/styles.css` for each project its own CSS.

> Tip: Export your markdown as HTML to inspect it in your favorite browser. After CSS changes you must not restart atom.

## Contribute

Please do contribute! Issues and pull requests are welcome.

If you find this package useful, find errors, or have suggestions - please send me your [feedback on GitHub](https://github.com/cakebake/markdown-themeable-pdf/issues/new) - feel free to contribute. To develop the plugin, [start here](https://github.com/cakebake/markdown-themeable-pdf/blob/rewrite/CONTRIBUTING.md).

Thank you for your help improving this software!

## License

[The MIT License (MIT)](https://github.com/cakebake/markdown-themeable-pdf/blob/rewrite/LICENSE.md)
