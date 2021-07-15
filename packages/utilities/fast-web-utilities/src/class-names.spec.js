import { expect } from "chai";
import { classNames } from "./class-names";
describe("classNames", () => {
    it("should return a string when invalid values are provided", () => {
        expect(classNames()).to.equal("");
        expect(classNames(undefined)).to.equal("");
        expect(classNames(null)).to.equal("");
        expect(classNames(NaN)).to.equal("");
        expect(classNames(Infinity)).to.equal("");
        expect(classNames(new Date())).to.equal("");
        expect(classNames(1)).to.equal("");
        expect(classNames([undefined, true])).to.equal("");
        expect(classNames([null, true])).to.equal("");
        expect(classNames([NaN, true])).to.equal("");
        expect(classNames([Infinity, true])).to.equal("");
        expect(classNames([new Date(), true])).to.equal("");
        expect(classNames([1, true])).to.equal("");
    });
    it("should return a single string argument unmodified", () => {
        expect(classNames("hello")).to.equal("hello");
    });
    it("should join multiple string arguments together", () => {
        expect(classNames("hello", "world")).to.equal("hello world");
    });
    it("should return the return value of a single function", () => {
        expect(classNames(() => "hello")).to.equal("hello");
    });
    it("should join the return value of a multiple functions", () => {
        expect(
            classNames(
                () => "hello",
                () => "world"
            )
        ).to.equal("hello world");
    });
    it("should return a the first index of an array arg when the second index is truthy", () => {
        expect(classNames(["foo", true])).to.equal("foo");
    });
    it("should return a single function return value of an array arg when the second index is truthy", () => {
        expect(classNames([() => "foo", true])).to.equal("foo");
    });
    it("should join multiple array index when all second indexes are true", () => {
        expect(classNames(["foo", true], ["bar", true])).to.equal("foo bar");
    });
    it("should omit first indexes of an array argument when the second index is falsey", () => {
        expect(classNames(["foo", true], ["bar", false], ["bat", true])).to.equal(
            "foo bat"
        );
    });
    it("should join string, function, and object arguments", () => {
        expect(
            classNames(
                "hello",
                ["foo", true],
                ["bar", false],
                [() => "bat", true],
                "world",
                () => "earth"
            )
        ).to.equal("hello foo bat world earth");
    });
});
