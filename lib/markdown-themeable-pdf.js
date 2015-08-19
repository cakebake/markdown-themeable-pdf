var CompositeDisposable;

CompositeDisposable = require('atom').CompositeDisposable;

module.exports = {
    subscriptions: null,
    activate: function () {
        this.subscriptions = new CompositeDisposable;
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
    },
    deactivate: function () {
        return this.subscriptions.dispose();
    },
    convertFile: function (filePath) {

        var fs = require('fs');

        fs.readFile(filePath, 'utf8', function (err, markdown) {

            if (err) {
                atom.notifications.addError('Could not read markdown file: ' + err.message);
                throw err;
            }

            var marked = require('marked');

            marked(markdown, {
                highlight: function (code, lang) {
                    return (typeof lang != 'undefined') ? require('highlight.js').highlightAuto(code).value : code;
                }
            }, function (err, html) {
                if (err) {
                    atom.notifications.addError('Could not compile markdown content: ' + err.message);
                    throw err;
                }

                var htmlToPdf = require('phantom-html-to-pdf')();
                var documentStyle = fs.readFileSync(__dirname + "/../css/document.css", 'utf8');
                var codeStyle = fs.readFileSync(__dirname + "/../node_modules/highlight.js/styles/tomorrow.css", 'utf8');
                var document =
                    '<!doctype html>\n' +
                    '<html>\n' +
                    '   <head><meta charset="utf-8"><title>Document</title><style>' + codeStyle + '\n' + documentStyle + '</style></head>\n' +
                    '   <body>' + html + '</body>\n' +
                    '</html>\n';

                htmlToPdf({
                    html: document,
                    printDelay: 500
                }, function(err, pdf) {
                    var dest = fs.createWriteStream(filePath + '.pdf');
                    dest.on('error', function (err) {
                        if (err) {
                            atom.notifications.addError('Could not write to PDF file: ' + err.message);
                            throw err;
                        }
                    });
                    dest.on('finish', function () {
                        atom.notifications.addSuccess('PDF was created in the same directory.');
                    });
                    pdf.stream.pipe(dest);
                });

            });

        });
    },
    exportEditor: function () {
        var editor;
        if (editor = atom.workspace.getActiveTextEditor()) {
            return this.convertFile(editor.getPath());
        }
    },
    exportFile: function (arg) {
        var filePath, target = arg.target;
        if (filePath = target.dataset.path) {
            return this.convertFile(filePath);
        }
    }
};
