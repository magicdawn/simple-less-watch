#!/usr/bin/env node

var cp = require('child_process');
var path = require('path');
var fs = require('fs');

/**
 * lessc-watch abc.less [xxx-options]
 */
var args = process.argv.slice(2); // abc.less [xxx-options]
var file = args[0];
if (!file) {
  console.log(`
  usage :

    less-watch abc.less [xxx-options]`);

  process.exit(1);
}

file = path.resolve(file);
var watcher = fs.watch(file, function(ev, filename) {
  if (ev === 'change') {
    console.log('>>>『●』file changed,recompiling ...');
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
  if (isCompiling) return;
  isCompiling = true;

  var exe = 'lessc';
  if (process.platform === 'win32') {
    exe += '.cmd';
  }

  var less = cp.spawn(exe, args, {
    stdio: 'inherit'
  });

  less.on('exit', function(code) {
    isCompiling = false;

    if (code > 0) {
      console.log('>>>『×』exit with code : %s , seems faild.', code);
    } else {
      console.log('>>>『√』less compiled.');
    }
  });
}