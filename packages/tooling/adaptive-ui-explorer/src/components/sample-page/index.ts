import { SamplePage } from "./sample-page.js";
import { samplePageStyles as styles } from "./sample-page.styles.js";
import { samplePageTemplate as template } from "./sample-page.template.js";

SamplePage.define({
    name: "app-sample-page",
    styles,
    template: template(),
});
