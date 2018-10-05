/**
 * Debug:  $ DEBUG=cypress:* $(npm bin)/cypress open --config saveDebugData=true
 * 
 * Run locally with GUI: 
 *  - `npm run ui-tests:open`
 * 
 * Run with CLI only
 *  - `npm run ui-tests:run`
 * 
 * View in Applitools Dashboard
 * Visit: https://eyes.applitools.com
 */
describe('Hello world', () => {
  it('works', () => {
    cy.visit('https://applitools.com/helloworld');
    cy.eyesOpen({
      appName: 'Hello World!',
      testName: 'My JavaScript test!',
      browser: {
        width: 800,
        height: 600
      },
    });
    cy.eyesCheckWindow('Main Page');
    cy.get('button').click();
    cy.eyesCheckWindow('Click!');
    cy.eyesClose();
  });
});