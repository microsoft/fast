import defaultDesignSystem, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import * as designSystemUtils from "./design-system";

Object.keys(designSystemUtils).forEach(
    (key: string): void => {
        describe(
            key,
            (): void => {
                test("should opperate on designSystemDefaults", (): void => {
                    expect(designSystemUtils[key]({} as DesignSystem)).toBe(
                        defaultDesignSystem[key]
                    );
                });
                test(`should return the ${key} property of the provided designSystem if it exists`, (): void => {
                    const customDesignSystem: DesignSystem = withDesignSystemDefaults({
                        [key]: "custom value" as any,
                    });
                    expect(designSystemUtils[key](customDesignSystem)).toBe(
                        customDesignSystem[key]
                    );
                });
            }
        );
    }
);
