import {
    defsPropertyName,
    type JSONSchema,
    Schema,
    schemaRegistry,
} from "../src/components/schema.js";
import { ObserverMap } from "../src/declarative/observer-map.js";
import { deepMerge } from "../src/declarative/observer-map-utilities.js";
import { ArrayObserver } from "../src/observation/arrays.js";
import { Observable } from "../src/observation/observable.js";
import { Updates } from "../src/observation/update-queue.js";

export type ArrayMergeCase =
    | "same-reference"
    | "same-elements"
    | "deep-equal"
    | "replacement";

let workloadId = 0;

function createMetric(depth: number, value: number): any {
    return depth === 1
        ? { views: value }
        : { views: value, child: createMetric(depth - 1, value) };
}

function createMetricSchema(depth: number): any {
    return {
        type: "object",
        properties: {
            views: { type: "number" },
            ...(depth > 1 ? { child: createMetricSchema(depth - 1) } : {}),
        },
    };
}

/** Creates a real observerMap owner; payload preparation and queue flushing are untimed. */
export async function createObserverMapArrayWorkload(size: number, depth: number) {
    ArrayObserver.enable();
    class Owner {
        declare data: { items: any[] };
    }

    const name = `observer-map-array-workload-${++workloadId}`;
    const schema = new Schema(name);
    const schemaMap = schemaRegistry.get(name) as Map<string, JSONSchema>;
    schemaMap.set("data", {
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: name,
        type: "object",
        properties: {
            items: {
                type: "array",
                items: depth === 0 ? { type: "number" } : { $ref: "#/$defs/Item" },
            },
        },
        [defsPropertyName]: {
            Item: {
                type: "object",
                $fast_context: "item",
                $fast_parent_contexts: ["data"],
                properties: {
                    id: { type: "number" },
                    label: { type: "string" },
                    metrics: createMetricSchema(Math.max(1, depth)),
                },
            },
        },
    });
    new ObserverMap(Owner.prototype, schema).defineProperties();

    const createItems = (version: number) =>
        Array.from({ length: size }, (_, index) =>
            depth === 0
                ? index + version
                : {
                      id: index + version,
                      label: `Item ${index + version}`,
                      metrics: createMetric(depth, version),
                  },
        );
    const owner = new Owner();
    owner.data = { items: createItems(0) };
    await Updates.next();

    const originalArray = owner.data.items;
    const originalFirstItem = originalArray[0];
    let ownerNotifications = 0;
    let arrayNotifications = 0;
    let replacementVersion = 0;
    const ownerSubscriber = { handleChange: () => ownerNotifications++ };
    const arraySubscriber = { handleChange: () => arrayNotifications++ };
    const ownerNotifier = Observable.getNotifier(owner);
    const arrayNotifier = Observable.getNotifier(originalArray);
    ownerNotifier.subscribe(ownerSubscriber, "data");
    arrayNotifier.subscribe(arraySubscriber);

    return {
        async run(kind: ArrayMergeCase, iterations = 1) {
            const payloads = Array.from({ length: iterations }, () => {
                switch (kind) {
                    case "same-reference":
                        return owner.data.items;
                    case "same-elements":
                        return [...owner.data.items];
                    case "deep-equal":
                        return createItems(0);
                    case "replacement":
                        return createItems(++replacementVersion);
                }
            });
            const beforeOwner = ownerNotifications;
            const beforeArray = arrayNotifications;
            let changes = 0;
            const start = performance.now();
            for (const items of payloads) {
                if (deepMerge(owner.data, { items })) changes++;
            }
            const duration = performance.now() - start;
            await Updates.next();
            return {
                duration,
                changes,
                ownerNotifications: ownerNotifications - beforeOwner,
                arrayNotifications: arrayNotifications - beforeArray,
                sameArray: owner.data.items === originalArray,
                sameFirstItem: owner.data.items[0] === originalFirstItem,
                length: owner.data.items.length,
            };
        },
        dispose() {
            ownerNotifier.unsubscribe(ownerSubscriber, "data");
            arrayNotifier.unsubscribe(arraySubscriber);
            schemaRegistry.delete(name);
        },
    };
}
