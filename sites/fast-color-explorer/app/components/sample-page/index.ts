import { SamplePage } from "./sample-page";
import { samplePageStyles as styles } from "./sample-page.styles";
import { samplePageTemplate as template } from "./sample-page.template";

export const samplePage = SamplePage.compose({
    baseName: "sample-page",
    template,
    styles,
});
