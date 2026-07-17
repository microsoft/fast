import { expect, test } from "@playwright/test";

/**
 * Sets up an ObserverMap over `{ items: Item[] }`, applies `mutate` to the observed
 * array, waits a tick, and reports what the observer map did with the change.
 */
async function observeArrayMutation(
    page: import("@playwright/test").Page,
    mutation: "resetByLengthDrift" | "push",
) {
    await page.goto("/");

    return await page.evaluate(async (mutation: string) => {
        const {
            ArrayObserver,
            conditionalTimeout,
            defsPropertyName,
            Observable,
            ObserverMap,
            Schema,
            schemaRegistry,
            Updates,
            // @ts-expect-error: Client module.
        } = await import("/main.js");

        ArrayObserver.enable();

        const elementName = `observer-map-array-${mutation}`;
        const schema = new Schema(elementName);
        const schemaMap = schemaRegistry.get(elementName);

        schemaMap.set("someData", {
            $schema: "https://json-schema.org/draft/2019-09/schema",
            $id: `https://fast.design/schemas/${elementName}/someData.json`,
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: { $ref: "#/$defs/Item" },
                },
            },
            [defsPropertyName]: {
                Item: {
                    $fast_context: "items",
                    $fast_parent_contexts: ["someData"],
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                },
            },
        });

        class TestClass {
            public someData: any;
        }

        new ObserverMap(TestClass.prototype, schema).defineProperties();

        const instance = new TestClass();
        instance.someData = { items: [{ name: "first" }] };

        const rootNotifications: string[] = [];
        Observable.getNotifier(instance).subscribe(
            {
                handleChange(_source: any, propertyName: string) {
                    rootNotifications.push(propertyName);
                },
            },
            "someData",
        );

        const items = instance.someData.items;

        if (mutation === "resetByLengthDrift") {
            // `length = 0` records no splice, so the queued push cannot describe the
            // array's real contents and the observer falls back to a reset.
            items.length = 0;
        }

        items.push({ name: "second" });

        await Promise.race([
            Updates.next(),
            conditionalTimeout(rootNotifications.length > 0),
        ]);

        const pushed = instance.someData.items[instance.someData.items.length - 1];
        const itemNotifications: string[] = [];

        Observable.getNotifier(pushed).subscribe(
            {
                handleChange(_source: any, propertyName: string) {
                    itemNotifications.push(propertyName);
                },
            },
            "name",
        );

        pushed.name = "changed";

        return {
            isObservable: Observable.getAccessors(pushed).some(
                (accessor: any) => accessor.name === "name",
            ),
            rootNotifications,
            itemNotifications,
        };
    }, mutation);
}

test.describe("The observer map's array observation", () => {
    test("makes pushed items observable and notifies the root property", async ({
        page,
    }) => {
        // The tracked-splice baseline the reset path has to match.
        const result = await observeArrayMutation(page, "push");

        expect(result.isObservable).toBe(true);
        expect(result.rootNotifications).toEqual(["someData"]);
        expect(result.itemNotifications).toEqual(["name"]);
    });

    test("makes items observable and notifies the root property when an untracked length change forces a reset", async ({
        page,
    }) => {
        // A reset splice carries `addedCount === 0`, so an observer map that only
        // reacts to additions would silently leave the new item unobservable.
        const result = await observeArrayMutation(page, "resetByLengthDrift");

        expect(result.isObservable).toBe(true);
        expect(result.rootNotifications).toEqual(["someData"]);
        expect(result.itemNotifications).toEqual(["name"]);
    });
});
