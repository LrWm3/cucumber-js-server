# features/simple_math.feature
Feature: Simple maths
  In order to do strange maths
  As a developer
  I want to do strange maths

  Scenario: simple strange maths
    Given a variable set to 1
    When I double the variable 1 times
    Then the variable should contain 2

  Scenario: simple strange maths
    Given a variable set to 1
    When I double the variable 2 times
    Then the variable should contain 4

  Scenario Outline: much more complex stuff
    Given a variable set to <var>
    When I increment the variable by <increment>
    Then the variable should contain <result>

    Examples:
      | var | increment | result |
      | 100 | 5         | 105    |
      | 99  | 1234      | 1333   |
      | 12  | 5         | 17     |