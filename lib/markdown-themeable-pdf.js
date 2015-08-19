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
    },
    deactivate: function () {
        return this.subscriptions.dispose();
    },
    convertFile: function (filePath, encoding) {

        var fs = require('fs');

        if (typeof encoding === 'undefined') {
            encoding = 'utf8';
        }

        fs.readFile(filePath, encoding, function (err, markdown) {

            if (err) {
                atom.notifications.addError('Could not read markdown file: ' + err.message);
                throw err;
            }

            var marked = require('marked');
            var renderer = new marked.Renderer();

            renderer.tablecell = function (content, flags) {
                return (flags.header) ?
                    '<th><div>' + content + '</div></th>' :
                    '<td><div>' + content + '</div></td>';
            };

            marked(markdown, {
                highlight: function (code, lang) {
                    return (typeof lang != 'undefined') ? require('highlight.js').highlightAuto(code).value : code;
                },
                renderer: renderer
            }, function (err, html) {
                if (err) {
                    atom.notifications.addError('Could not compile markdown content: ' + err.message);
                    throw err;
                }

                var htmlToPdf = require('html-pdf');
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
                }).toStream(function(err, stream){
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

        });
    },
    exportEditor: function () {
        var editor;
        if ((editor = atom.workspace.getActiveTextEditor())) {
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
    }
};
