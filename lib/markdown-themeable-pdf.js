var CompositeDisposable;

CompositeDisposable = require('atom').CompositeDisposable;

module.exports = {
    subscriptions: null,
    activate: function () {
        this.subscriptions = new CompositeDisposable();
        var fileExtensions = [
            'markdown',
            'md',
            'mdown',
            'mkd',
            'mkdown',
            'ron',
            'txt'
        ];
        for (var i = 0; i < fileExtensions.length; i++) {
            this.subscriptions.add(
                atom.commands.add(
                    'atom-pane[data-active-item-name$=\\.' + fileExtensions[i] + ']',
                    'markdown-themeable-pdf:export',
                    this.exportEditor.bind(this)
                )
            );
            this.subscriptions.add(
                atom.commands.add(
                    '.tree-view .file .name[data-name$=\\.' + fileExtensions[i] + ']',
                    'markdown-themeable-pdf:export',
                    this.exportFile.bind(this)
                )
            );
        }
        this.subscriptions.add(
            atom.commands.add(
                '.markdown-preview',
                'markdown-themeable-pdf:export',
                this.exportPreview.bind(this)
            )
        );
    },
    deactivate: function () {
        return this.subscriptions.dispose();
    },
    convertFile: function (filePath, encoding) {

        atom.notifications.addInfo('Start converting markdown ' + filePath);

        var fs = require('fs');

        var hljs = require('highlight.js');

        var md = require('markdown-it')({
            html: true,
            linkify: true,
            typographer: true,
            xhtmlOut: true,
            breaks: false,
            quotes: '“”‘’',
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (err) {
                        throw err;
                    }
                }
                try {
                    return hljs.highlightAuto(str).value;
                } catch (err) {
                    throw err;
                }
                return ''; // use external default escaping
            }
        });

        // innerWrap cells to avoid page break glitches
        md.renderer.rules.th_open  = function () {
            return '<th><div>';
        };
        md.renderer.rules.th_close = function () {
            return '</div></th>';
        };
        md.renderer.rules.td_open  = function () {
            return '<td><div>';
        };
        md.renderer.rules.td_close = function () {
            return '</div></td>';
        };

        var htmlToPdf = require('html-pdf');

        if (typeof encoding === 'undefined') {
            encoding = 'utf8';
        }

        fs.readFile(filePath, encoding, function (err, markdown) {

            if (err) {
                atom.notifications.addError('Could not read markdown file: ' + err.message);
                throw err;
            }

            try {
                var html = md.render(markdown);
            } catch (err) {
                throw err;
            }

            var documentStyle = fs.readFileSync(__dirname + "/../css/document.css", 'utf8');
            var codeStyle = fs.readFileSync(__dirname + "/../node_modules/highlight.js/styles/tomorrow.css", 'utf8');
            var dom =
                '<!doctype html>\n' +
                '<html>\n' +
                '   <head><meta charset="utf-8"><title>Document</title><style>' + codeStyle + '\n' + documentStyle + '</style></head>\n' +
                '   <body>' + html + '</body>\n' +
                '</html>\n';

            // fs.writeFile(filePath + '.html', dom, function (err) {
            //     if (err) {
            //         atom.notifications.addError('Could not write to HTML file: ' + err.message);
            //         throw err;
            //     }
            //
            //     atom.notifications.addSuccess('HTML was created in ' + filePath + '.html');
            // });

            htmlToPdf.create(dom, {
                format: 'A4',
                orientation: 'portrait',
                border: '1cm',
                type: 'pdf'
            }).toStream(function(err, stream) {

                if (err) {
                    atom.notifications.addError('Could not print the document: ' + err.message);
                    throw err;
                }

                var destFile = filePath + '.pdf';
                var dest = fs.createWriteStream(destFile);

                dest.on('error', function (err) {
                    if (err) {
                        atom.notifications.addError('Could not write to PDF file: ' + err.message);
                        throw err;
                    }
                });

                dest.on('finish', function () {
                    atom.notifications.addSuccess('PDF was created in ' + destFile);
                });

                stream.pipe(dest);
            });

        });
    },
    exportEditor: function (arg) {
        var editor;
        if ((editor = atom.workspace.getActiveTextEditor())) {
            if (editor.isEmpty()) {
                atom.notifications.addError('Current editor is empty');
                return console.error('Current editor is empty. Abort export action!');
            }
            if (editor.isModified()) {
                atom.notifications.addWarning('Any unsaved changes are ignored. Please save your changes before exporting!');
            }

            return this.convertFile(editor.getPath(), editor.getEncoding());
        }
    },
    exportFile: function (arg) {
        var filePath, target = arg.target;
        if ((filePath = target.dataset.path)) {
            return this.convertFile(filePath);
        }
    },
    exportPreview: function (arg) {
        var pane = atom.workspace.getActivePaneItem();

        if (typeof pane.filePath !== 'undefined') {
            return this.convertFile(pane.filePath);
        }
    }
};
