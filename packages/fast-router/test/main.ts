import { html } from "@microsoft/fast-element";
import { RouterConfiguration } from "../src/configuration.js";
import { FASTRouter } from "../src/fast-router.js";

export { DefaultLinkHandler } from "../src/links.js";
export { DefaultNavigationQueue, Route } from "../src/navigation.js";

class TestConfiguration extends RouterConfiguration {
    protected configure() {
        this.title = "Router tests";
        this.routes.map(
            { path: "", name: "home", title: "Home", template: html`<h1>Home</h1>` },
            {
                path: "items/{id}",
                name: "item",
                title: "Item",
                template: html`<h1>Item ${x => x.id}</h1>`,
            },
            { path: "old-home", redirect: "home" },
        );
    }
}

export function mountRouter() {
    const router = new FASTRouter();
    router.config = new TestConfiguration();
    document.body.appendChild(router);
    return router;
}
