import { Observable } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../fixture";
import {
    DesignSystemProvider,
    designSystemProperty,
    defineDesignSystemProvider,
    DesignSystemProviderTemplate as template,
} from "./index";

const a = Symbol();
const b = Symbol();
const c = Symbol();

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
        default: b,
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

async function setup() {
    const { element: dspA, connect: connectA, disconnect: disconnectA } = await fixture<
        DSPA
    >("dsp-a");
    const { element: dspB, connect: connectB, disconnect: disconnectB } = await fixture<
        DSPB
    >("dsp-b");

    return {
        dspA,
        dspB,
        connect: async () => Promise.all([connectA(), connectB()]),
        disconnect: async () => Promise.all([disconnectA(), disconnectB()]),
    };
}

describe("A DesignSystemProvider", () => {
    describe("that is nested inside an instance of the same DesignSystemProvider definition", () => {
        it("should sync all unset design system properties from the parent provider", done => {
            const dspA = document.createElement("dsp-a") as DSPA;
            const dspB = document.createElement("dsp-a") as DSPA;
            dspA.useDefaults = true;
            dspA.appendChild(dspB);
            document.body.appendChild(dspA);
            const aAccessors = Observable.getAccessors(dspA.designSystem);

            expect(aAccessors.length).to.equal(2);

            console.log(dspA.designSystem, dspB.designSystem);

            window.setTimeout(() => {
                // console.log("Starting tests", dspB.designSystem)
                Observable.getAccessors(dspA.designSystem).forEach(x => {
                    // console.log("testing", x.name, dspB.designSystem[x.name])
                    // expect(dspB.designSystem[x.name]).not.to.equal(undefined)
                    expect(dspA.designSystem[x.name]).to.equal(dspB.designSystem[x.name]);
                });
                done();
            }, 0);
        });

        xit("should update it's local design system when a parent DesignSystemProperty is changed and the local property is unset", done => {
            const dspA = document.createElement("dsp-a") as DSPA;
            const dspB = document.createElement("dsp-a") as DSPA;
            dspA.useDefaults = true;
            dspA.appendChild(dspB);
            document.body.appendChild(dspA);

            window.setTimeout(() => {
                dspA.a = Symbol();
                Observable.getAccessors(dspA.designSystem).forEach(x => {
                    expect(dspB.designSystem[x.name]).not.to.equal(undefined);
                    expect(dspA.designSystem[x.name]).to.equal(dspB.designSystem[x.name]);
                });

                done();
            });
        });
    });

    describe("that is nested inside an instance of a different DesignSystemProvider definition", () => {
        xit("should have a design system that is the union of ancestor's and descendant's design system properties", async () => {
            const { dspA, dspB, connect, disconnect } = await setup();
            await connect();

            dspA.a = a;
            dspA.b = b;

            dspB.b = b;
            dspB.c = c;

            dspA.appendChild(dspB);

            await Promise.resolve();

            expect((dspB.designSystem as any).a).to.equal(a);
            expect((dspB.designSystem as any).b).to.equal(b);
            expect((dspB.designSystem as any).c).to.equal(c);

            await disconnect();
        });

        xit("should have a design system that is the union of ancestor's when deeply nested", done => {
            const dspA = document.createElement("dsp-a") as DSPA;
            const dspB = document.createElement("dsp-b") as DSPB;
            const dspC = document.createElement("dsp-c") as DSPC;

            dspA.useDefaults = true;
            dspB.useDefaults = true;
            dspC.useDefaults = true;
            dspB.appendChild(dspC);
            dspA.appendChild(dspB);
            document.body.appendChild(dspA);

            window.setTimeout(() => {
                // expect(dspC.designSystem['a']).not.to.equal(undefined);
                // expect(dspC.designSystem['b']).not.to.equal(undefined);
                expect(dspC.designSystem["c"]).not.to.equal(undefined);
                expect(dspC.designSystem["d"]).not.to.equal(undefined);

                expect(dspC.designSystem["a"]).to.equal(dspA.designSystem["a"]);
                expect(dspC.designSystem["b"]).to.equal(dspA.designSystem["b"]);
                expect(dspC.designSystem["c"]).to.equal(dspA.designSystem["c"]);

                // Observable.getAccessors(dspA.designSystem).forEach(x => {
                //     expect(dspB.designSystem[x.name]).not.to.equal(undefined)
                //     expect(dspA.designSystem[x.name]).to.equal(dspB.designSystem[x.name])
                // })
                done();
            });
        });
    });
});
