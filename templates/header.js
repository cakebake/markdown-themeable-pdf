/**
 * Your markdown-themeable-pdf custom header.
 * After you have made any changes you need to reload or restart atom.
 *
 * The default file can be found in the folder ~/.atom/packages/markdown-themeable-pdf/templates
 *
 * @returns {{height: string, contents: string}}
 */
module.exports = function () {
    return {
        height: '2cm',
        contents: '<div style="text-align: right;">Created by <span style="color: #EC4634; font-size: 120%; text-transform: uppercase;">markdown-themeable-pdf</span></div>'
    };
};
