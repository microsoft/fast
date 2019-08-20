import { parseCSSString } from "./parse-css-string";

describe("parse css string", () => {
    test("should correctly assign values when 1 value is passed", () => {
        const parsedString: string[] = parseCSSString("10px");
        expect(parsedString[0]).toBe("10px");
        expect(parsedString[1]).toBe("10px");
        expect(parsedString[2]).toBe("10px");
        expect(parsedString[3]).toBe("10px");
    });
    test("should correctly assign values when 2 value is passed", () => {
        const parsedString: string[] = parseCSSString("10px 8px");
        expect(parsedString[0]).toBe("10px");
        expect(parsedString[1]).toBe("8px");
        expect(parsedString[2]).toBe("10px");
        expect(parsedString[3]).toBe("8px");
    });
    test("should correctly assign values when 3 value is passed", () => {
        const parsedString: string[] = parseCSSString("10px 8px 6px");
        expect(parsedString[0]).toBe("10px");
        expect(parsedString[1]).toBe("8px");
        expect(parsedString[2]).toBe("6px");
        expect(parsedString[3]).toBe("8px");
    });
    test("should correctly assign values when 4 value is passed", () => {
        const parsedString: string[] = parseCSSString("10px 8px 6px 4px");
        expect(parsedString[0]).toBe("10px");
        expect(parsedString[1]).toBe("8px");
        expect(parsedString[2]).toBe("6px");
        expect(parsedString[3]).toBe("4px");
    });
});
