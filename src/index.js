const express = require('express')
const app = express()
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path')
const reporter = require('cucumber-html-reporter');
var exec = require('child_process').exec;
var bodyParser = require('body-parser')

let PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use(bodyParser.json())

// Example of running a cucumber test using a GET call
// this took me like 40 minutes to set up
app.get('/', function (req, res) {
  const filenameUUID = uuidv1();
  const filenameUUIDJson = filenameUUID + ".json";
  const filenameUUIDHtml = filenameUUID + ".html";
  const reporterOptions = {
    theme: 'bootstrap',
    jsonFile: filenameUUIDJson,
    output: filenameUUIDHtml,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
      "App Version": "0.3.2",
      "Test Environment": "STAGING",
      "Browser": "Chrome  54.0.2840.98",
      "Platform": "Windows 10",
      "Parallel": "Scenarios",
      "Executed": "Remote"
    }
  };

  exec("./node_modules/.bin/cucumber-js --format json:" + filenameUUIDJson, function (err, stdout, stderr) {
    console.log(stdout);
    reporter.generate(reporterOptions);
    const fileContents = fs.readFileSync(filenameUUIDHtml, 'utf-8');
    res.send(fileContents)
  });
})

app.post('/gherkin', function (req, res) {
  const dirnameUUID = uuidv1();

  // Create a directory for temp test files
  fs.mkdirSync(dirnameUUID);

  try {
    // concat some stuff
    const filenameUUIDFeature = path.join(dirnameUUID, "gherkin.feature");
    const filenameUUIDJson = path.join(dirnameUUID, "test-results.json");
    const filenameUUIDHtml = path.join(dirnameUUID, "test-results.html");

    // body of post should be gherkin
    const gherkin = Object.keys(req.body)[0];
    console.log(gherkin)
    // write it out to a feature file
    fs.writeFileSync(filenameUUIDFeature, gherkin, 'utf-8');

    const reporterOptions = {
      theme: 'bootstrap',
      jsonFile: filenameUUIDJson,
      output: filenameUUIDHtml,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: false,
      metadata: {
        "App Version": "0.3.2",
        "Test Environment": "STAGING",
        "Browser": "Chrome  54.0.2840.98",
        "Platform": "Windows 10",
        "Parallel": "Scenarios",
        "Executed": "Remote"
      }
    };

    exec(`./node_modules/.bin/cucumber-js ${filenameUUIDFeature} --require './features/support/*.js' --format json:${filenameUUIDJson}`, function (err, stdout, stderr) {
      console.log(stdout);
      reporter.generate(reporterOptions);

      // Will return this
      const fileContents = fs.readFileSync(filenameUUIDHtml, 'utf-8');

      // Remove the above files
      fs.unlinkSync(filenameUUIDFeature)
      fs.unlinkSync(filenameUUIDJson)
      fs.unlinkSync(filenameUUIDHtml)

      // Remove the directory
      fs.rmdirSync(dirnameUUID);

      res.send(fileContents);
    });
  } catch (e) {
    fs.rmdirSync(dirnameUUID);
    res.sendStatus(500);
  }
})

app.listen(PORT, () => {
  console.log("App-started! Listening on port " + PORT)
})