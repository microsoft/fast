import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";

/* tslint:disable-next-line */
const Polyfills: any = require("./polyfills");

platformBrowserDynamic().bootstrapModule(AppModule);
