import type { Browser, ElementHandle, Page } from "playwright";
import type { FASTDesignSystemProvider } from "./design-system-provider";

declare module "mocha" {
    export interface Context {
        documentHandle: ElementHandle<Document>;
        providerHandle: ElementHandle<FASTDesignSystemProvider>;
        browser: Browser;
        page: Page;
    }
}
