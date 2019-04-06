import { mergeDesignSystem } from "./index";
import * as ShallowRenderer from "react-test-renderer/shallow";

describe("mergeDesignSystem", (): void => {
    test("should return a new object", (): void => {
        const src: any = {};
        const overrides: any = {};
        expect(mergeDesignSystem(src, overrides)).not.toBe(src);
        expect(mergeDesignSystem(src, overrides)).not.toBe(overrides);
    });

    test("should merge string values by assignment", (): void => {
        expect(mergeDesignSystem({ a: "foo" }, { a: "bar" }).a).toBe("bar");
    });

    test("should merge number values by assignment", (): void => {
        expect(mergeDesignSystem({ a: 0 }, { a: 1 }).a).toBe(1);
    });

    test("should merge nested object recursivly", (): void => {
        expect(
            mergeDesignSystem({ a: { a: "foo", bar: "foo" } }, { a: { b: "bar" } })
        ).toMatchObject({
            a: {
                a: "foo",
                b: "bar",
            },
        });
    });

    test("should merge array values by assignment", (): void => {
        expect(mergeDesignSystem({ a: ["foo"] }, { a: ["bar"] })).toMatchObject({
            a: ["bar"],
        });
    });
});
