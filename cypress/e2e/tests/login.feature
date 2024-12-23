Feature: User login on santa web site

Scenario: User logs in succesfully
Given user is on secret santa web site page
When user logs in
Then user is on dashboard page
