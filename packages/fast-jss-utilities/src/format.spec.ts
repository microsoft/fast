import { format } from "./format";

interface DesignSystem {
    value: string;
}

const designSystemDefaults: DesignSystem = {
    value: "foo",
};

function formatter(designSystem: DesignSystem): string {
    return "%formatted%";
}

describe("format", (): void => {
    test("should return the input string if no formatters are passed", (): void => {
        const input: string = "foobar{0}";
        expect(format(input)(designSystemDefaults)).toBe(input);
    });
    test("should format '{0}' when a formatter is passed as the second argument", (): void => {
        expect(format("{0}", formatter)(designSystemDefaults)).toBe(
            formatter(designSystemDefaults)
        );
    });
    test("should format multiple '{0}'", (): void => {
        expect(format("{0}{0}", formatter)(designSystemDefaults)).toBe(
            formatter(designSystemDefaults) + formatter(designSystemDefaults)
        );
    });
    test("should not format a variable when not supplied a formatter", (): void => {
        expect(format("{0}{1}", formatter)(designSystemDefaults)).toBe(
            formatter(designSystemDefaults) + "{1}"
        );
    });
    test("should format multiple variables when multiple formatters are passed", (): void => {
        function secondFormatter(designSystem: DesignSystem): string {
            return "anotherString";
        }

        expect(format("{0}{1}", formatter, secondFormatter)(designSystemDefaults)).toBe(
            formatter(designSystemDefaults) + secondFormatter(designSystemDefaults)
        );
    });
    test("should throw when formatter args are not functions", (): void => {
        expect(
            (): void => {
                format("{0}", false as any)(designSystemDefaults);
            }
        ).toThrow();
    });
    test("should pass supplied formatter functions the input designSystem", (): void => {
        const spy: any = jest.fn();
        const designSystem: DesignSystem = Object.assign({}, designSystemDefaults, {
            backgroundColor: "red",
        }) as DesignSystem;

        format("{0}", spy)(designSystem);

        expect(spy).toHaveBeenCalledWith(designSystem);
        expect(spy.mock.calls[0][0].backgroundColor).toBe("red");
    });
});
