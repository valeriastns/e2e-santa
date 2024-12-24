import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import users from "../../fixtures/users.json";


const loginUser = (email, password) => {
    cy.visit("/login");
    cy.login(email, password);
  };

Given("user is on secret santa web site page", function () {
    cy.visit("/login");
});

When("user logs in", function (){
    loginUser(users.userAuthor.email, users.userAuthor.password);
});

Then("user is on dashboard page", function() {
    cy.contains("Создать коробку").click();
});