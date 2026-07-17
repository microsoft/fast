import { strictEqual } from "node:assert/strict";
import { describe, test } from "node:test";
import { DefaultRoutingEventSink } from "./events.js";
import type { RoutingEventSink, TitleBuilder } from "./index.js";
import { DefaultTitleBuilder } from "./titles.js";

// The entry point has DOM-dependent side effects and cannot be imported at runtime under
// node:test, so it is asserted at the type level. Indexing the module type keeps the
// classes pinned as value exports rather than type-only ones.
type EntryPoint = typeof import("./index.js");

describe("index", () => {
    test("re-exports the events module", () => {
        const sink: RoutingEventSink = new DefaultRoutingEventSink();
        const ctor: EntryPoint["DefaultRoutingEventSink"] = DefaultRoutingEventSink;

        strictEqual(ctor, DefaultRoutingEventSink);
        strictEqual(typeof sink.onNavigationBegin, "function");
    });

    test("re-exports the titles module", () => {
        const builder: TitleBuilder = new DefaultTitleBuilder();
        const ctor: EntryPoint["DefaultTitleBuilder"] = DefaultTitleBuilder;

        strictEqual(ctor, DefaultTitleBuilder);
        strictEqual(builder.joinTitles("a", "b"), "a - b");
    });
});
