#!/usr/bin/env node
'use strict'

const gulp = require('gulp')
const glob = require('glob')
const tsify = require('tsify')
const ts = require('gulp-typescript')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const terser = require('gulp-terser')

const OUTPUT_DIR = './dist/'

function build() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: glob.sync('./src/**/*.ts'),
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('jsplus.js'))
  .pipe(gulp.dest(OUTPUT_DIR))
}
exports.build = build
function watch() { return gulp.watch('./src/**/*.ts', build) }
exports.watch = watch

function buildMin() {
  return browserify({
      basedir: '.',
      debug: false,
      entries: glob.sync('./src/**/*.ts'),
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('jsplus.min.js'))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest(OUTPUT_DIR))
}
exports.buildMin = buildMin

function buildDefs() {
  return gulp.src("./src/**/*.ts")
    .pipe(ts({
      "declaration": true,
      "emitDeclarationOnly": true,
      "outFile": "jsplus.d.ts",
      "lib": ["es2021","dom"]
    }))
    .pipe(gulp.dest(OUTPUT_DIR))
}
exports.buildDefs = buildDefs

exports.watch = gulp.series(build, watch)
exports.default = gulp.series(build, buildMin, buildDefs)
