import {
    applyFocusVisible,
    applyFocusVisiblePolyfillSelector,
    applyFocusVisibleSelector,
} from "./apply-focus-visible";
import { CSSRules } from "@microsoft/fast-jss-manager";

/**
 * Mock and allow control of focus-visible return value
 */
let canUseFocusVisible: boolean = false;
jest.mock("@microsoft/fast-web-utilities", () => {
    return {
        canUseFocusVisible: (): boolean => canUseFocusVisible,
    };
});

const styles: CSSRules<any> = {
    color: "red",
};

describe("apply focus visible", (): void => {
    beforeEach((): void => {
        canUseFocusVisible = false;
    });
    test("should return if arguments are null or undefined", (): void => {
        expect(applyFocusVisible(undefined, undefined)).toEqual({});
        expect(applyFocusVisible(null, null)).toEqual({});
    });
    test("should return a selector that hides default focus outlines", (): void => {
        expect(applyFocusVisible(styles)["&:focus"]).not.toBeUndefined();
        expect(applyFocusVisible("", styles)["&:focus"]).not.toBeUndefined();
    });
    test("should implement focus-visible if it is supported by the experience", (): void => {
        canUseFocusVisible = true;
        expect(applyFocusVisible(styles)[applyFocusVisibleSelector()]).toEqual(styles);
        expect(
            applyFocusVisible(styles)[applyFocusVisiblePolyfillSelector()]
        ).toBeUndefined();
    });
    test("should implement focus-visible polyfill selector if focus-visible is not supported by the browser", (): void => {
        expect(applyFocusVisible(styles)[applyFocusVisibleSelector()]).toBeUndefined();
        expect(applyFocusVisible(styles)[applyFocusVisiblePolyfillSelector()]).toEqual(
            styles
        );
    });
    test("should allow selector agumentation", (): void => {
        canUseFocusVisible = true;
        expect(
            applyFocusVisible(" .some-child", styles)[
                applyFocusVisibleSelector(" .some-child")
            ]
        ).toEqual(styles);

        canUseFocusVisible = false;
        expect(
            applyFocusVisible(" .some-child", styles)[
                applyFocusVisiblePolyfillSelector(" .some-child")
            ]
        ).toEqual(styles);
    });
});
