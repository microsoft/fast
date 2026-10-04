import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("push and replace update the URL, history, and navigation queue", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { DefaultNavigationQueue, Route } = await import("/main.ts");
        const queue = new DefaultNavigationQueue();
        queue.connect();
        const initial = (await queue.receive()).path;
        const length = history.length;
        Route.path.push("/first?query=one");
        const pushed = (await queue.receive()).path;
        const pushLength = history.length;
        Route.path.replace("/second?query=two");
        const replaced = (await queue.receive()).path;
        queue.disconnect();
        return {
            initial,
            pushed,
            replaced,
            current: Route.path.current,
            length,
            pushLength,
            replaceLength: history.length,
        };
    });

    expect(result.initial).toBe("/");
    expect(result.pushed).toBe("/first?query=one");
    expect(result.replaced).toBe("/second?query=two");
    expect(result.current).toBe(result.replaced);
    expect(result.pushLength).toBe(result.length + 1);
    expect(result.replaceLength).toBe(result.pushLength);
});

test("coalesces queued navigations and clears them on disconnect", async ({ page }) => {
    const paths = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { DefaultNavigationQueue, Route } = await import("/main.ts");
        const queue = new DefaultNavigationQueue();
        queue.connect();
        Route.path.trigger("/first");
        Route.path.trigger("/latest");
        const latest = (await queue.receive()).path;
        Route.path.trigger("/stale");
        queue.disconnect();
        Route.path.trigger("/disconnected");
        queue.connect();
        const reconnected = (await queue.receive()).path;
        queue.disconnect();
        return [latest, reconnected];
    });
    expect(paths).toEqual(["/latest", "/"]);
});

test("renders named routes and responds to browser back and forward", async ({
    page,
}) => {
    await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { mountRouter } = await import("/main.ts");
        mountRouter();
    });
    await expect(page.getByRole("heading", { name: "Home", exact: true })).toBeVisible();

    await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { Route } = await import("/main.ts");
        await Route.name.push(document.querySelector("fast-router"), "item", {
            id: "42",
        });
    });
    await expect(page.getByRole("heading", { name: "Item 42" })).toBeVisible();
    await expect(page).toHaveURL(/\/items\/42$/);
    await expect(page).toHaveTitle("Router tests - Item");

    await page.goBack();
    await expect(page.getByRole("heading", { name: "Home", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Item 42" })).toHaveCount(0);
    await page.goForward();
    await expect(page.getByRole("heading", { name: "Item 42" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Home", exact: true })).toHaveCount(0);
});

test("redirects replace the intermediate history entry", async ({ page }) => {
    await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { mountRouter } = await import("/main.ts");
        mountRouter();
    });
    await expect(page.getByRole("heading", { name: "Home", exact: true })).toBeVisible();
    await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { Route } = await import("/main.ts");
        Route.path.push("/items/7");
    });
    await expect(page.getByRole("heading", { name: "Item 7" })).toBeVisible();
    await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { Route } = await import("/main.ts");
        Route.path.push("/old-home");
    });
    await expect(page).toHaveURL("http://localhost:5175/");
    await expect(page.getByRole("heading", { name: "Home", exact: true })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Item 7" })).toBeVisible();
});

test("handles a link clicked through a shadow root", async ({ page }) => {
    await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { mountRouter } = await import("/main.ts");
        mountRouter();
        const host = document.createElement("test-links");
        host.attachShadow({ mode: "open" }).innerHTML =
            '<a href="/items/9"><span>Open item</span></a>';
        document.body.appendChild(host);
    });
    await expect(page.getByRole("heading", { name: "Home", exact: true })).toBeVisible();
    await page.getByText("Open item").click();
    await expect(page).toHaveURL(/\/items\/9$/);
    await expect(page.getByRole("heading", { name: "Item 9" })).toBeVisible();
});

const ignoredLinks: { name: string; attributes: Record<string, string> }[] = [
    { name: "external URL", attributes: { href: "https://example.com/" } },
    { name: "fragment", attributes: { href: "#section" } },
    { name: "download", attributes: { href: "/file", download: "" } },
    { name: "router-ignore", attributes: { href: "/ignored", "router-ignore": "" } },
    {
        name: "data-router-ignore",
        attributes: { href: "/ignored", "data-router-ignore": "" },
    },
    { name: "new window", attributes: { href: "/other", target: "_blank" } },
];

for (const { name, attributes } of ignoredLinks) {
    test(`leaves ${name} links to the browser`, async ({ page }) => {
        await page.evaluate(async attributes => {
            // @ts-expect-error: Client module.
            const { DefaultLinkHandler } = await import("/main.ts");
            new DefaultLinkHandler().connect();
            const anchor = document.createElement("a");
            anchor.textContent = "Link";
            for (const [key, value] of Object.entries(attributes)) {
                anchor.setAttribute(key, value);
            }
            anchor.addEventListener("click", event => {
                anchor.dataset.intercepted = String(event.defaultPrevented);
                // Observe the router's decision without leaving the fixture page.
                event.preventDefault();
            });
            document.body.appendChild(anchor);
        }, attributes);
        await page.getByRole("link", { name: "Link" }).click();
        await expect(page.getByRole("link", { name: "Link" })).toHaveAttribute(
            "data-intercepted",
            "false",
        );
        await expect(page).toHaveURL("http://localhost:5175/");
    });
}

for (const modifier of ["Alt", "Control", "Meta", "Shift"] as const) {
    test(`does not intercept a ${modifier}-click`, async ({ page }) => {
        await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { DefaultLinkHandler } = await import("/main.ts");
            new DefaultLinkHandler().connect();
            const anchor = document.createElement("a");
            anchor.href = "/items/1";
            anchor.textContent = "Link";
            const observeEvent = (event: MouseEvent) => {
                anchor.dataset.intercepted = String(event.defaultPrevented);
                event.preventDefault();
            };
            anchor.addEventListener("click", observeEvent);
            // macOS turns Control-click into a context menu instead of a click.
            anchor.addEventListener("contextmenu", observeEvent);
            document.body.appendChild(anchor);
        });
        await page.getByRole("link", { name: "Link" }).click({ modifiers: [modifier] });
        await expect(page.getByRole("link", { name: "Link" })).toHaveAttribute(
            "data-intercepted",
            "false",
        );
        await expect(page).toHaveURL("http://localhost:5175/");
    });
}
