/* jshint node: true */
/* global describe, it */
'use strict';
var should = require('should');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var addScript = require('../add-script');

function getFile(filePath) {
    return new gutil.File({
        path:     filePath,
        cwd:      './test/',
        base:     path.dirname(filePath),
        contents: fs.readFileSync(filePath)
    });
}

function getFixture(filePath) {
    return getFile(path.join('test', 'fixtures', filePath));
}

function getExpected(filePath) {
    return getFile(path.join('test', 'expected', filePath));
}

function compare(name, expectedName, filepath, done) {
    var stream = addScript(filepath);

    stream.on('data', function(newFile) {
        if (path.basename(newFile.path) === name) {
            should(String(getExpected(expectedName).contents)).eql(String(newFile.contents));
        }
    });

    stream.on('end', function() {
        done();
    });

    stream.write(getFixture(name));

    stream.end();
}

describe('addScript()', function() {
    it('file should pass through', function(done) {
        var a = 0;

        var fakeFile = new gutil.File({
            path: './test/fixture/file.html',
            cwd: './test/',
            base: './test/fixture/',
            contents: new Buffer('<html></html>')
        });

        var stream = addScript('');
        stream.on('data', function(newFile){
            should.exist(newFile.contents);
            newFile.path.should.equal('./test/fixture/file.html');
            newFile.relative.should.equal('file.html');
            ++a;
        });

        stream.once('end', function () {
            a.should.equal(1);
            done();
        });

        stream.write(fakeFile);
        stream.end();
    });

    it('should append a script tag to the inlcuded build block with the supplied path', function(done) {
        compare('01.html', '01.html', 'scripts/models/application.js', done);
    });
});