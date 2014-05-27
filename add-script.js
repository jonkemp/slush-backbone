'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');

module.exports = function (filepath) {
    return through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-useref', 'Streaming not supported'));
            return cb();
        }

        var linefeed = /\r\n/g.test(file.contents) ? '\r\n' : '\n';
        var endbuild = '<!-- endbuild -->';
        var scriptTags = [];
        var source = file.contents.toString();
        if (Array.isArray(filepath)) {
            filepath.forEach(function (asset) {
                scriptTags.push('<script src="' + asset + '"></script>');
            });
        } else if (typeof filepath === 'string') {
            scriptTags.push('<script src="' + filepath + '"></script>');
        }

        // check if scriptTag is already in the body text
        var re = new RegExp(scriptTags.map(function (line) {
            return '\s*' + line.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        })
        .join(linefeed));

        if (re.test(source)) {
            return source;
        }

        var lines = source.split(linefeed);

        var otherwiseLineIndex = 0;
        lines.forEach(function (line, i) {
            if (line.indexOf(endbuild) !== -1) {
                otherwiseLineIndex = i;
            }
        });

        var spaces = 0;
        while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
            spaces += 1;
        }

        var spaceStr = '';
        while ((spaces -= 1) >= 0) {
            spaceStr += ' ';
        }

        lines.splice(otherwiseLineIndex, 0, scriptTags.map(function (line) {
            return spaceStr + line;
        }).join(linefeed));

        file.contents = new Buffer(lines.join(linefeed));

        this.push(file);

        cb();
    });
};