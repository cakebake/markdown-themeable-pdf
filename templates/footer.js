/**
 * Your markdown-themeable-pdf custom footer.
 * After you have made any changes you need to reload or restart atom.
 *
 * The default file can be found in the folder ~/.atom/packages/markdown-themeable-pdf/templates
 *
 * @returns {{height: string, contents: string}}
 */
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
