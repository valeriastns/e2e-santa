import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import users from "../../fixtures/users.json";


Given("user is on secret santa web site page", function () {
    cy.visit("/login");
});

Given("user logs in", function (){
    loginUser(users.userAuthor.email, users.userAuthor.password);
});

Given("user is on dashboard page", function() {
    cy.contains("Создать карточку участника").should("exist");
});