import { SampleApp } from "./sample-app";
import { sampleAppTemplate as template } from "./sample-app.template";
import { sampleAppStyles as styles } from "./sample-app.styles";

export const sampleApp = SampleApp.compose({
    baseName: "sample-app",
    template,
    styles,
});
