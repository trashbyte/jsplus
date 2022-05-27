#!/usr/bin/env node
'use strict'

const gulp = require('gulp')
const glob = require('glob')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const terser = require('gulp-terser')
const rename = require('gulp-rename')
const clone = require('gulp-clone')
const merge = require('merge-stream')

const OUTPUT_DIR = './dist/'

function build() {
  let shared = gulp.src("./src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(ts({
      "noImplicitAny": true,
      "target": "ES2021",
      "removeComments": false,
      "preserveConstEnums": true,
      "outFile": "jsplus.js",
      "lib": ["es2021","dom"]
    })).js

  let full = shared
    .pipe(clone())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(OUTPUT_DIR))

  let min = shared
    .pipe(clone())
    .pipe(rename('jsplus.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(OUTPUT_DIR))

  return merge(full, min)
}
exports.build = build

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

exports.default = gulp.series(build, buildDefs)
exports.watch = () => gulp.watch('./src/**/*.ts', exports.default)
