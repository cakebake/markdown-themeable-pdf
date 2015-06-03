{CompositeDisposable} = require 'atom'

module.exports = MarkdownThemeablePdf =
  subscriptions: null

  activate: ->
    @subscriptions = new CompositeDisposable

    exportEditor = @exportEditor.bind(this)
    @subscriptions.add atom.commands.add 'atom-pane[data-active-item-name$=\\.markdown]', 'markdown-themeable-pdf:export', exportEditor
    @subscriptions.add atom.commands.add 'atom-pane[data-active-item-name$=\\.md]', 'markdown-themeable-pdf:export', exportEditor
    @subscriptions.add atom.commands.add 'atom-pane[data-active-item-name$=\\.mdown]', 'markdown-themeable-pdf:export', exportEditor
    @subscriptions.add atom.commands.add 'atom-pane[data-active-item-name$=\\.mkd]', 'markdown-themeable-pdf:export', exportEditor
    @subscriptions.add atom.commands.add 'atom-pane[data-active-item-name$=\\.mkdown]', 'markdown-themeable-pdf:export', exportEditor
    @subscriptions.add atom.commands.add 'atom-pane[data-active-item-name$=\\.ron]', 'markdown-themeable-pdf:export', exportEditor
    @subscriptions.add atom.commands.add 'atom-pane[data-active-item-name$=\\.txt]', 'markdown-themeable-pdf:export', exportEditor

    exportFile = @exportFile.bind(this)
    @subscriptions.add atom.commands.add '.tree-view .file .name[data-name$=\\.markdown]', 'markdown-themeable-pdf:export', exportFile
    @subscriptions.add atom.commands.add '.tree-view .file .name[data-name$=\\.md]', 'markdown-themeable-pdf:export', exportFile
    @subscriptions.add atom.commands.add '.tree-view .file .name[data-name$=\\.mdown]', 'markdown-themeable-pdf:export', exportFile
    @subscriptions.add atom.commands.add '.tree-view .file .name[data-name$=\\.mkd]', 'markdown-themeable-pdf:export', exportFile
    @subscriptions.add atom.commands.add '.tree-view .file .name[data-name$=\\.mkdown]', 'markdown-themeable-pdf:export', exportFile
    @subscriptions.add atom.commands.add '.tree-view .file .name[data-name$=\\.ron]', 'markdown-themeable-pdf:export', exportFile
    @subscriptions.add atom.commands.add '.tree-view .file .name[data-name$=\\.txt]', 'markdown-themeable-pdf:export', exportFile

  deactivate: ->
    @subscriptions.dispose()

  convertFile: (filePath) ->
    console.log filePath

  exportEditor: ({target}) ->
    if editor = atom.workspace.getActiveTextEditor()
      @convertFile editor.getPath()

  exportFile: ({target}) ->
    if filePath = target.dataset.path
      @convertFile filePath
