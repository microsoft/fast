import { assert, expect } from "chai";
import { DesignTokenLibraryImpl } from "./library";

interface DS {
    color: string;
    size: number;
}

describe("FASTDesignTokens", () => {
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

    it("should not get notified when attaching to an upstream when no properties on the upstream are set", () => {
        const upstream = new DesignTokenLibraryImpl<DS>();
        const downstream = new DesignTokenLibraryImpl<DS>();
        let called = false;

        downstream.handleChange = (source, keys) => {
            called = true;
        };

        downstream.upstream = upstream;

        assert(!called);
    });

    it("should get notified with all set properties of the upstream implementation when attaching", () => {
        const upstream = new DesignTokenLibraryImpl<DS>();
        const downstream = new DesignTokenLibraryImpl<DS>();
        let called = false,
            source = {},
            args = [] as any;

        upstream.set("color", "red");
        upstream.set("size", 4);

        downstream.handleChange = (src, keys) => {
            called = true;
            source = src;
            args = args.concat(keys);
        };

        downstream.upstream = upstream;

        assert(source === upstream);
        assert(called);
        expect(args).to.contain("color");
    });

    it("should get notified of an upstream property change", () => {
        const upstream = new DesignTokenLibraryImpl<DS>();
        const downstream = new DesignTokenLibraryImpl<DS>();
        let called = false,
            source = {},
            args = [] as any;

        downstream.upstream = upstream;

        downstream.handleChange = (src, keys) => {
            called = true;
            source = src;
            args = args.concat(keys);
        };

        upstream.set("color", "red");
        upstream.set("size", 4);

        // assert(source === upstream);
        assert(called);
        // expect(args).to.contain("color");
        // expect(args).to.contain("size");
    });

    it("should notify the downstream of property changes after detachment", () => {
        const upstream = new DesignTokenLibraryImpl<DS>();
        const downstream = new DesignTokenLibraryImpl<DS>();
        let called = false,
            source = {},
            args = [] as any;

        upstream.set("color", "red");
        upstream.set("size", 4);
        downstream.upstream = upstream;

        downstream.handleChange = (src, keys) => {
            called = true;
            source = src;
            args = args.concat(keys);
        };

        downstream.upstream = null;

        assert(source === upstream);
        assert(called);
        expect(args).to.contain("color");
        expect(args).to.contain("size");
    });

    describe("should not notify", () => {
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
            assert(calls === 1);

            downstream.delete("color");

            assert(calls === 1);
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
            assert(calls === 1);

            downstream.set("color", "red");

            assert(calls === 1);
            assert(downstream.get("color") === "red");
        });
    });
});
