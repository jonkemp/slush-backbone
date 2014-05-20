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
    wiredep = require('wiredep');

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
            .pipe(install());

        process.on('exit', function () {
            var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));
            var skipInstall = process.argv.slice(2).indexOf('--skip-install') >= 0;

            if (!skipInstall) {
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

            done();
        });
    });
});

gulp.task('model', function (done) {
    var appData = {};
    var modelName = gulp.args[0] || 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyModelName = _s.classify(modelName);

    gulp.src(__dirname + '/models/index.js')
        .pipe(template(appData))
        .pipe(rename('/models/' + modelName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'));

    process.on('exit', function () {
        done();
    });
});

gulp.task('view', function (done) {
    var appData = {};
    var viewName = gulp.args[0] || 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyViewName = _s.classify(viewName);

    gulp.src(__dirname + '/views/index.js')
        .pipe(template(appData))
        .pipe(rename('/views/' + viewName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'));

    process.on('exit', function () {
        done();
    });
});

gulp.task('collection', function (done) {
    var appData = {};
    var collectionName = gulp.args[0] || 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyCollectionName = _s.classify(collectionName);

    gulp.src(__dirname + '/collections/index.js')
        .pipe(template(appData))
        .pipe(rename('/collections/' + collectionName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'));

    process.on('exit', function () {
        done();
    });
});

gulp.task('router', function (done) {
    var appData = {};
    var routerName = gulp.args[0] || 'application';

    appData.appname = getAppName();
    appData.appNameSlug = _s.slugify(appData.appname);
    appData.classifyAppName = _s.classify(appData.appname);
    appData.classifyRouterName = _s.classify(routerName);

    gulp.src(__dirname + '/routes/index.js')
        .pipe(template(appData))
        .pipe(rename('/routes/' + routerName + '.js'))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./app/scripts'));

    process.on('exit', function () {
        done();
    });
});

gulp.task('all', ['model', 'collection', 'router', 'view']);
