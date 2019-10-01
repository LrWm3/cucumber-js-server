var util = require('util')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
  util.puts(stdout)
}
exec("./node_modules/.bin/cucumber-js", function (err, stdout, stderr) {
  console.log(stdout);
});