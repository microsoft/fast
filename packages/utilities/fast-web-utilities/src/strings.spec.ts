import { expect } from "chai";
import {
    format,
    isNullOrWhiteSpace,
    pascalCase,
    spinalCase,
    startsWith,
} from "./strings";

describe("format", (): void => {
    it("should correctly manage undefined by returning an unformatted string", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, undefined)).to.equal("Hello  world");
    });

    it("should correctly manage null by returning an unformatted string", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, null)).to.equal("Hello  world");
    });

    it("should correctly manage having too many parameters", (): void => {
        const formatterString: string = "View {0} {1}";

        expect(format(formatterString, "page", "five", "now")).to.equal("View page five");
    });

    it("should correctly manage a formatter with not enough parameters", (): void => {
        const formatterString: string = "View {0} {1}";

        expect(format(formatterString, "page")).to.equal("View page {1}");
    });

    it("should correctly manage empty strings by returning a formatted string with white space", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, "")).to.equal("Hello  world");
    });

    it("should correctly manage strings by returning a formatted string", (): void => {
        const formatterString: string = "Hello {0} world";

        expect(format(formatterString, "foo")).to.equal("Hello foo world");
    });

    it("should correctly manage multiple strings parameters", (): void => {
        const formatterString: string = "View {0} {1}";

        expect(format(formatterString, "page", "five")).to.equal("View page five");
    });

    it("should correctly manage non-formatted strings by returning the initial string", (): void => {
        const formatterString: string = "Hello";

        expect(format(formatterString, "world")).to.equal("Hello");
    });

    it("should correctly manage non-formatted strings by returning the initial string", (): void => {
        const formatterString: string = "Hello";

        expect(format(formatterString, "world")).to.equal("Hello");
    });
});

describe("isNullOrWhiteSpace", (): void => {
    it("should correctly manage undefined", () => {
        expect(isNullOrWhiteSpace(undefined)).to.equal(true);
    });
    it("should correctly manage null", () => {
        expect(isNullOrWhiteSpace(null)).to.equal(true);
    });
    it("should correctly manage a value with only white space", () => {
        expect(isNullOrWhiteSpace("\t\n ")).to.equal(true);
    });
    it("should correctly manage a value without white space", () => {
        expect(isNullOrWhiteSpace("foobar")).to.equal(false);
    });
});

describe("pascalCase", (): void => {
    it("should correctly manage hyphenated strings", (): void => {
        expect(pascalCase("string-extensions")).to.equal("StringExtensions");
    });

    it("should correctly manage strings with whitespace", (): void => {
        expect(pascalCase(" foo bar ")).to.equal("FooBar");
    });

    it("should correctly manage all caps strings", (): void => {
        expect(pascalCase("STRING EXTENSIONS")).to.equal("StringExtensions");
    });
});

describe("spinalCase", () => {
    it("should convert pascalCase strings", (): void => {
        expect(spinalCase("stringExtensions")).to.equal("string-extensions");
    });
    it("should convert CamelCase strings", (): void => {
        expect(spinalCase("StringExtensions")).to.equal("string-extensions");
    });
});

describe("startsWith", (): void => {
    it("should correctly manage undefined", () => {
        expect(startsWith(undefined, undefined)).to.equal(false);
        expect(startsWith("Hello", undefined)).to.equal(false);
    });
    it("should correctly manage null", () => {
        expect(startsWith(null, null)).to.equal(false);
        expect(startsWith("Hello", null)).to.equal(false);
    });
    it("should correctly manage searching for an empty string", () => {
        expect(startsWith("Helloworld", "")).to.equal(false);
    });
    it("should correctly manage a string which includes a match but does not start with it", () => {
        expect(startsWith("HelloWorld", "World")).to.equal(false);
    });
    it("should correctly manage finding a valid string that starts with a match", () => {
        expect(startsWith("start", "start")).to.equal(true);
        expect(startsWith("start", "star")).to.equal(true);
    });
    it("should correctly manage incorrect casing as an invalid match", () => {
        expect(startsWith("start", "START")).to.equal(false);
    });
});
