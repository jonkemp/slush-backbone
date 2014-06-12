/*
 * slush-backbone
 * https://github.com/jonkemp/slush-backbone
 *
 * Copyright (c) 2014, Jonathan Kemp
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _s = require('underscore.string'),
    inquirer = require('inquirer'),
    fs = require('fs'),
    path = require('path'),
    wiredep = require('wiredep'),
    addScript = require(__dirname + '/add-script');

function getAppName() {
    var appname;

    try {
        appname = require(path.join(process.cwd(), 'bower.json')).name;
    } catch (e) {
        try {
            appname = require(path.join(process.cwd(), 'package.json')).name;
        } catch (e) {}
    }

    if (!appname) {
        appname = path.basename(process.cwd());
    }

    return appname.replace(/[^\w\s]+?/g, ' ');
}

gulp.task('default', function (done) {
    gutil.log('Out of the box you get HTML5 Boilerplate, jQuery and Backbone.js to build your app.');

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'features',
            message: 'Which other options would you like to include?',
            choices: [{
                name: 'Sass',
                value: 'includeSass',
                checked: true
            }, {
                name: 'Bootstrap',
                value: 'includeBootstrap',
                checked: true
            }, {
                name: 'Modernizr',
                value: 'includeModernizr',
                checked: true
            }]
        }, {
            type: 'confirm',
            name: 'moveon',
            message: 'Continue?'
        }
    ],
    function (answers) {
        var features = answers.features,
            hasFeature = function (feat) {
                return features.indexOf(feat) !== -1;
            };

        if (!answers.moveon) {
            return done();
        }

        answers.appname = getAppName();
        answers.appNameSlug = _s.slugify(answers.appname);
        answers.classifyAppName = _s.classify(answers.appname);

        answers.includeSass = hasFeature('includeSass');
        answers.includeBootstrap = hasFeature('includeBootstrap');
        answers.includeModernizr = hasFeature('includeModernizr');

        gulp.src(__dirname + '/templates/**')
            .pipe(template(answers))
            .pipe(rename(function (file) {
                if (file.basename[0] === '_') {
                    file.basename = '.' + file.basename.slice(1);
                }
                if (answers.includeSass && file.extname === '.css') {
                    file.extname = '.scss';
                }
            }))
            .pipe(conflict('./'))
            .pipe(gulp.dest('./'))
            .pipe(install())
            .on('finish', function () {
                done();
            });

        process.on('exit', function () {
            var skipInstall = process.argv.slice(2).indexOf('--skip-install') >= 0;

            if (!skipInstall) {
                var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

                // wire Bower packages to .html
                wiredep({
                    bowerJson: bowerJson,
                    directory: 'app/bower_components',
                    src: 'app/index.html'
                });

                if (answers.includeSass) {
                    // wire Bower packages to .scss
                    wiredep({
                        bowerJson: bowerJson,
                        directory: 'app/bower_components',
                        src: 'app/styles/*.scss'
                    });
                }
            } else {
                gutil.log('After running `npm install & bower install`, inject your front end dependencies into');
                gutil.log('your HTML by running:');
                gutil.log('  gulp wiredep');
            }
        });
    });
});

gulp.task('model', function (done) {
    var appData = {};
    var modelName = gulp.args ? gulp.args[0] : 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyClassName = _s.classify(modelName);

    gulp.src(__dirname + '/models/index.js')
        .pipe(template(appData))
        .pipe(rename('/models/' + modelName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'))
        .on('finish', function () {
            done();
        });

    gulp.src('./app/index.html')
        .pipe(addScript('scripts/models/' + modelName + '.js'))
        .pipe(gulp.dest('./app'));
});

gulp.task('view', function (done) {
    var appData = {};
    var viewName = gulp.args ? gulp.args[0] : 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyClassName = _s.classify(viewName);

    gulp.src(__dirname + '/views/index.js')
        .pipe(template(appData))
        .pipe(rename('/views/' + viewName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'))
        .on('finish', function () {
            done();
        });

    gulp.src('./app/index.html')
        .pipe(addScript('scripts/views/' + viewName + '.js'))
        .pipe(gulp.dest('./app'));
});

gulp.task('collection', function (done) {
    var appData = {};
    var collectionName = gulp.args ? gulp.args[0] : 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyClassName = _s.classify(collectionName);

    gulp.src(__dirname + '/collections/index.js')
        .pipe(template(appData))
        .pipe(rename('/collections/' + collectionName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'))
        .on('finish', function () {
            done();
        });

    gulp.src('./app/index.html')
        .pipe(addScript('scripts/collections/' + collectionName + '.js'))
        .pipe(gulp.dest('./app'));
});

gulp.task('router', function (done) {
    var appData = {};
    var routerName = gulp.args ? gulp.args[0] : 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyClassName = _s.classify(routerName);

    gulp.src(__dirname + '/routes/index.js')
        .pipe(template(appData))
        .pipe(rename('/routes/' + routerName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'))
        .on('finish', function () {
            done();
        });

    gulp.src('./app/index.html')
        .pipe(addScript('scripts/routes/' + routerName + '.js'))
        .pipe(gulp.dest('./app'));
});

gulp.task('all', function (done) {
    var appData = {};
    var className = 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyClassName = _s.classify(className);

    var stream1 = gulp.src(__dirname + '/models/index.js')
        .pipe(rename('/models/' + className + '.js'));

    var stream2 = gulp.src(__dirname + '/views/index.js')
        .pipe(rename('/views/' + className + '.js'));

    var stream3 = gulp.src(__dirname + '/collections/index.js')
        .pipe(rename('/collections/' + className + '.js'));

    var stream4 = gulp.src(__dirname + '/routes/index.js')
        .pipe(rename('/routes/' + className + '.js'));

    var streams = [stream1, stream2, stream3, stream4];

    streams.forEach(function (stream) {
        stream.pipe(template(appData))
            .pipe(conflict('./'))
            .pipe(gulp.dest('./app/scripts'));
    });

    gulp.src('./app/index.html')
        .pipe(addScript([
            'scripts/models/' + className + '.js',
            'scripts/views/' + className + '.js',
            'scripts/collections/' + className + '.js',
            'scripts/routes/' + className + '.js'
        ]))
        .pipe(gulp.dest('./app'));

    process.on('exit', function () {
        done();
    });
});
