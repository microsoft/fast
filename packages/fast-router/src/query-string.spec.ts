import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { describe, test } from "node:test";
import { QueryString } from "./query-string.js";
import { DefaultRouteRecognizer } from "./recognizer.js";

describe("QueryString.parse", () => {
    const cases: [string, object][] = [
        ["user[name]=Alice&user[role]=admin", { user: { name: "Alice", role: "admin" } }],
        [
            "filter[category][name]=hardware",
            { filter: { category: { name: "hardware" } } },
        ],
        ["items[]=1&items[]=2", { items: ["1", "2"] }],
        ["items[1]=second&items[0]=first", { items: ["first", "second"] }],
        ["filter[tags][]=one&filter[tags][]=two", { filter: { tags: ["one", "two"] } }],
        [
            "items[0][name]=first&items[1][name]=second",
            { items: [{ name: "first" }, { name: "second" }] },
        ],
        ["items=first&items[]=second", { items: ["first", "second"] }],
        [
            "user%5Bname%5D=Alice+Smith&user[role]=",
            { user: { name: "Alice Smith", role: "" } },
        ],
        [
            "?name=Alice+Smith&tag=one&tag=two&enabled&empty=",
            { name: "Alice Smith", tag: ["one", "two"], enabled: true, empty: "" },
        ],
    ];

    for (const [query, expected] of cases) {
        test(`parses ${query}`, () => {
            deepStrictEqual(QueryString.parse(query), expected);
        });
    }

    test("round-trips the nested objects and arrays produced by build", () => {
        const params = {
            filter: { category: "hardware", tags: ["one", "two"] },
            items: [{ name: "first" }, { name: "second" }],
        };

        // build accepts structured values at runtime, despite its string-only signature.
        deepStrictEqual(QueryString.parse(QueryString.build(params as any)), params);
    });

    test("recognizes a route with nested query parameters", async () => {
        const recognizer = new DefaultRouteRecognizer();
        recognizer.add({ path: "search" });

        const route = await recognizer.recognize(
            "/search?filter[tags][]=one&filter[tags][]=two",
        );

        deepStrictEqual(route?.queryParams, { filter: { tags: ["one", "two"] } });
    });

    test("does not reuse inherited properties as nested containers", () => {
        const constructorPrototype = Object.getPrototypeOf({}).constructor.prototype;
        const parsed = QueryString.parse("constructor[prototype][fastQueryTest]=value");

        deepStrictEqual(parsed, {
            constructor: { prototype: { fastQueryTest: "value" } },
        });
        strictEqual(constructorPrototype.fastQueryTest, undefined);
    });

    test("ignores prototype-setting paths without discarding ordinary parameters", () => {
        const parsed = QueryString.parse(
            "__proto__[fastQueryTest]=value&user[__proto__][fastQueryTest]=value&name=Alice",
        );

        deepStrictEqual(parsed, { name: "Alice" });
        strictEqual(Object.getPrototypeOf(parsed), Object.prototype);
        strictEqual(({} as Record<string, unknown>).fastQueryTest, undefined);
    });
});
