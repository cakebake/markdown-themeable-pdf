var CompositeDisposable = require('atom').CompositeDisposable;
var fs = require('fs');
var url = require('url');
var path = require('path');

module.exports = markdownThemeablePdf = {
    config: {
        exportFileType: {
            type: 'string',
            default: 'pdf',
            enum: ['html', 'pdf', 'jpeg', 'png'],
            order: 10
        },
        format: {
            title: 'Papersize Format',
            type: 'string',
            default: 'A4',
            enum: ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'],
            description: 'Available only for export as pdf, jpg, png.',
            order: 20
        },
        // @todo add hljs class to pre > code blocks with no language definition
        // codeHighlightingAuto: {
        //     title: 'Try to highlight code blocks with no language definition',
        //     type: 'boolean',
        //     default: true
        // },
        pageBorder: {
            title: 'Page border size',
            type: 'string',
            default: '1cm',
            description: 'Allowed units: mm, cm, in, px. Available only for export as pdf, jpg, png.',
            order: 30
        },
        orientation: {
            title: 'Papersize Orientation',
            type: 'string',
            default: 'portrait',
            enum: ['portrait', 'landscape'],
            description: 'Available only for export as pdf, jpg, png.',
            order: 40
        },
        imageQuality: {
            title: 'Image quality',
            type: 'integer',
            default: 90,
            description: 'Available only for export as jpg, png.',
            order: 50
        },
        enableSmartArrows: {
            type: 'boolean',
            default: true,
            description: 'Beautification for arrows like \'-->\' or \'==>\'.',
            order: 60
        },
        enableCheckboxes: {
            title: 'Enable task lists',
            type: 'boolean',
            default: true,
            description: 'Replacement for \'[ ]\' and \'[x]\' in markdown source.',
            order: 70
        },
        enableHtmlInMarkdown: {
            title: 'Enable HTML tags in markdown source',
            type: 'boolean',
            default: true,
            description: 'Required for \'&lt;div class=&quot;page-break&quot;&gt;&lt;/div&gt;\'!',
            order: 80
        },
        enableLinkify: {
            title: 'Autoconvert URL-like text to links',
            type: 'boolean',
            default: false,
            order: 90
        },
        enableTypographer: {
            title: 'Enable Typographer',
            type: 'boolean',
            default: true,
            description: 'Some language-neutral replacement + quotes beautification.',
            order: 100
        },
        smartQuotes: {
            title: 'Quotes beautification replacement',
            type: 'string',
            default: '""\'\'',
            description: 'Double + single quotes replacement pairs, when typographer enabled.',
            order: 110
        },
        enableXHTML: {
            title: 'Use \'/\' to close single tags',
            type: 'boolean',
            default: false,
            description: 'Eg. \'&lt;br /&gt;\' or \'&lt;img /&gt;\'.',
            order: 120
        },
        enableBreaks: {
            title: 'Convert new lines',
            type: 'boolean',
            default: false,
            description: 'Convert new lines (\'\\n\') in paragraphs into \'&lt;br&gt;\'.',
            order: 130
        },
        preWrap: {
            title: 'Break long code lines',
            type: 'boolean',
            default: true,
            description: 'Text inside code blocks will wrap when necessary, and on line breaks.',
            order: 135
        },
        codeHighlightingTheme: {
            type: 'string',
            default: 'github-gist.css',
            enum: (function () {
                var files = fs.readdirSync(path.resolve(__dirname, '../node_modules/highlight.js/styles'));
                for (var i = 0; i < files.length; i++) {
                    if (path.extname(files[i]) != '.css') {
                        files.splice(i, 1);
                    }
                }
                return files;
            })(),
            description: 'Theme preview: https://highlightjs.org/static/demo/',
            order: 140
        },
        customStylesPath: {
            type: 'string',
            default: path.join('markdown-themeable-pdf', 'styles.css'),
            description: 'You can use this stylesheet file to customize everything. The path is relative to Atom config directory <code>' + atom.config.configDirPath + '</code>. This relative path can also be used inside each project.',
            order: 150
        },
        enableCustomHeader: {
            type: 'boolean',
            default: true,
            order: 160
        },
        customHeaderPath: {
            type: 'string',
            default: path.join('markdown-themeable-pdf', 'header.js'),
            description: 'You can use this javascript file to customize the document header. The path is relative to Atom config directory <code>' + atom.config.configDirPath + '</code>. This relative path can also be used inside each project.',
            order: 170
        },
        enableCustomFooter: {
            type: 'boolean',
            default: true,
            order: 180
        },
        customFooterPath: {
            type: 'string',
            default: path.join('markdown-themeable-pdf', 'footer.js'),
            description: 'You can use this javascript file to customize the document footer. The path is relative to Atom config directory <code>' + atom.config.configDirPath + '</code>. This relative path can also be used inside each project.',
            order: 190
        },
        openPdfInAtomWorkspace: {
            type: 'boolean',
            default: true,
            description: 'Open PDF inside Atom with <a href="https://atom.io/packages/pdf-view">pdf-view</a> package.',
            order: 200
        },
		customGenerationFolder: {
            type: 'string',
            default: '',
            description: 'Folder at the root of your project, in which the generated files will be stored. Keep empty to generate in the same directory as the source file.',
            order: 210
        }
    },
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

        var ncp = require('ncp').ncp;
        var customTemplatesPath = path.resolve(atom.config.configDirPath, 'markdown-themeable-pdf');
        var customTemplatesSource = path.resolve(__dirname, '../markdown-themeable-pdf');
        ncp(customTemplatesSource, customTemplatesPath, {clobber: false}, function (err) {
            if (!err)
                return;

            atom.notifications.addError('Custom templates coul not created at ' + customTemplatesPath + '. Please copy the files manualy from ' + customTemplatesSource);
            return console.error(err);
        });

        this.subscriptions.add(
            atom.workspace.observeTextEditors(function(editor) {
                var regex = new RegExp('^<div class="page-break"></div>$', 'g');
                editor.onDidStopChanging(function() {
                    editor.scan(regex, function (res) {
                        editor.decorateMarker(editor.markBufferRange(res.range, {
                            invalidate: 'touch'
                        }), {
                            type: 'line',
                            class: 'markdown-themeable-pdf-page-break'
                        });
                    });
                });
            })
        );
    },
    deactivate: function () {
        return this.subscriptions.dispose();
    },
    convertFile: function (filePath, encoding) {
        var fileInfo = path.parse(filePath);

        atom.notifications.addInfo('Start converting ' + fileInfo.base);

        var exportType = atom.config.get('markdown-themeable-pdf.exportFileType');
        var destFileBase = fileInfo.name + '.' + exportType;
        var destFile = this.getGeneratedFullPath(fileInfo.dir, destFileBase);
        var hljs = require('highlight.js');
        var cheerio = require('cheerio');

        var md = require('markdown-it')({
            html: atom.config.get('markdown-themeable-pdf.enableHtmlInMarkdown'),
            linkify: atom.config.get('markdown-themeable-pdf.enableLinkify'),
            typographer: atom.config.get('markdown-themeable-pdf.enableLinkify'),
            xhtmlOut: atom.config.get('markdown-themeable-pdf.enableXHTML'),
            breaks: atom.config.get('markdown-themeable-pdf.enableBreaks'),
            quotes: atom.config.get('markdown-themeable-pdf.smartQuotes'),
            langPrefix: 'hljs ' + atom.config.get('markdown-themeable-pdf.codeHighlightingTheme').replace(/\./g, '-') + ' ',
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (err) {
                        throw err;
                    }
                }
                // if (atom.config.get('markdown-themeable-pdf.codeHighlightingAuto')) {
                //     try {
                //         return hljs.highlightAuto(str).value;
                //     } catch (err) {
                //         throw err;
                //     }
                // }
                return ''; // use external default escaping
            }
        });

        // size-specified image markups
        md.use(require('markdown-it-imsize'), {
            autofill: false
        });

        // checkboxes
        if (atom.config.get('markdown-themeable-pdf.enableCheckboxes')) {
            md.use(require('markdown-it-checkbox'), {
                divWrap: false,
                divClass: 'checkbox',
                idPrefix: 'checkbox-'
            });
        }

        // smart arrows
        if (atom.config.get('markdown-themeable-pdf.enableSmartArrows')) {
            md.use(require('markdown-it-smartarrows'));
        }

        // fix src scheme
        if (exportType != 'html') {
            md.renderer.rules.image = function (tokens, idx, options, env, self) {
                var token = tokens[idx];
                var src = token.attrs[token.attrIndex('src')][1];

                token.attrs[token.attrIndex('src')][1] = markdownThemeablePdf.resolveImgSrc(src, fileInfo.dir);

                return self.renderToken.apply(self, arguments);
            };
            md.renderer.rules.html_block = function (tokens, idx) {
                var $ = cheerio.load(tokens[idx].content);

                $('img').each(function () {
                    $(this).attr('src',  markdownThemeablePdf.resolveImgSrc($(this).attr('src'), fileInfo.dir));
                });

                return tokens[idx].content = $.html();
            };
        }

        // innerWrap cells to avoid page break glitches
        if (exportType != 'html') {
            md.renderer.rules.th_open = function () {
                return '<th><div>';
            };
            md.renderer.rules.th_close = function () {
                return '</div></th>';
            };
            md.renderer.rules.td_open = function () {
                return '<td><div>';
            };
            md.renderer.rules.td_close = function () {
                return '</div></td>';
            };
        }

        if (typeof encoding === 'undefined') {
            encoding = atom.config.get('core.fileEncoding');
        }

        fs.readFile(filePath, encoding, function (err, markdown) {

            if (err) {
                atom.notifications.addError('Could not read ' + fileInfo.base + ': ' + err.message);
                throw err;
            }

            try {
                var html = md.render(markdown);
            } catch (err) {
                throw err;
            }

            var cssFile, cssStyles = '';
            cssFile = path.resolve(__dirname, '../css/document.css');
            try {
                cssStyles += fs.readFileSync(cssFile, encoding) + '\n';
            } catch (err) {
                atom.notifications.addWarning('Stylesheet ' + cssFile + ' not found');
                console.error(err);
            }
            cssFile = markdownThemeablePdf.getConfigFilePath(atom.config.get('markdown-themeable-pdf.customStylesPath'), filePath);
            try {
                cssStyles += fs.readFileSync(cssFile, encoding) + '\n';
            } catch (err) {
                atom.notifications.addWarning('Stylesheet ' + cssFile + ' not found');
                console.error(err);
            }
            cssFile = path.resolve(__dirname, '../node_modules/highlight.js/styles', atom.config.get('markdown-themeable-pdf.codeHighlightingTheme'));
            try {
                cssStyles += fs.readFileSync(cssFile, encoding) + '\n';
            } catch (err) {
                atom.notifications.addWarning('Stylesheet ' + cssFile + ' not found');
                console.error(err);
            }

            if (atom.config.get('markdown-themeable-pdf.preWrap')) {
                cssStyles += 'pre { white-space: pre-wrap !important; word-break: break-word !important; overflow: hidden !important;}';
            }

            var customHeader = (function () {
                if (!atom.config.get('markdown-themeable-pdf.enableCustomHeader') || exportType == 'html')
                    return {
                        height: '0cm',
                        html: ''
                    };

                var setting = markdownThemeablePdf.getConfigFilePath(atom.config.get('markdown-themeable-pdf.customHeaderPath'), filePath);
                try {
                    var obj = require(setting)();

                    if (typeof obj !== 'object' ||
                        typeof obj.height === 'undefined' ||
                        typeof obj.contents === 'undefined') {

                        return {
                            height: '0cm',
                            html: ''
                        };
                    }

                    var $ = cheerio.load(obj.contents);
                    var dir = path.dirname(setting);

                    $('img').each(function () {
                        $(this).attr('src',  markdownThemeablePdf.resolveImgSrc($(this).attr('src'), dir));
                    });

                    return {
                        height: obj.height,
                        html: '<header id="pageHeader" class="meta">\n' + $.html() + '\n</header>\n'
                    };
                } catch (err) {
                    atom.notifications.addWarning('Could not process custom header ' + setting);
                    console.error(err);
                    return;
                }
            })();
            var customFooter = (function () {
                if (!atom.config.get('markdown-themeable-pdf.enableCustomFooter') || exportType == 'html')
                    return {
                        height: '0cm',
                        html: ''
                    };

                var setting = markdownThemeablePdf.getConfigFilePath(atom.config.get('markdown-themeable-pdf.customFooterPath'), filePath);
                try {
                    var obj = require(setting)();

                    if (typeof obj !== 'object' ||
                        typeof obj.height === 'undefined' ||
                        typeof obj.contents === 'undefined') {

                        return {
                            height: '0cm',
                            html: ''
                        };
                    }

                    var $ = cheerio.load(obj.contents);
                    var dir = path.dirname(setting);

                    $('img').each(function () {
                        $(this).attr('src',  markdownThemeablePdf.resolveImgSrc($(this).attr('src'), dir));
                    });

                    return {
                        height: obj.height,
                        html: '<footer id="pageFooter" class="meta">\n' + $.html() + '\n</footer>\n'
                    };
                } catch (err) {
                    atom.notifications.addWarning('Could not process custom footer ' + setting);
                    console.error(err);
                    return;
                }
            })();

            var dom = '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n<meta charset="UTF-8">\n<title>' + destFileBase + '</title>\n<style>\n' + cssStyles + '\n</style>\n</head>\n' +
                '<body>\n' + customHeader.html + '<div id="pageContent">\n' + html + '\n</div>' + customFooter.html + '</body>\n' +
                '</html>\n';

            if (exportType == 'html') {
                fs.writeFile(destFile, dom, function (err) {
                    if (err) {
                        atom.notifications.addError('Could not write to ' + destFileBase + ': ' + err.message);
                        throw err;
                    }

                    atom.notifications.addSuccess('File ' + destFileBase + ' was created in the same directory');
                });
            } else {
                var htmlToPdf = require('html-pdf');
                htmlToPdf.create(dom, {
                    format: atom.config.get('markdown-themeable-pdf.format'),
                    orientation: atom.config.get('markdown-themeable-pdf.orientation'),
                    border: atom.config.get('markdown-themeable-pdf.pageBorder'),
                    type: exportType,
                    quality: atom.config.get('markdown-themeable-pdf.imageQuality'),
                    header: customHeader,
                    footer: customFooter
                }).toStream(function (err, stream) {
                    if (err) {
                        atom.notifications.addError(err.message);
                        throw err;
                    }
                    try {
                        var dest = fs.createWriteStream(destFile);
                        dest.on('error', function (err) {
                            if (err) {
                                atom.notifications.addError('Could not write to ' + destFileBase + ': ' + err.message);
                                throw err;
                            }
                        });
                        dest.on('finish', function () {
                            atom.notifications.addSuccess('File ' + destFileBase + ' was created in the same directory');
                            if (atom.config.get('markdown-themeable-pdf.openPdfInAtomWorkspace')) {
                                setTimeout(function () {
                                    if (exportType == 'pdf' && !atom.packages.isPackageLoaded("pdf-view")) {
                                        atom.notifications.addWarning('Could not open ' + destFileBase + ' file for preview. Please install/activate "pdf-view" package.');
                                    } else {
                                        atom.workspace.open(destFile, {searchAllPanes: true});
                                    }
                                }, 666);
                            }
                        });
                        stream.pipe(dest);
                    } catch (err) {
                        throw err;
                    }
                });
            }

        });
    },
    exportEditor: function (arg) {
        var editor;
        if ((editor = atom.workspace.getActiveTextEditor())) {
            if (editor.isEmpty()) {
                atom.notifications.addError('Current editor is empty');
                return console.error('Current editor is empty. Abort.');
            }
            if (editor.isModified()) {
                atom.notifications.addWarning('Any unsaved changes are ignored. Please save your changes before exporting.');
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
    },
    /**
     * Resolve image source to absolute path url
     *
     * @param  {string} src Image source path
     * @param  {string} to  Absolute path to document
     * @return {string}     Image source url
     */
    resolveImgSrc: function (src, to) {
        if (url.parse(src).protocol || path.resolve(src) == src)
            return src;

        return ('file:///' + path.resolve(to, src)).replace(/\\/g, '/');
    },
    /**
     * Get config file path 
     *
     * @param  {string} relativePath Relative path to config file
     * @param  {string} filePath     Path to current file
     * @return {string}              Absolute path to config file
     */
    getConfigFilePath: function (relativePath, filePath) {
        var project = path.join(markdownThemeablePdf.getCurrentBasePath(filePath), relativePath);

        if (fs.existsSync(project))
            return project;

        var global = path.join(atom.config.configDirPath, relativePath);
        console.log('markdown-themeable-pdf: No custom config file found in ' + project + '. Trying to use global configuration ' + global + '.');

        return path.join(atom.config.configDirPath, relativePath);
    },
    /**
     * Get current project path of file
     *
     * @param  {string} filePath Absolute file path
     * @return {string}          Absolute base path of file
     */
    getCurrentBasePath: function (filePath) {
        var projectPaths = atom.project.getPaths();
        var currentBasePath = null;

        for (var i = 0; i < projectPaths.length; i++) {
            if (filePath.startsWith(projectPaths[i] + path.sep)) {
                currentBasePath = projectPaths[i];
            }
        }

        if (currentBasePath == null) {
            currentBasePath = projectPaths[0];
        }

        return currentBasePath;
    },
	/**
     * Get absolute path of a generated file
     *
     * @param  {string} sourceDirectory   Absolute path of source file
	 * @param  {string} generatedFilename Name of the file being generated
     * @return {string}                   Absolute path of generated file
     */
	getGeneratedFullPath: function (sourceDirectory, generatedFilename) {
		var generatedPath = '';
		var generationFolder = atom.config.get('markdown-themeable-pdf.customGenerationFolder');
		if (generationFolder.length > 0) {
			var rootDirectory = markdownThemeablePdf.getCurrentBasePath(sourceDirectory);
			var fullGenerationFolder = path.join(rootDirectory, generationFolder);
			
			fs.mkdir(fullGenerationFolder);
			generatedPath = path.resolve(fullGenerationFolder, generatedFilename);
		} else {
			generatedPath = path.resolve(sourceDirectory, generatedFilename);
		}
		
		return generatedPath;
	}
};
