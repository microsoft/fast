import { expect } from "chai";
import { classNames } from "./class-names";

describe("classNames", (): void => {
    it("should return a string when invalid values are provided", (): void => {
        expect(classNames()).to.equal("");
        expect(classNames(undefined as any)).to.equal("");
        expect(classNames(null as any)).to.equal("");
        expect(classNames(NaN as any)).to.equal("");
        expect(classNames(Infinity as any)).to.equal("");
        expect(classNames(new Date() as any)).to.equal("");
        expect(classNames(1 as any)).to.equal("");
        expect(classNames([undefined as any, true])).to.equal("");
        expect(classNames([null as any, true])).to.equal("");
        expect(classNames([NaN as any, true])).to.equal("");
        expect(classNames([Infinity as any, true])).to.equal("");
        expect(classNames([new Date() as any, true])).to.equal("");
        expect(classNames([1 as any, true])).to.equal("");
    });

    it("should return a single string argument unmodified", (): void => {
        expect(classNames("hello")).to.equal("hello");
    });

    it("should join multiple string arguments together", (): void => {
        expect(classNames("hello", "world")).to.equal("hello world");
    });

    it("should return the return value of a single function", (): void => {
        expect(classNames(() => "hello")).to.equal("hello");
    });

    it("should join the return value of a multiple functions", (): void => {
        expect(
            classNames(
                () => "hello",
                () => "world"
            )
        ).to.equal("hello world");
    });

    it("should return a the first index of an array arg when the second index is truthy", (): void => {
        expect(classNames(["foo", true])).to.equal("foo");
    });

    it("should return a single function return value of an array arg when the second index is truthy", (): void => {
        expect(classNames([(): string => "foo", true])).to.equal("foo");
    });

    it("should join multiple array index when all second indexes are true", (): void => {
        expect(classNames(["foo", true], ["bar", true])).to.equal("foo bar");
    });

    it("should omit first indexes of an array argument when the second index is falsey", (): void => {
        expect(classNames(["foo", true], ["bar", false], ["bat", true])).to.equal(
            "foo bat"
        );
    });

    it("should join string, function, and object arguments", (): void => {
        expect(
            classNames(
                "hello",
                ["foo", true],
                ["bar", false],
                [(): string => "bat", true],
                "world",
                () => "earth"
            )
        ).to.equal("hello foo bat world earth");
    });
});
