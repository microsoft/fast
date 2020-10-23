import { Observable } from "@microsoft/fast-element";
import { assert, expect } from "chai";
import { fixture } from "../fixture";
import {
    defineDesignSystemProvider,
    designSystemProperty,
    DesignSystemProvider,
    DesignSystemProviderTemplate as template,
} from "./index";

@defineDesignSystemProvider({
    name: "dsp-a",
    template,
})
class DSPA extends DesignSystemProvider {
    @designSystemProperty({
        default: Symbol(),
        cssCustomProperty: false,
        attribute: false,
    })
    public a: symbol;

    @designSystemProperty({
        default: Symbol(),
        cssCustomProperty: false,
        attribute: false,
    })
    public b: symbol;
}

@defineDesignSystemProvider({
    name: "dsp-b",
    template,
})
class DSPB extends DesignSystemProvider {
    @designSystemProperty({
        default: Symbol(),
        cssCustomProperty: false,
        attribute: false,
    })
    public b: symbol;

    @designSystemProperty({
        default: Symbol(),
        cssCustomProperty: false,
        attribute: false,
    })
    public c: symbol;
}

@defineDesignSystemProvider({
    name: "dsp-c",
    template,
})
class DSPC extends DesignSystemProvider {
    @designSystemProperty({
        default: Symbol(),
        cssCustomProperty: false,
        attribute: false,
    })
    public c: symbol;

    @designSystemProperty({
        default: Symbol(),
        cssCustomProperty: false,
        attribute: false,
    })
    public d: symbol;
}

class DSPCustomProperties extends DesignSystemProvider {
    @designSystemProperty({
        default: "blue",
    })
    public color: string;
}

@defineDesignSystemProvider({
    name: "dsp-custom-properties-open",
    template,
})
class DSPCustomPropertiesOpen extends DSPCustomProperties {}

@defineDesignSystemProvider({
    name: "dsp-custom-properties-closed",
    template,
    shadowOptions: {
        mode: "closed",
    },
})
class DSPCustomPropertiesClosed extends DSPCustomProperties {}

async function setup() {
    const { element: a, connect: connectA, disconnect: disconnectA } = await fixture<
        DSPA
    >("dsp-a");
    const { element: b, connect: connectB, disconnect: disconnectB } = await fixture<
        DSPB
    >("dsp-b");

    return {
        a,
        b,
        connect: async () => Promise.all([connectA(), connectB()]),
        disconnect: async () => Promise.all([disconnectA(), disconnectB()]),
    };
}

