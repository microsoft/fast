import { withDefaults } from "./with-defaults";

describe("withDefaults", (): void => {
    interface WithDefaultsTest {
        a?: string;
        b?: string;
    }

    const testDefaults: WithDefaultsTest = {
        a: "a",
        b: "b",
    };

    test("should return an empty object if no arguments are passed", (): void => {
        expect(withDefaults<WithDefaultsTest>({})({})).toEqual({});
        expect(withDefaults<WithDefaultsTest>(void 0)({})).toEqual({});
        expect(withDefaults<WithDefaultsTest>({})(void 0)).toEqual({});
        expect(withDefaults<WithDefaultsTest>(void 0)(void 0)).toEqual({});
    });

    test("return object should contain all keys from the default object with defined values", () => {
        const config: Partial<WithDefaultsTest> = {
            a: "foo",
        };

        const newObject: WithDefaultsTest = withDefaults<WithDefaultsTest>(testDefaults)(
            config
        );

        expect(newObject.a).not.toBe(undefined);
        expect(newObject.b).not.toBe(undefined);
    });

    test("return object should contain all default property values not passed as part of the config object", () => {
        const config: Partial<WithDefaultsTest> = {
            a: "foo",
        };

        const newObject: WithDefaultsTest = withDefaults<WithDefaultsTest>(testDefaults)(
            config
        );

        expect(newObject.a).toBe(config.a);
        expect(newObject.b).toBe(testDefaults.b);
    });
});
