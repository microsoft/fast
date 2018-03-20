/* tslint:disable:no-string-literal */
import Animate, { IAnimateOptions } from "../lib/animate";
class AnimateMock extends Animate {}

describe("Animate initilization", () => {
    const fakeElement: HTMLElement = document.createElement("div");

    test("should register a single input element", () => {
       expect(new AnimateMock(fakeElement)["animationTarget"]).toBe(fakeElement);
    });

    test("should correctly assign options", () => {
        expect( new AnimateMock(fakeElement).options ).toEqual({});
    });
});

describe("getPropertiesToAnimate", () => {
    const fakeElement: HTMLElement = document.createElement("div");

    test("should return an empty array when no options are set", () => {
        expect(new AnimateMock(fakeElement)["getPropertiesToAnimate"]()).toEqual([]);
    });

    test('should return an array with a single index of "transform" when x is set', () => {
        expect(new AnimateMock(fakeElement, { x: 20 })["getPropertiesToAnimate"]()).toEqual(["transform"]);
    });

    test('should return an array with a single index of "transform" when y is set', () => {
        expect(new AnimateMock(fakeElement, { y: 20 })["getPropertiesToAnimate"]()).toEqual(["transform"]);
    });

    test('should return an array with a single index of "transform" when rotate is set', () => {
        expect(new AnimateMock(fakeElement, { rotate: 20 })["getPropertiesToAnimate"]()).toEqual(["transform"]);
    });

    test('should return an array with a single index of "transform" when scale is set', () => {
        expect(new AnimateMock(fakeElement, { scale: 20 })["getPropertiesToAnimate"]()).toEqual(["transform"]);
    });

    test('should return an array with a single index of "transform" when scale is set', () => {
        expect(new AnimateMock(fakeElement, { scale: [20, 10] })["getPropertiesToAnimate"]()).toEqual(["transform"]);
    });

    test('should return an array with a single index of "opacity" when opacity is set', () => {
        expect(new AnimateMock(fakeElement, { opacity: 0 })["getPropertiesToAnimate"]()).toEqual(["opacity"]);
    });

    test('should return an array with both "transform" and "opacity" when opacity and x are set', () => {
        const properties: string[] = new AnimateMock(fakeElement, { x: 20, opacity: 0 })["getPropertiesToAnimate"]();

        expect(properties.includes("opacity")).toBe(true);
        expect(properties.includes("transform")).toBe(true);
    });

    test('should return an array with both "transform" and "opacity" when opacity and y are set', () => {
        const properties: string[] = new AnimateMock(fakeElement, { y: 20, opacity: 0 })["getPropertiesToAnimate"]();

        expect(properties.includes("opacity")).toBe(true);
        expect(properties.includes("transform")).toBe(true);
    });

    test('should return an array with both "transform" and "opacity" when opacity and rotate are set', () => {
        const properties: string[] = new AnimateMock(fakeElement, { rotate: 20, opacity: 0 })["getPropertiesToAnimate"]();

        expect(properties.includes("opacity")).toBe(true);
        expect(properties.includes("transform")).toBe(true);
    });

    test('should return an array with both "transform" and "opacity" when opacity and scale are set', () => {
        const properties: string[] = new AnimateMock(fakeElement, { scale: 20, opacity: 0 })["getPropertiesToAnimate"]();

        expect(properties.includes("opacity")).toBe(true);
        expect(properties.includes("transform")).toBe(true);
    });

    test('should return an array with "transform" when more than one transform properties are set', () => {
        const properties: string[] = new AnimateMock(fakeElement, { scale: 20, rotate: 20, x: 20, y: 20 })["getPropertiesToAnimate"]();

        expect(properties).toEqual(["transform"]);
    });
});

describe("formatTransformFunction", () => {
    const animation: AnimateMock = new AnimateMock(document.createElement("div"));

    test("should correctly format the x config", () => {
        expect(animation["formatTransformFunction"]("x", 20)).toBe("translateX(20px)");
    });
    test("should correctly format the y config", () => {
        expect(animation["formatTransformFunction"]("y", 20)).toBe("translateY(20px)");
    });
    test("should correctly format the x config", () => {
        expect(animation["formatTransformFunction"]("x", "20%")).toBe("translateX(20%)");
    });
    test("should correctly format the y config", () => {
        expect(animation["formatTransformFunction"]("y", "20%")).toBe("translateY(20%)");
    });
    test("should correctly format the rotate config", () => {
        expect(animation["formatTransformFunction"]("rotate", 20)).toBe("rotate(20deg)");
    });
    test("should correctly format the scale config", () => {
        expect(animation["formatTransformFunction"]("scale", 20)).toBe("scale(20)");
    });
    test("should correctly format the scale config", () => {
        expect(animation["formatTransformFunction"]("scale", [20, 10])).toBe("scale(20,10)");
    });
    test("should return empty string if function cannot be converted to a transform function", () => {
        expect(animation["formatTransformFunction"]("foobar", 20)).toBe("");
    });
});

