import { SampleApp } from "./sample-app.js";
import { sampleAppStyles as styles } from "./sample-app.styles.js";
import { sampleAppTemplate as template } from "./sample-app.template.js";

SampleApp.define({
    name: "app-sample-app",
    styles,
    template: template(),
});
