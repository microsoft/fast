/**
 * Debug:  $ DEBUG=cypress:* $(npm bin)/cypress open --config saveDebugData=true
 * 
 * Run locally with GUI: 
 *  1. Navigate into `./build/testing`
 *  2. `$(npm bin)/cypress open`
 * 
 * Run with CLI only
 * `$(npm bin)/cypress run --record --key af641f59-7cae-4d14-a019-a18566c05a77`
 * 
 * View in Dashboard
 * Visit: https://dashboard.cypress.io/#/projects/h61rb3/runs 
 */
describe('Hello world', () => {
    it('works', () => {
      cy.visit('https://applitools.com/helloworld');
      cy.eyesOpen({
        appName: 'Hello World!',
        testName: 'My first JavaScript test!',
        browser: { width: 800, height: 600 },
      });
      cy.eyesCheckWindow('Main Page');
      cy.get('button').click();
      cy.eyesCheckWindow('Click!');
      cy.eyesClose();
    });
  });