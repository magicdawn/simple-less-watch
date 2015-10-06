#!/usr/bin/env node

'use strict';


/**
 * module dependencies
 */
var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var symbols = require('log-symbols');
var chalk = require('chalk');

/**
 * lessc-watch abc.less [xxx-options]
 */
var args = process.argv.slice(2); // abc.less [xxx-options]
var file = args[0];
if (!file) {
  console.log(`
    usage : less-watch abc.less [xxx-options]
  `);
  process.exit(1);
}

file = path.resolve(file);
var watcher = fs.watch(file, function(ev, filename) {
  if (ev === 'change') {
    console.log(`${ chalk.yellow.bold('ℹ') } file changed,recompiling ...`);
    compile();
  }
});

compile(); // compile for 1st time


/**
 * indicate whether is compiling
 */
var isCompiling;

/**
 * do compile each time
 */
function compile() {
  if (isCompiling) {
    return;
  }
  isCompiling = true;

  var exe = 'lessc';
  if (process.platform === 'win32') {
    exe += '.cmd';
  }

  var p;
  try {
    p = cp.spawnSync(exe, args, {
      stdio: 'inherit'
    });
  } catch (e) {
    // noop
  } finally {
    isCompiling = false;
    var code = p.status;

    if (code > 0) {
      console.log(`${ symbols.error } exit with code : %s , seems faild`, code);
    } else {
      console.log(`${ symbols.success } less compiled`);
    }
  }
}