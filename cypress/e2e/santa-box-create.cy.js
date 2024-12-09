const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");

import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let minAmount = 10;
  let currency = "Евро";
  let inviteLink;
  let boxID;

  const loginUser = (email, password) => {
    cy.visit("/login");
    cy.login(email, password);
  };

  const fillParticipantCard = (wishes) => {
    cy.contains("Создать карточку участника").should("exist");
    cy.get(generalElements.submitButton).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(inviteeBoxPage.wishesInput).type(wishes);
    cy.get(generalElements.arrowRight).click();
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
      cy.clearCookies();
  };

  it("user creates a box", () => {
    loginUser(users.userAuthor.email, users.userAuthor.password);
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxID)
    .invoke('val')
    .then((id) => {
      boxID = id;
      expect(boxID).to.not.be.undefined
    });
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.giftPriceToggle).click();
    cy.get(boxPage.maxAmount).type(maxAmount);
    cy.get(boxPage.minAmount).type(minAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  const participants = [users.user1, users.user2, users.user3];
  participants.forEach((user, index) => {
    it(`approve as participant ${index + 1}`, () => {
      cy.visit(inviteLink);
      cy.get(generalElements.submitButton).click();
      cy.contains("войдите").click();
      cy.login(user.email, user.password);
      fillParticipantCard(wishes);
      cy.clearCookies();
    });
  });
  

  it("draw lots", ()=>{
    loginUser(users.userAuthor.email, users.userAuthor.password);
    cy.get('.header-item > .header-item__text > .txt--med')
    .first()
    .should('have.text', 'Коробки')
    .click({force: true});
    cy.get('.MuiGrid-root > a.base--clickable > div.user-card').last().click();
    cy.get('a > .txt-secondary--med')
    .click();
    cy.get(generalElements.submitButton).click();
    cy.get('.santa-modal_content_buttons > .btn-main').click();
    cy.clearCookies();
  });

  after("delete box", () => {
    cy.visit("/login");
    cy.login(users.userAuthor.email, users.userAuthor.password);
    cy.log(`Box ID: ${boxID}`);
    cy.request({
      method: 'DELETE',
      url: `https://santa-secret.ru/api/box/${boxID}/delete`,
      failOnStatusCode: false
   }).then((response) => {
      expect([200, 204]).to.include(response.status);
   });
  })
}); 
