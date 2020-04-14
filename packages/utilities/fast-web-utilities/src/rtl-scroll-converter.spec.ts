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
    test("should not throw on getter", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        expect(() => {
            RtlScrollConverter.getScrollLeft(testElement, Direction.ltr);
        }).not.toThrow();
    });

    test("should not throw on setter", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        expect(() => {
            RtlScrollConverter.setScrollLeft(testElement, 0, Direction.ltr);
        }).not.toThrow();
    });

    // note: this test must happen before any rtl calls to getScrollLeft/setScrollLeft in this test suite
    test("getter and setter start as referencing initial function", () => {
        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["initialGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["initialSetRtlScrollConverter"]
        );
    });

    test("calling getter with inital function set applies converters", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        RtlScrollConverter["getRtlScrollLeftConverter"] =
            RtlScrollConverter["initialGetRtlScrollConverter"];
        RtlScrollConverter["setRtlScrollLeftConverter"] =
            RtlScrollConverter["initialSetRtlScrollConverter"];

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["initialGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["initialSetRtlScrollConverter"]
        );

        RtlScrollConverter.getScrollLeft(testElement, Direction.rtl);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    test("calling setter with inital function set applies converters", () => {
        const testElement: HTMLDivElement = getDummyDiv();

        RtlScrollConverter["getRtlScrollLeftConverter"] =
            RtlScrollConverter["initialGetRtlScrollConverter"];
        RtlScrollConverter["setRtlScrollLeftConverter"] =
            RtlScrollConverter["initialSetRtlScrollConverter"];

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["initialGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["initialSetRtlScrollConverter"]
        );

        RtlScrollConverter.setScrollLeft(testElement, -1, Direction.rtl);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    test("directGetRtlScrollConverter returns correct value", () => {
        const testElement: HTMLDivElement = getDummyDiv();
        testElement.scrollLeft = -1;

        expect(RtlScrollConverter["directGetRtlScrollConverter"](testElement)).toEqual(
            -1
        );
    });

    test("invertedGetRtlScrollConverter returns correct value", () => {
        const testElement: HTMLDivElement = getDummyDiv();
        testElement.scrollLeft = 1;

        expect(RtlScrollConverter["invertedGetRtlScrollConverter"](testElement)).toEqual(
            -1
        );
    });

    test("reverseGetRtlScrollConverter returns correct value", () => {
        const testElement: HTMLDivElement = getDummyDiv();
        testElement.scrollLeft = 0;

        expect(RtlScrollConverter["reverseGetRtlScrollConverter"](testElement)).toEqual(
            testElement.scrollWidth - testElement.clientWidth
        );

        testElement.scrollLeft = -1;

        expect(RtlScrollConverter["reverseGetRtlScrollConverter"](testElement)).toEqual(
            testElement.scrollWidth - testElement.clientWidth - 1
        );
    });

    test("directSetRtlScrollConverter applies correct value", () => {
        const testElement: HTMLDivElement = { scrollLeft: 0 } as HTMLDivElement;
        RtlScrollConverter["directSetRtlScrollConverter"](testElement, -100);
        expect(testElement.scrollLeft).toEqual(-100);
    });

    test("invertedSetRtlScrollConverter applies correct value", () => {
        const testElement: HTMLDivElement = { scrollLeft: 0 } as HTMLDivElement;
        RtlScrollConverter["invertedSetRtlScrollConverter"](testElement, -100);
        expect(testElement.scrollLeft).toEqual(100);
    });

    test("reverseSetRtlScrollConverter applies correct value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
            clientWidth: 100,
            scrollWidth: 200,
        } as HTMLDivElement;
        RtlScrollConverter["reverseSetRtlScrollConverter"](testElement, -100);
        expect(testElement.scrollLeft).toEqual(0);
    });

    test("getter should not adjust value in ltr mode", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: -200,
        } as HTMLDivElement;

        expect(RtlScrollConverter.getScrollLeft(testElement, Direction.ltr)).toEqual(
            -200
        );
    });

    test("setter should not adjust value in ltr mode", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        RtlScrollConverter.setScrollLeft(testElement, -200, Direction.ltr);
        expect(testElement.scrollLeft).toEqual(-200);
    });

    test("generated test element has correct attributes", () => {
        const testElement: HTMLDivElement = RtlScrollConverter["getTestElement"]();

        expect(testElement.dir).toEqual("rtl");
        expect(testElement.style.fontSize).toEqual("14px");
        expect(testElement.style.width).toEqual("4px");
        expect(testElement.style.height).toEqual("1px");
        expect(testElement.style.position).toEqual("absolute");
        expect(testElement.style.top).toEqual("-1000px");
        expect(testElement.style.overflow).toEqual("scroll");
    });

    test("applyDirectScrollConverters applies correct converters", () => {
        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).not.toBe(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).not.toBe(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );

        RtlScrollConverter["applyDirectScrollConverters"]();

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    test("applyInvertedScrollConverters applies correct converters", () => {
        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).not.toBe(
            RtlScrollConverter["invertedGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).not.toBe(
            RtlScrollConverter["invertedSetRtlScrollConverter"]
        );

        RtlScrollConverter["applyInvertedScrollConverters"]();

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["invertedGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["invertedSetRtlScrollConverter"]
        );
    });

    test("applyReverseScrollConverters applies correct converters", () => {
        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).not.toBe(
            RtlScrollConverter["reverseGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).not.toBe(
            RtlScrollConverter["reverseSetRtlScrollConverter"]
        );

        RtlScrollConverter["applyReverseScrollConverters"]();

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["reverseGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["reverseSetRtlScrollConverter"]
        );
    });

    test("isReverse returns true if provided with an element with a positive scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 1,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isReverse"](testElement)).toBe(true);
    });

    test("isReverse returns false if provided with an element with a 0 scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isReverse"](testElement)).toBe(false);
    });

    test("isReverse returns false if provided with an element with a negative scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: -1,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isReverse"](testElement)).toBe(false);
    });

    test("isDirect returns true if provided with an element that accepts a negative scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        expect(RtlScrollConverter["isDirect"](testElement)).toBe(true);
    });

    test("checkForScrollType applies reverse converters if provided with an element with a positive scroll value", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 1,
        } as HTMLDivElement;

        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        RtlScrollConverter["checkForScrollType"](testElement);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["reverseGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["reverseSetRtlScrollConverter"]
        );
    });

    test("checkForScrollType applies direct converters if provided with an element with a scroll value of 0 that uses negative values", () => {
        const testElement: HTMLDivElement = {
            scrollLeft: 0,
        } as HTMLDivElement;

        RtlScrollConverter["getRtlScrollLeftConverter"] = null;
        RtlScrollConverter["setRtlScrollLeftConverter"] = null;

        RtlScrollConverter["checkForScrollType"](testElement);

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["directSetRtlScrollConverter"]
        );
    });

    test("checkForScrollType applies inverted converters if provided with a scroll value of 0 that uses positive values", () => {
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

        expect(RtlScrollConverter["getRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["invertedGetRtlScrollConverter"]
        );
        expect(RtlScrollConverter["setRtlScrollLeftConverter"]).toBe(
            RtlScrollConverter["invertedSetRtlScrollConverter"]
        );
    });
});
