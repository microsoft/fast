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
describe('should load Microsoft documentation site', () => {
  it('works', () => {
    cy.visit('https://msft-docs.fast-dna.net');
    cy.eyesOpen({
      appName: 'MSFT Docs',
      testName: 'MSFT Docs Home Page',
      browser: {
        width: 800,
        height: 600
      },
    });
    cy.eyesCheckWindow('Home Page');
    cy.eyesClose();
  });
});