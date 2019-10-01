// features/support/steps.js
const {
  Given,
  When,
  Then
} = require("cucumber");
const {
  expect
} = require("chai");

Given("a variable set to {int}", function (number) {
  this.setTo(number);
});

When("I increment the variable by {int}", function (number) {
  this.incrementBy(number);
});

When("I double the variable {int} times", function (number) {
  for (ii = 0; ii < number; ++ii) {
    this.incrementBy(this.variable);
  }
})

Then("the variable should contain {int}", function (number) {
  expect(this.variable).to.eql(number);
});