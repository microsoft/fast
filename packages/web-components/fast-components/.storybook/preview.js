import "../src/design-system-provider";
import * as FAST from "../src/index-rollup";

FAST;

const withThemeProvider = Story => `
  <fast-design-system-provider id="root-provider" use-defaults>
    ${Story()}
  </fast-design-system-provider>
`;

export const decorators = [withThemeProvider];

export const parameters = {
    layout: "fullscreen",
};
