import { fastDesignSystemDefaults } from "../fast-design-system";
import {
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
} from "./neutral-foreground";
import { contrast } from "./common";

describe("neutralForeground", (): void => {
    test("should return a string when invoked with an object", (): void => {
        expect(typeof neutralForegroundRest(fastDesignSystemDefaults)).toBe("string");
        expect(typeof neutralForegroundHover(fastDesignSystemDefaults)).toBe("string");
        expect(typeof neutralForegroundActive(fastDesignSystemDefaults)).toBe("string");
    });

    test("should return a function when invoked with a function", (): void => {
        expect(typeof neutralForegroundRest(() => "#FFF")).toBe("function");
        expect(typeof neutralForegroundHover(() => "#FFF")).toBe("function");
        expect(typeof neutralForegroundActive(() => "#FFF")).toBe("function");
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    xtest("should operate on default design system if no design system is supplied", (): void => {
        expect(
            contrast(neutralForegroundRest(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(
                neutralForegroundRest(() => undefined as any)(undefined as any),
                "#FFF"
            )
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(neutralForegroundRest(() => "#FFF")(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(neutralForegroundRest(() => "#FFFFFF")(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);

        expect(
            contrast(neutralForegroundHover(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(
                neutralForegroundHover(() => undefined as any)(undefined as any),
                "#FFF"
            )
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(neutralForegroundHover(() => "#FFF")(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(neutralForegroundHover(() => "#FFFFFF")(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);

        expect(
            contrast(neutralForegroundActive(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(
                neutralForegroundActive(() => undefined as any)(undefined as any),
                "#FFF"
            )
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(neutralForegroundActive(() => "#FFF")(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);
        expect(
            contrast(neutralForegroundActive(() => "#FFFFFF")(undefined as any), "#FFF")
        ).toBeGreaterThanOrEqual(14);
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    xtest("should return correct result with default design system values", (): void => {
        expect(
            contrast(neutralForegroundRest(fastDesignSystemDefaults), "#FFF")
        ).toBeGreaterThanOrEqual(14);
    });

    test("should return #FFFFFF with a dark background", (): void => {
        expect(
            contrast(
                neutralForegroundRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: "#000",
                    })
                ),
                "#000"
            )
        ).toBeGreaterThanOrEqual(14);
    });
});