describe("getOptionKeyframeValues", () => {
    const fakeElement: HTMLElement = document.createElement("div");

    test("should correclty create opacity keyframe value", () => {
        expect(new AnimateMock(fakeElement, { opacity: 0 })["getOptionKeyframeValues"]()).toEqual({ opacity: "0" });
    });

    test("should correclty create x keyframe value", () => {
        expect(new AnimateMock(fakeElement, { x: 20 })["getOptionKeyframeValues"]()).toEqual({ transform: "translateX(20px)" });
    });

    test("should correclty create opacity keyframe value", () => {
        expect(new AnimateMock(fakeElement, { y: 20 })["getOptionKeyframeValues"]()).toEqual({ transform: "translateY(20px)" });
    });

    test("should correclty create x keyframe value", () => {
        expect(new AnimateMock(fakeElement, { x: "20%" })["getOptionKeyframeValues"]()).toEqual({ transform: "translateX(20%)" });
    });

    test("should correclty create opacity keyframe value", () => {
        expect(new AnimateMock(fakeElement, { y: "20%" })["getOptionKeyframeValues"]()).toEqual({ transform: "translateY(20%)" });
    });

    test("should correclty create opacity keyframe value", () => {
        expect(new AnimateMock(fakeElement, { scale: 20 })["getOptionKeyframeValues"]()).toEqual({ transform: "scale(20)" });
    });

    test("should correclty create opacity keyframe value", () => {
        expect(new AnimateMock(fakeElement, { scale: [20, 10] })["getOptionKeyframeValues"]()).toEqual({ transform: "scale(20,10)" });
    });

    test("should correclty create opacity keyframe value", () => {
        expect(new AnimateMock(fakeElement, { rotate: 20 })["getOptionKeyframeValues"]()).toEqual({ transform: "rotate(20deg)" });
    });
});

describe("getOptionKeyframes", () => {
    const fakeElement: HTMLElement = document.createElement("div");

    // All keyframes will have an initial property value of `undefined` because we rely on the native browsers 'getComputedStyle'
    // method to obtain initial values, which in a node environment return undefined.
    test("should correctly return keyframes with the x option", () => {
        expect(new AnimateMock(fakeElement, { x: 20 })["getOptionKeyframes"]()).toEqual([
            { transform: undefined },
            { transform: "translateX(20px)" }
        ]);
    });

    test("should correctly return keyframes with the y option", () => {
        expect(new AnimateMock(fakeElement, { y: 20 })["getOptionKeyframes"]()).toEqual([
            { transform: undefined },
            { transform: "translateY(20px)" }
        ]);
    });

    test("should correctly return keyframes with the scale option", () => {
        expect(new AnimateMock(fakeElement, { scale: 20 })["getOptionKeyframes"]()).toEqual([
            { transform: undefined },
            { transform: "scale(20)" }
        ]);
    });

    test("should correctly return keyframes with the independent scale option", () => {
        expect(new AnimateMock(fakeElement, { scale: [20, 10] })["getOptionKeyframes"]()).toEqual([
            { transform: undefined },
            { transform: "scale(20,10)" }
        ]);
    });

    test("should correctly return keyframes with the rotate option", () => {
        expect(new AnimateMock(fakeElement, { rotate: 20 })["getOptionKeyframes"]()).toEqual([
            { transform: undefined },
            { transform: "rotate(20deg)" }
        ]);
    });

    test("should correctly return keyframes with the opacity option", () => {
        expect(new AnimateMock(fakeElement, { opacity: 1 })["getOptionKeyframes"]()).toEqual([{ opacity: "" }, { opacity: "1" }]);
    });

    test("should correctly return keyframes with both an opacity and transform function", () => {
        expect(new AnimateMock(fakeElement, { opacity: 1, scale: 2 })["getOptionKeyframes"]()).toEqual([
            { opacity: "", scale: undefined },
            { opacity: "1", transform: "scale(2)" }
        ]);
    });

    test("should correctly return keyframes with both two transform functions", () => {
        expect(new AnimateMock(fakeElement, { x: 20, scale: 2 })["getOptionKeyframes"]()).toEqual([
            { transform: undefined },
            { transform: "translateX(20px) scale(2)" }
        ]);
    });
});

describe("sortOffsets", () => {
    test("should sort offset strings in ascending order", () => {
        const setOne: string[] = ["0", "1"];
        const setTwo: string[] = ["1", "0"];
        const setThree: string[] = [".72", ".29", "1", ".1", "0"];
        const sortOffsets: (offsets: string[]) => string[] = new AnimateMock(document.createElement("div"))["sortOffsets"];

        expect(sortOffsets(setOne)).toEqual(["0", "1"]);
        expect(sortOffsets(setTwo)).toEqual(["0", "1"]);
        expect(sortOffsets(setThree)).toEqual(["0", ".1", ".29", ".72", "1"]);
    });
});

describe("consolidateKeyframes", () => {
    const fakeElement: HTMLElement = document.createElement("div");
    const expectedOne: any[] = [
        {offset: 0, opacity: "", transform: undefined},
        {offset: 1, opacity: "0", transform: "translateX(20px) translateY(20px) rotate(20deg) scale(20)"}
    ];
    const sourceOne: IAnimateOptions = { scale: 20, opacity: 0, rotate: 20, x: 20, y: 20 };
    const customKeyframes: AnimationKeyFrame[] = [
        { opacity: 0 },
        { opacity: 0.75, offset: 0.75 },
        { opacity: 1 }
    ];
    test("should correctly consolidate and sort keyframes created by options", () => {
        expect(new AnimateMock(fakeElement, sourceOne).keyframes).toEqual(expectedOne);
    });

    test("should correctly consolidate after addKeyframes is used", () => {
        const mock: AnimateMock = new AnimateMock(fakeElement);
        mock.addKeyframes(customKeyframes);

        expect(mock.keyframes).toEqual([{opacity: 0, offset: 0}, {opacity: 0.75, offset: 0.75 }, {opacity: 1, offset: 1}]);
    });

    test("should correclty consolidate both options and added keyframes", () => {
        const mock: AnimateMock = new AnimateMock(fakeElement, { scale: 20 });
        mock.addKeyframes(customKeyframes);

        expect(mock.keyframes).toEqual([
            {offset: 0, opacity: 0, transform: undefined},
            {offset: 0.75, opacity: 0.75},
            {offset: 1, opacity: 1, transform: "scale(20)"}
        ]);
    });
});