describe("A DesignSystemProvider", () => {
    describe("should resolve a parent provider", () => {
        it("to null if the provider is not nested inside another provider", async () => {
            const { a, connect, disconnect } = await setup();

            await connect();

            expect(a.provider).to.equal(null);

            await disconnect();
        });
        it("to the DSP instance if it is nested inside another provider", async () => {
            const { a, b, connect, disconnect } = await setup();
            a.appendChild(b);

            await connect();

            expect(b.provider).to.equal(a);

            await disconnect();
        });
        it("to the nearest ancestor DSP instance when nested within non-DSP elements", async () => {
            const { a, b, connect, disconnect } = await setup();
            const div = Array(10)
                .fill(0)
                .reduce((prev, next) => {
                    const child = document.createElement("div");
                    prev.appendChild(child);
                    return child;
                }, document.createElement("div"));

            div.appendChild(b);
            a.appendChild(div);

            await connect();

            expect(b.provider).to.equal(a);

            await disconnect();
        });
    });

    describe("that has designSystemProperties set", () => {
        it("should reflect the set value to the designSystem object", async () => {
            const { a, connect, disconnect } = await setup();
            const value = Symbol();

            await connect();

            a.a = value;

            expect(a.designSystem["a"]).to.equal(value);

            await disconnect();
        });

        ["open", "closed"].forEach(mode => {
            describe(`with shadowMode: ${mode}`, () => {
                it("should write the default value when the use-defaults attribute is applied", () => {
                    const p = document.createElement(
                        `dsp-custom-properties-${mode}`
                    ) as DSPCustomProperties;
                    p.setAttribute("use-defaults", "");
                    document.body.appendChild(p);

                    expect(
                        window.getComputedStyle(p).getPropertyValue("--color")
                    ).to.equal("blue");
                });

                it("should not write the default value when the use-defaults attribute is applied but the property is also assigned", () => {
                    const p = document.createElement(
                        `dsp-custom-properties-${mode}`
                    ) as DSPCustomProperties;
                    p.color = "pink";
                    p.setAttribute("use-defaults", "");
                    document.body.appendChild(p);

                    expect(
                        window.getComputedStyle(p).getPropertyValue("--color")
                    ).to.equal("pink");
                });

                it("should not create a CSS custom property when the value is unassigned", () => {
                    const p = document.createElement(
                        `dsp-custom-properties-${mode}`
                    ) as DSPCustomProperties;
                    document.body.appendChild(p);

                    expect(
                        window.getComputedStyle(p).getPropertyValue("--color")
                    ).to.equal("");
                });

                it("should create a CSS custom property equal to the property value when the value is assigned", () => {
                    const p = document.createElement(
                        `dsp-custom-properties-${mode}`
                    ) as DSPCustomProperties;
                    document.body.appendChild(p);

                    p.color = "red";

                    expect(
                        window.getComputedStyle(p).getPropertyValue("--color")
                    ).to.equal("red");
                });

                it("should update a CSS custom property equal to the property value when the value is re-assigned", () => {
                    const p = document.createElement(
                        `dsp-custom-properties-${mode}`
                    ) as DSPCustomProperties;
                    document.body.appendChild(p);

                    expect(
                        window.getComputedStyle(p).getPropertyValue("--color")
                    ).to.equal("");

                    p.color = "green";

                    expect(
                        window.getComputedStyle(p).getPropertyValue("--color")
                    ).to.equal("green");

                    p.color = "blue";

                    expect(
                        window.getComputedStyle(p).getPropertyValue("--color")
                    ).to.equal("blue");
                });
            });
        });
    });

    describe("that is nested inside an instance of the same DesignSystemProvider definition", () => {
        it("should sync all unset design system properties from the parent provider", done => {
            const a = document.createElement("dsp-a") as DSPA;
            const n = document.createElement("dsp-a") as DSPA;
            a.useDefaults = true;
            a.appendChild(n);
            document.body.appendChild(a);
            const aAccessors = Observable.getAccessors(a.designSystem);

            expect(aAccessors.length).to.equal(2);

            window.setTimeout(() => {
                Observable.getAccessors(a.designSystem).forEach(x => {
                    expect(a.designSystem[x.name]).to.equal(n.designSystem[x.name]);
                });
                done();
            }, 0);
        });

        it("should update it's local design system when a parent DesignSystemProperty is changed and the local property is unset", done => {
            const a = document.createElement("dsp-a") as DSPA;
            const b = document.createElement("dsp-a") as DSPA;
            a.useDefaults = true;
            a.appendChild(b);
            document.body.appendChild(a);

            window.setTimeout(() => {
                a.a = Symbol();
                Observable.getAccessors(a.designSystem).forEach(x => {
                    expect(b.designSystem[x.name]).not.to.equal(undefined);
                    expect(a.designSystem[x.name]).to.equal(b.designSystem[x.name]);
                });

                done();
            });
        });

        it("should update it's local design system when a local DesignSystemProperty is changed", done => {
            const a = document.createElement("dsp-a") as DSPA;
            const b = document.createElement("dsp-a") as DSPA;
            a.useDefaults = true;
            a.appendChild(b);
            document.body.appendChild(a);
            const value = Symbol();

            window.setTimeout(() => {
                b.a = value;
                expect(b.designSystem["a"]).to.equal(value);
                expect(a.designSystem["a"]).equal(a.a);

                done();
            });
        });
    });

    describe("that is nested inside an instance of a different DesignSystemProvider definition", () => {
        it("should have a design system that is the union of ancestor's and descendant's design system properties", async () => {
            const { a, b, connect, disconnect } = await setup();
            await connect();

            const _a = Symbol();
            const _b = Symbol();
            const _c = Symbol();
            a.a = _a;
            a.b = _b;

            b.b = _b;
            b.c = _c;

            a.appendChild(b);

            await Promise.resolve();

            expect((b.designSystem as any).a).to.equal(_a);
            expect((b.designSystem as any).b).to.equal(_b);
            expect((b.designSystem as any).c).to.equal(_c);

            await disconnect();
        });
        it("should have a design system that is the union of ancestor's when deeply nested", done => {
            const a = document.createElement("dsp-a") as DSPA;
            const b = document.createElement("dsp-b") as DSPB;
            const c = document.createElement("dsp-c") as DSPC;

            a.useDefaults = true;
            b.useDefaults = true;
            c.useDefaults = true;
            b.appendChild(c);
            a.appendChild(b);
            document.body.appendChild(a);

            window.setTimeout(() => {
                expect(c.designSystem["a"]).not.to.equal(undefined);
                expect(c.designSystem["b"]).not.to.equal(undefined);
                expect(c.designSystem["c"]).not.to.equal(undefined);
                expect(c.designSystem["d"]).not.to.equal(undefined);

                expect(c.designSystem["a"]).to.equal(a.designSystem["a"]);
                expect(c.designSystem["b"]).to.equal(b.designSystem["b"]);
                expect(c.designSystem["c"]).to.equal(c.c);
                expect(c.designSystem["d"]).to.equal(c.d);

                done();
            });
        });
        it("should propagate property updates through providers where a parent provider doesn't declare the property as a designSystemProperty", done => {
            const a = document.createElement("dsp-a") as DSPA;
            const b = document.createElement("dsp-b") as DSPB;
            const c = document.createElement("dsp-c") as DSPC;

            a.useDefaults = true;
            b.useDefaults = true;
            c.useDefaults = true;
            b.appendChild(c);
            a.appendChild(b);
            document.body.appendChild(a);

            window.setTimeout(() => {
                expect(c.designSystem["a"]).to.equal(a.designSystem["a"]);
                const symbol = Symbol();
                a.a = symbol;

                expect(a.designSystem["a"]).to.equal(symbol);
                expect(c.designSystem["a"]).to.equal(symbol);
                done();
            });
        });
    });

    describe("with CSSCustomPropertyDefinition registered", () => {
        it("should write a static value to a CSS custom property after registration", async () => {
            const { a, connect, disconnect } = await setup();
            await connect();

            a.registerCSSCustomProperty({
                name: "my-property",
                value: "value",
            });

            expect(window.getComputedStyle(a).getPropertyValue("--my-property")).to.equal(
                "value"
            );
            await disconnect();
        });
        it("should write the product of a function value to a CSS custom property after registration", async () => {
            const { a, connect, disconnect } = await setup();
            await connect();

            a.registerCSSCustomProperty({
                name: "my-property",
                value: () => "value",
            });

            expect(window.getComputedStyle(a).getPropertyValue("--my-property")).to.equal(
                "value"
            );

            await disconnect();
        });
        it("should evaluate function values with the current designSystem object", async () => {
            const { a, connect, disconnect } = await setup();
            let arg: any;

            await connect();
            a.useDefaults = true;

            a.registerCSSCustomProperty({
                name: "my-property",
                value: v => {
                    arg = v;
                    return "value";
                },
            });

            expect(arg.a).to.equal(a.designSystem["a"]);
            expect(arg.b).to.equal(a.designSystem["b"]);

            await disconnect();
        });
        it("should remove the CSSCustomProperty after registration if it has only be registered once", async () => {
            const { a, connect, disconnect } = await setup();
            await connect();
            const def = {
                name: "my-property",
                value: "value",
            };

            a.registerCSSCustomProperty(def);

            a.unregisterCSSCustomProperty(def);

            expect(window.getComputedStyle(a).getPropertyValue("--my-property")).to.equal(
                ""
            );
            await disconnect();
        });
        it("should only remove a custom property after it has been unregistered the same number of times it has been registered", async () => {
            const { a, connect, disconnect } = await setup();
            await connect();
            const def = {
                name: "my-property",
                value: "value",
            };

            for (let i = 0, count = 10; i < count; i++) {
                a.registerCSSCustomProperty(def);
            }

            for (let i = 0, count = 10; i < count; i++) {
                a.unregisterCSSCustomProperty(def);

                if (i < count - 1) {
                    expect(
                        window.getComputedStyle(a).getPropertyValue("--my-property")
                    ).to.equal("value");
                } else {
                    expect(
                        window.getComputedStyle(a).getPropertyValue("--my-property")
                    ).to.equal("");
                }
            }

            await disconnect();
        });
        it("should write all registered CSSCustomPropertyDefinition objects when connected", async () => {
            const { a, connect, disconnect } = await setup();

            a.registerCSSCustomProperty({
                name: "static-value",
                value: "value",
            });
            a.registerCSSCustomProperty({
                name: "function-value",
                value: () => "value",
            });

            expect(
                window.getComputedStyle(a).getPropertyValue("--static-value")
            ).to.equal("");
            expect(
                window.getComputedStyle(a).getPropertyValue("--function-value")
            ).to.equal("");

            await connect();

            expect(
                window.getComputedStyle(a).getPropertyValue("--static-value")
            ).to.equal("value");
            expect(
                window.getComputedStyle(a).getPropertyValue("--function-value")
            ).to.equal("value");

            await disconnect();
        });
        it("should unregister all registered CSSCustomPropertyDefinition objects when connected", async () => {
            const { a, connect, disconnect } = await setup();

            a.registerCSSCustomProperty({
                name: "static-value",
                value: "value",
            });
            a.registerCSSCustomProperty({
                name: "function-value",
                value: () => "value",
            });

            await connect();
            await disconnect();

            expect(
                window.getComputedStyle(a).getPropertyValue("--static-value")
            ).to.equal("");
            expect(
                window.getComputedStyle(a).getPropertyValue("--function-value")
            ).to.equal("");
        });
    });
});
