import defaultDesignSystem, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import * as designSystemUtils from "./design-system";

Object.keys(designSystemUtils)
    .filter((key: string) => key !== "getDesignSystemValue")
    .forEach((key: string): void => {
        describe(key, (): void => {
            const designSystemKey: string = key === "getFontWeight" ? "fontWeight" : key;

            test("should operate on design system defaults", (): void => {
                expect(designSystemUtils[key]({} as DesignSystem)).toBe(
                    defaultDesignSystem[designSystemKey]
                );
            });
            test(`should return the ${key} property of the provided designSystem if it exists`, (): void => {
                const customDesignSystem: DesignSystem = withDesignSystemDefaults({
                    [designSystemKey]: "custom value" as any,
                });
                expect(designSystemUtils[key](customDesignSystem)).toBe(
                    customDesignSystem[designSystemKey]
                );
            });
        });
    });
