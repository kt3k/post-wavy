var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var testDir = path.resolve(__dirname + '/test-dir');

if (fs.existsSync(testDir)) {
  deleteFolderRecursive(testDir);
}

fs.mkdirSync(testDir);
fs.writeFileSync(testDir + '/package.json', '{}');
fs.writeFileSync(testDir + '/index.js', 'console.log(require("~/foo"))');
fs.writeFileSync(testDir + '/foo.js', 'module.exports = "foo";');

console.log('wavy');
exec('node --version', function(err, out) {
  var isgnoreNpmInstallDotDot = Number(out.match(/v(\d+)/)[1]) >= 5;
  exec('mkdir -p node_modules/.bin && cp ../index.js node_modules/.bin/wavy && npx wavy', { cwd: testDir }, function(err) {
    handleError(err);
    console.log('√ installs without errors');
    exec('node index', { cwd: testDir }, function(err, stdout) {
      handleError(err);
      if (stdout.trim() !== 'foo') {
        handleError(new Error('expected output to be "foo" got ' + stdout.trim()));
      }
      console.log('√ works after install');
      exec('npx wavy', { cwd: testDir }, function(err) {
        if (!isgnoreNpmInstallDotDot) handleError(err);
        console.log('√ can handle multiple installs');
        deleteFolderRecursive(testDir + '/node_modules');
        fs.mkdirSync(testDir + '/node_modules/');
        fs.writeFileSync(testDir + '/node_modules/~', '123');
        exec('mkdir -p node_modules/.bin && cp ../index.js node_modules/.bin/wavy && npx wavy', { cwd: testDir }, function(err) {
          var regex = /.*[\/\\]node_modules[\/\\]~ is already being used$/m;
          if (!regex.test(err.message)) {
            handleError(new Error('did not handle improper existing ~'))
          }
          console.log('√ handles `~` already being used by something else');
          console.log('');
          console.log('all tests passed!');
          deleteFolderRecursive(testDir);
        });
      });
    });
  });
});

function handleError(err) {
  if (err) {
    deleteFolderRecursive(testDir);
    console.error(err.stack);
    process.exit(1);
  }
}

// http://stackoverflow.com/a/12761924
function deleteFolderRecursive(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file,index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
