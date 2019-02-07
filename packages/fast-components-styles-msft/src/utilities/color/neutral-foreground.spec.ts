import { neutralForeground } from "./neutral-foreground";
import designSystemDefaults from "../../design-system";

describe("neutralForeground", (): void => {
    test("should return a string when invoked with an object", (): void => {
        expect(typeof neutralForeground(designSystemDefaults)).toBe("string");
    });

    test("should return a function when invoked with a function", (): void => {
        expect(typeof neutralForeground(() => "#FFF")).toBe("function");
    });

    test("should opperate on default design system if no design system is supplied", (): void => {
        expect(neutralForeground(undefined as any)).toBe("#101010");
        expect(neutralForeground(() => undefined as any)(undefined as any)).toBe(
            "#101010"
        );
        expect(neutralForeground(() => "#FFF")(undefined as any)).toBe("#101010");
    });

    test("should return #101010 with default design system values", (): void => {
        expect(neutralForeground(designSystemDefaults)).toBe("#101010");
    });

    test("should return #FFF with a dark background", (): void => {
        expect(
            neutralForeground(
                Object.assign({}, designSystemDefaults, {
                    backgroundColor: "#000",
                })
            )
        ).toBe("#FFFFFF");
    });
});
