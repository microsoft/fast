import { expect } from "chai";
import { RtlScrollConverter } from "./rtl-scroll-converter";
import { Direction } from "./localization";

function getDummyDiv(): HTMLDivElement {
    const dummy: HTMLDivElement = document.createElement("div");
    dummy.appendChild(document.createTextNode("ABCD"));
    dummy.dir = "rtl";
    dummy.style.fontSize = "14px";
    dummy.style.width = "4px";
    dummy.style.height = "1px";
    dummy.style.position = "absolute";
    dummy.style.top = "-1000px";
    dummy.style.overflow = "scroll";
    return dummy;
}

describe("RtlScrollConverter", (): void => {
    it("should not throw on getter", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        expect(() => {
            RtlScrollConverter.getScrollLeft(testElement, Direction.ltr);
        }).not.to.throw();
    });

    it("should not throw on setter", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        expect(() => {
            RtlScrollConverter.setScrollLeft(testElement, 0, Direction.ltr);
        }).not.to.throw();
    });

    // note: this test must happen before any rtl calls to getScrollLeft/setScrollLeft in this test suite
    it("getter and setter start as referencing initial function", () => {
        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["initialGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["initialSetRtlScrollConverter"]
        );
    });

    it("calling getter with inital function set applies converters", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        RtlScrollConverter["getRtlScrollLeftConverter"] =
            RtlScrollConverter["initialGetRtlScrollConverter"];
        RtlScrollConverter["setRtlScrollLeftConverter"] =
            RtlScrollConverter["initialSetRtlScrollConverter"];

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["initialGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["initialSetRtlScrollConverter"]
        );

        RtlScrollConverter.getScrollLeft(testElement, Direction.rtl);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    it("calling setter with inital function set applies converters", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        RtlScrollConverter["getRtlScrollLeftConverter"] =
            RtlScrollConverter["initialGetRtlScrollConverter"];
        RtlScrollConverter["setRtlScrollLeftConverter"] =
            RtlScrollConverter["initialSetRtlScrollConverter"];

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["initialGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["initialSetRtlScrollConverter"]
        );

        RtlScrollConverter.setScrollLeft(testElement, -1, Direction.rtl);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    it("directGetRtlScrollConverter returns correct value", () => {
        const testElement: HTMLDivElement = getDummyDiv();
        document.body.appendChild(testElement);
        testElement.scrollLeft = -1;

        expect(RtlScrollConverter["directGetRtlScrollConverter"](testElement)).to.equal(
            -1
        );
    });

    it("invertedGetRtlScrollConverter returns correct value", () => {
        const testElement: HTMLDivElement = getDummyDiv();
        document.body.appendChild(testElement);
        testElement.scrollLeft = 1;

        expect(RtlScrollConverter["invertedGetRtlScrollConverter"](testElement)).to.equal(
            -1
        );
    });

    it("reverseGetRtlScrollConverter returns correct value", () => {
        const testElement: HTMLDivElement = getDummyDiv();
        testElement.scrollLeft = 0;
        document.body.appendChild(testElement);

        expect(RtlScrollConverter["reverseGetRtlScrollConverter"](testElement)).to.equal(
            testElement.scrollLeft - (testElement.scrollWidth - testElement.clientWidth)
        );

        testElement.scrollLeft = -1;

        expect(RtlScrollConverter["reverseGetRtlScrollConverter"](testElement)).to.equal(
            -1 - (testElement.scrollWidth - testElement.clientWidth)
        );
    });

    it("directSetRtlScrollConverter applies correct value", () => {
        const testElement: HTMLDivElement = { scrollLeft: 0 } as HTMLDivElement;
        RtlScrollConverter["directSetRtlScrollConverter"](testElement, -100);
        expect(testElement.scrollLeft).to.equal(-100);
    });

    it("invertedSetRtlScrollConverter applies correct value", () => {
        const testElement: HTMLDivElement = { scrollLeft: 0 } as HTMLDivElement;
        RtlScrollConverter["invertedSetRtlScrollConverter"](testElement, -100);
        expect(testElement.scrollLeft).to.equal(100);
    });

    it("reverseSetRtlScrollConverter applies correct value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
            clientWidth: 100,
            scrollWidth: 200,
        } as HTMLDivElement;
        RtlScrollConverter["reverseSetRtlScrollConverter"](testElement, -100);
        expect(testElement.scrollLeft).to.equal(0);
    });

    it("getter should not adjust value in ltr mode", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: -200,
        } as HTMLDivElement;

        expect(RtlScrollConverter.getScrollLeft(testElement, Direction.ltr)).to.equal(
            -200
        );
    });

    it("setter should not adjust value in ltr mode", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        RtlScrollConverter.setScrollLeft(testElement, -200, Direction.ltr);
        expect(testElement.scrollLeft).to.equal(-200);
    });

    it("generated test element has correct attributes", () => {
        const testElement: HTMLDivElement = RtlScrollConverter["getTestElement"]();

        expect(testElement.dir).to.equal("rtl");
        expect(testElement.style.fontSize).to.equal("14px");
        expect(testElement.style.width).to.equal("4px");
        expect(testElement.style.height).to.equal("1px");
        expect(testElement.style.position).to.equal("absolute");
        expect(testElement.style.top).to.equal("-1000px");
        expect(testElement.style.overflow).to.equal("scroll");
    });

    it("applyDirectScrollConverters applies correct converters", () => {
        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).not.to.equal(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).not.to.equal(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );

        RtlScrollConverter["applyDirectScrollConverters"]();

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    it("applyInvertedScrollConverters applies correct converters", () => {
        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).not.to.equal(
            RtlScrollConverter["invertedGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).not.to.equal(
            RtlScrollConverter["invertedSetRtlScrollConverter"]
        );

        RtlScrollConverter["applyInvertedScrollConverters"]();

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["invertedGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["invertedSetRtlScrollConverter"]
        );
    });

    it("applyReverseScrollConverters applies correct converters", () => {
        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).not.to.equal(
            RtlScrollConverter["reverseGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).not.to.equal(
            RtlScrollConverter["reverseSetRtlScrollConverter"]
        );

        RtlScrollConverter["applyReverseScrollConverters"]();

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["reverseGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["reverseSetRtlScrollConverter"]
        );
    });

    it("isReverse returns true if provided with an element with a positive scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 1,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isReverse"](testElement)).to.equal(true);
    });

    it("isReverse returns false if provided with an element with a 0 scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isReverse"](testElement)).to.equal(false);
    });

    it("isReverse returns false if provided with an element with a negative scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: -1,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isReverse"](testElement)).to.equal(false);
    });

    it("isDirect returns true if provided with an element that accepts a negative scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isDirect"](testElement)).to.equal(true);
    });

    it("checkForScrollType applies reverse converters if provided with an element with a positive scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 1,
        } as HTMLDivElement;

        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        RtlScrollConverter["checkForScrollType"](testElement);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["reverseGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["reverseSetRtlScrollConverter"]
        );
    });

    it("checkForScrollType applies direct converters if provided with an element with a scroll value of 0 that uses negative values", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        RtlScrollConverter["checkForScrollType"](testElement);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    it("checkForScrollType applies inverted converters if provided with a scroll value of 0 that uses positive values", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        Object.defineProperty(testElement, "scrollLeft", {
            get(): number {
                return this._value;
            },
            set(newValue: number): void {
                this._value = Math.abs(newValue);
            },
        });

        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        RtlScrollConverter["checkForScrollType"](testElement);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["invertedGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).to.equal(
            RtlScrollConverter["invertedSetRtlScrollConverter"]
        );
    });
});
