import { assert, expect } from "chai";
import { isWeakSet } from "lodash-es";
import { DesignTokenLibraryImpl } from "./library";

interface DS {
    color: string;
    size: number;
}

describe("DesignTokenLibraryImpl", () => {
    describe("should initialize", () => {
        it("without any properties are no object is provided to the constructor", () => {
            const ds = new DesignTokenLibraryImpl();

            assert(ds.keys().length === 0);
        });
        it("with any provided properties set to the provided value", () => {
            const ds = new DesignTokenLibraryImpl<DS>({
                color: "red",
                size: 2,
            });

            assert(ds.keys().length === 2);
            assert(ds.get("color") === "red");
            assert(ds.get("size") === 2);
        });
    });
    describe("should get a property value", () => {
        it("that has been set on the implementation", () => {
            const ds = new DesignTokenLibraryImpl<DS>();
            ds.set("color", "red");

            assert(ds.get("color") === "red");
        });

        it("that is undefined if the value has not been set", () => {
            const ds = new DesignTokenLibraryImpl<DS>();

            assert(ds.get("color") === undefined);
        });

        it("that has been set on the upstream when no local implementation is set", () => {
            const upstream = new DesignTokenLibraryImpl<DS>();
            upstream.set("color", "red");
            const downstream = new DesignTokenLibraryImpl<DS>();
            downstream.upstream = upstream;

            assert(downstream.get("color") === "red");
        });

        it("from the downstream if it has been set on both the upstream and the downstream", () => {
            const upstream = new DesignTokenLibraryImpl<DS>();
            upstream.set("color", "red");
            const downstream = new DesignTokenLibraryImpl<DS>();
            downstream.upstream = upstream;
            downstream.set("color", "blue");

            assert(downstream.get("color") === "blue");
        });

        it("from itself when defined both on itself and the downstream", () => {
            const upstream = new DesignTokenLibraryImpl<DS>();
            upstream.set("color", "red");
            const downstream = new DesignTokenLibraryImpl<DS>();
            downstream.upstream = upstream;
            downstream.set("color", "blue");

            assert(upstream.get("color") === "red");
        });

        it("that is undefined if the property is set and then deleted", () => {
            const ds = new DesignTokenLibraryImpl<DS>();
            ds.set("color", "red");
            ds.delete("color");

            assert(ds.get("color") === undefined);
        });
    });

    describe("should notify", () => {
        it("when an upstream property changes", () => {
            const upstream = new DesignTokenLibraryImpl<DS>();
            const downstream = new DesignTokenLibraryImpl<DS>();
            let called = false,
                args = [] as any;

            downstream.upstream = upstream;

            downstream.subscribe({
                handleChange: (src, keys) => {
                    called = true;
                    args = args.concat(keys);
                },
            });

            upstream.set("color", "red");
            upstream.set("size", 4);

            assert(called);
            expect(args).to.contain("color");
            expect(args).to.contain("size");
        });

        it("a subscriber when setting any property", () => {
            const lib = new DesignTokenLibraryImpl<DS>();
            let called = 0;
            lib.subscribe({
                handleChange() {
                    called += 1;
                },
            });

            lib.set("size", 2);
            assert(called === 1);
            lib.set("color", "red");
            assert(called === 2);
        });

        it("a property subscriber when setting the subscribed property", () => {
            const lib = new DesignTokenLibraryImpl<DS>();
            let called = 0;
            lib.subscribe(
                {
                    handleChange() {
                        called += 1;
                    },
                },
                "size"
            );

            lib.set("size", 2);
            assert(called === 1);
        });

        it("subscribers when setting a derived property", () => {
            const lib = new DesignTokenLibraryImpl<DS>();
            let called = false;
            lib.subscribe({ handleChange: () => (called = !called) });

            assert(!called);
            lib.set("color", { derive: () => "", dependencies: [] });

            assert(called);
        });

        it("subscribers when setting a derived property with keys equal to the key being set", () => {
            const lib = new DesignTokenLibraryImpl<DS>();
            let k: (keyof DS)[] = [];
            lib.subscribe({ handleChange: (source, keys) => (k = keys) });

            assert(k.length === 0);
            lib.set("color", { derive: () => "", dependencies: [] });

            assert(k.includes("color"));
        });

        it("subscribers of a change when changing a dependency results in a new derived value", () => {
            const lib = new DesignTokenLibraryImpl<DS>();
            let size = 1;
            let sizeAsString = size.toString();
            let calls = 0;
            let k: Array<Array<keyof DS>> = [];

            lib.set("size", size);
            lib.set("color", {
                derive: args => (sizeAsString = args.size.toString()),
                dependencies: ["size"],
            });
            lib.subscribe({
                handleChange(source, keys) {
                    calls += 1;
                    k[calls] = keys;
                },
            });

            assert(calls === 0);

            lib.set("size", 2);

            expect(calls).to.equal(2);
            expect(k[2].length).to.equal(1);
            assert(k[2].includes("color"));
        });
    });

    describe("should not notify", () => {
        it("when attaching to an upstream when no properties on the upstream are set", () => {
            const upstream = new DesignTokenLibraryImpl<DS>();
            const downstream = new DesignTokenLibraryImpl<DS>();
            let called = false;

            downstream.subscribe({
                handleChange: (source, keys) => {
                    called = true;
                },
            });

            downstream.upstream = upstream;

            assert(!called);
        });
        it("if a delete doesn't result in a change", () => {
            const upstream = new DesignTokenLibraryImpl<DS>();
            const downstream = new DesignTokenLibraryImpl<DS>();
            upstream.set("color", "red");
            downstream.set("color", "red");
            let calls = 0;
            downstream.upstream = upstream;
            const subscriber = {
                handleChange: (source, keys) => {
                    calls += 1;
                },
            };

            downstream.subscribe(subscriber);

            assert(downstream.get("color") === "red");
            assert(calls === 0);

            downstream.delete("color");

            assert(calls === 0);
        });

        it("if setting a property doesn't result in a change", () => {
            const upstream = new DesignTokenLibraryImpl<DS>();
            const downstream = new DesignTokenLibraryImpl<DS>();
            let calls = 0;
            const subscriber = {
                handleChange: (source, keys) => {
                    calls += 1;
                },
            };

            upstream.set("color", "red");
            downstream.upstream = upstream;
            downstream.subscribe(subscriber);

            assert(downstream.get("color") === "red");
            assert(calls === 0);

            downstream.set("color", "red");

            assert(calls === 0);
            assert(downstream.get("color") === "red");
        });

        it("if subscribing to a specific key that has not been set", () => {
            const lib = new DesignTokenLibraryImpl<DS>();
            lib.set("color", "red");
            let called = false;
            lib.subscribe(
                {
                    handleChange() {
                        called = !called;
                    },
                },
                "size"
            );

            assert(!called);
        });
        it("with properties that are not subscribed to", () => {
            const lib = new DesignTokenLibraryImpl<DS>();
            lib.set("color", "red");
            lib.set("size", 10);
            let keys: Array<keyof DS> = [];
            lib.subscribe(
                {
                    handleChange(source, k) {
                        keys = k;
                    },
                },
                "size"
            );

            lib.set("size", 0);
            expect(keys.length).to.equal(1);
            assert(keys[0] === "size");
        });
    });

    it("should re-evaluate a derived property if any of the properties dependencies change", () => {
        const lib = new DesignTokenLibraryImpl<DS>();
        let size = 1;
        let sizeAsString = size.toString();

        lib.set("size", size);
        lib.set("color", {
            derive: args => (sizeAsString = args.size.toString()),
            dependencies: ["size"],
        });
        assert(sizeAsString === "1");

        lib.set("size", 2);

        assert(sizeAsString === "2");
    });
    it("should invoke the `derive` function with the upstream dependency value when the dependency key is the key being set", () => {
        // Set background color equal to a function that relies on background color
    });
});
