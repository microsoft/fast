import defaultDesignSystem, { DesignSystemResolver } from "../design-system";
import {
    ambientShadowConfig,
    applyElevation,
    ElevationMultiplier,
    elevationShadow,
} from "./elevation";

describe("elevationShadow", () => {
    test("should calculate elevation value e1 correctly", () => {
        expect(
            elevationShadow(
                ElevationMultiplier.e1,
                "#000",
                ambientShadowConfig
            )(defaultDesignSystem)
        ).toBe("0px 0px 2.225px rgba(0,0,0,0.11)");
    });
    test("should calculate elevation value e4 correctly", () => {
        expect(
            elevationShadow(
                ElevationMultiplier.e4,
                "#000",
                ambientShadowConfig
            )(defaultDesignSystem)
        ).toBe("0px 0px 2.9px rgba(0,0,0,0.11)");
    });
    test("should calculate elevation value e13 correctly", () => {
        expect(
            elevationShadow(
                ElevationMultiplier.e13,
                "#000",
                ambientShadowConfig
            )(defaultDesignSystem)
        ).toBe("0px 0px 12.8px rgba(0,0,0,0.11)");
    });
    test("should calculate elevation value e17 correctly", () => {
        expect(
            elevationShadow(
                ElevationMultiplier.e17,
                "#000",
                ambientShadowConfig
            )(defaultDesignSystem)
        ).toBe("0px 0px 45.2px rgba(0,0,0,0.11)");
    });
});

describe("applyElevation", () => {
    test("should calculate elevation value e1 correctly", () => {
        expect(
            (applyElevation(ElevationMultiplier.e1)["box-shadow"] as DesignSystemResolver<
                string
            >)(defaultDesignSystem)
        ).toBe("0px 0.4px 0.9px rgba(0,0,0,0.13), 0px 0px 2.225px rgba(0,0,0,0.11)");
    });
    test("should calculate elevation value e4 correctly", () => {
        expect(
            (applyElevation(ElevationMultiplier.e4)["box-shadow"] as DesignSystemResolver<
                string
            >)(defaultDesignSystem)
        ).toBe("0px 1.6px 3.6px rgba(0,0,0,0.13), 0px 0px 2.9px rgba(0,0,0,0.11)");
    });
    test("should calculate elevation value e13 correctly", () => {
        expect(
            (applyElevation(ElevationMultiplier.e13)[
                "box-shadow"
            ] as DesignSystemResolver<string>)(defaultDesignSystem)
        ).toBe("0px 19.2px 43.2px rgba(0,0,0,0.13), 0px 0px 12.8px rgba(0,0,0,0.11)");
    });
    test("should calculate elevation value e17 correctly", () => {
        expect(
            (applyElevation(ElevationMultiplier.e17)[
                "box-shadow"
            ] as DesignSystemResolver<string>)(defaultDesignSystem)
        ).toBe("0px 76.8px 172.8px rgba(0,0,0,0.13), 0px 0px 45.2px rgba(0,0,0,0.11)");
    });
});
