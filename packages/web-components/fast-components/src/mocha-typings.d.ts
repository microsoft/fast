import { Browser, Page } from "playwright";

declare module "mocha" {
    export interface Context {
        browser: Browser;
        page: Page;
    }
}
