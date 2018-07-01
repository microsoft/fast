import { format, isNullOrWhiteSpace, pascalCase, startsWith } from "./strings";

describe("format", (): void => {
    test("should correctly manage undefined correctly by returning an unformatted string", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, undefined)).toBe("Hello  world");
    });

    test("should correctly manage null correctly by returning an unformatted string", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, null)).toBe("Hello  world");
    });

    test("should correctly manage having too many parameters", (): void => {
        const formatterString: string = "View {0} {1}";

        expect(format(formatterString, "page", "five", "now")).toBe("View page five");
    });

    test("should correctly manage a formatter with not enough paramaters", (): void => {
        const formatterString: string = "View {0} {1}";

        expect(format(formatterString, "page")).toBe("View page {1}");
    });

    test("should correctly manage empty strings correctly by returning a formatted string with white space", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, "")).toBe("Hello  world");
    });

    test("should correctly manage strings correctly by returning a formatted string", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, "foo")).toBe("Hello foo world");
    });

    test("should correctly manage multiple strings parameters", (): void => {
        const formatterString: string = "View {0} {1}";

        expect(format(formatterString, "page", "five")).toBe("View page five");
    });

    test("should correctly manage non-formatted strings by returning the initial string", (): void => {
        const formatterString: string = "Hello";

        expect(format(formatterString, "world")).toBe("Hello");
    });

    test("should correctly manage non-formatted strings by returning the initial string", (): void => {
        const formatterString: string = "Hello";

        expect(format(formatterString, "world")).toBe("Hello");
    });
});

describe("isNullOrWhiteSpace", (): void => {
    test("should correctly manage undefined", () => {
        expect(isNullOrWhiteSpace(undefined)).toBe(true);
    });
    test("should correctly manage null", () => {
        expect(isNullOrWhiteSpace(null)).toBe(true);
    });
    test("should correctly manage a value with only white space", () => {
        expect(isNullOrWhiteSpace("\t\n ")).toBe(true);
    });
    test("should correctly manage a value without white space", () => {
        expect(isNullOrWhiteSpace("foobar")).toBe(false);
    });
});

describe("pascalCase", (): void => {
    test("should correctly manage hyphenated strings", (): void => {
        expect(pascalCase("string-extensions")).toBe("StringExtensions");
    });

    test("should correctly manage strings with whitespace", (): void => {
        expect(pascalCase(" foo bar ")).toBe("FooBar");
    });

    test("should correctly manage all caps strings", (): void => {
        expect(pascalCase("STRING EXTENSIONS")).toBe("StringExtensions");
    });
});

describe("startsWith", (): void => {
    test("should correctly manage undefined", () => {
        expect(startsWith(undefined, undefined)).toBe(false);
        expect(startsWith("Hello", undefined)).toBe(false);
    });
    test("should correctly manage null", () => {
        expect(startsWith(null, null)).toBe(false);
        expect(startsWith("Hello", null)).toBe(false);
    });
    test("should correctly manage searching for an emtpy string", () => {
        expect(startsWith("Helloworld", "")).toBe(false);
    });
    test("should correctly manage a string which includes a match but does not start with it", () => {
        expect(startsWith("HelloWorld", "World")).toBe(false);
    });
    test("should correctly manage finding a valid string that starts with a match", () => {
        expect(startsWith("start", "start")).toBe(true);
        expect(startsWith("start", "star")).toBe(true);
    });
    test("should correctly manage incorrect casing as an invalid match", () => {
        expect(startsWith("start", "START")).toBe(false);
    });
});
