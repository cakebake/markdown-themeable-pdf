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
        var markdownpdf, options;
        markdownpdf = require("markdown-pdf");
        options = {
            paperBorder: '2cm',
            paperOrientation: 'portrait',
            paperFormat: 'A4',
            highlightCssPath: __dirname + "/../node_modules/markdown-pdf/node_modules/highlight.js/styles/github.css",
            cssPath: __dirname + "/../css/document.css",
            remarkable: {
                html: true,
                xhtmlOut: true,
                linkify: true
            }
        };
        return markdownpdf(options).from(filePath).to(filePath + '.pdf', function () {
            atom.notifications.addSuccess('PDF was created in the same directory');
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