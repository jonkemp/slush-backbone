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

        var endbuild = '<!-- endbuild -->';
        var scriptTag = ['<script src="' + filepath + '"></script>'];
        var source = file.contents.toString();

        // check if scriptTag is already in the body text
        var re = new RegExp(scriptTag.map(function (line) {
            return '\s*' + line.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        })
        .join('\n'));

        if (re.test(source)) {
            return source;
        }

        var lines = source.split('\n');

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

        lines.splice(otherwiseLineIndex, 0, scriptTag.map(function (line) {
            return spaceStr + line;
        }).join('\n'));

        file.contents = new Buffer(lines.join('\n'));

        this.push(file);

        cb();
    });
};