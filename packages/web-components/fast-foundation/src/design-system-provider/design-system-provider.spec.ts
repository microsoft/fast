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
    public a: Symbol;

    @designSystemProperty({
        default: b,
        cssCustomProperty: false,
        attribute: false,
    })
    public b: Symbol;
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
    public b: Symbol;

    @designSystemProperty({
        default: Symbol(),
        cssCustomProperty: false,
        attribute: false,
    })
    public c: Symbol;
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
    describe("that is nested inside an instance of a different DesignSystemProvider definition", () => {
        it("should have a design system that is the union of ancestor's and descendant's design system properties", async () => {
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
    });
});
