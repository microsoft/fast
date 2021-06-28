import type { Browser, ElementHandle, Page } from "playwright";

declare module "mocha" {
    export interface Context {
        documentHandle: ElementHandle<Document>;
        browser: Browser;
        page: Page;
    }
}
