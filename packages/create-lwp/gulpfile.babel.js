import gulp from 'gulp';
import gulpIf from 'gulp-if';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import friendlyFormatter from 'eslint-friendly-formatter';
import gulpEslint from 'gulp-eslint';
import flow from 'gulp-flowtype';
import gulpFlowtype from 'gulp-flowtype';
import { Server } from 'karma';
import { argv } from 'yargs';

import { WEBPACK_CONFIG_MAJOR, WEBPACK_CONFIG_MAJOR_MIN } from './webpack.conf';

gulp.task('test', [ 'lint', 'karma', 'typecheck' ]);
gulp.task('build', [ 'test', 'webpack' ]);

gulp.task('webpack', [ 'webpack-major', 'webpack-major-min' ]);

gulp.task('webpack-major', ['lint'], function() {
  return gulp.src('src/index.js')
      .pipe(webpackStream(WEBPACK_CONFIG_MAJOR, webpack))
      .pipe(gulp.dest('dist'));
});

gulp.task('webpack-major-min', ['lint'], function() {
  return gulp.src('src/index.js')
      .pipe(webpackStream(WEBPACK_CONFIG_MAJOR_MIN, webpack))
      .pipe(gulp.dest('dist'));
});

gulp.task('typecheck', [ 'lint' ], function() {
    return gulp.src([ 'src/**/*.js', 'test/**/*.js' ])
        .pipe(gulpFlowtype({
            abort: true
        }))
});

gulp.task('lint', ['lint-src', 'lint-test']);

function isFixed(file) {
	return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint-src', function() {
    return gulp.src([ 'src/**/*.{js,jsx}' ]).pipe(gulpEslint({
        fix: Boolean(argv['fix'])
    }))
        .pipe(gulpEslint.format(friendlyFormatter))
        .pipe(gulpEslint.failAfterError())
        .pipe(gulpIf(isFixed, gulp.dest('./src')));
});

gulp.task('lint-test', function() {
    return gulp.src([ 'test/{tests,windows}/**/*.{js,jsx}' ]).pipe(gulpEslint({
        fix: Boolean(argv['fix'])
    }))
        .pipe(gulpEslint.format(friendlyFormatter))
        .pipe(gulpEslint.failAfterError())
        .pipe(gulpIf(isFixed, gulp.dest('./test')));
});

gulp.task('karma', ['lint'], function (done) {

  let server = new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: !Boolean(argv['keep-browser-open']),
    client: {
      captureConsole: Boolean(argv['capture-console'])
    }
  });

  server.on('browser_error', function (browser, err) {
    console.log('Karma Run Failed: ' + err.message);
    throw err;
  });

  server.on('run_complete', function (browsers, results) {
    if (results.failed) {
      return done(new Error('Karma: Tests Failed'));
    }
    done();
  });

  server.start();
});
