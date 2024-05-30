import { expect } from "chai";
import { inRange, limit, wrapInBounds } from "./numbers.js";

describe("wrapInBounds", () => {
    it("should not throw if any parameters are null", () => {
        expect(() => {
            wrapInBounds(null!, null!, null!);
        }).not.to.throw();
        expect(() => {
            wrapInBounds(1, null!, null!);
        }).not.to.throw();
        expect(() => {
            wrapInBounds(1, 2, 3);
        }).not.to.throw();
        expect(() => {
            wrapInBounds(1, null!, 3);
        }).not.to.throw();
        expect(() => {
            wrapInBounds(1, 2, null!);
        }).not.to.throw();
    });

    it("should return `min` if `value` is greater than `max`", () => {
        expect(wrapInBounds(0, 10, 11)).to.equal(0);
        expect(wrapInBounds(-10, 0, 1)).to.equal(-10);
        expect(wrapInBounds(-10, 10, 11)).to.equal(-10);
        expect(wrapInBounds(10, 20, 30)).to.equal(10);
    });

    it("should return `max` if `value` is less than `min`", () => {
        expect(wrapInBounds(0, 10, -10)).to.equal(10);
        expect(wrapInBounds(-10, 0, -11)).to.equal(0);
        expect(wrapInBounds(-20, -10, -30)).to.equal(-10);
        expect(wrapInBounds(-10, 10, -11)).to.equal(10);
    });

    it("should return the correct value if both min and max are the same", () => {
        expect(wrapInBounds(0, 0, -1)).to.equal(0);
        expect(wrapInBounds(0, 0, 1)).to.equal(0);
    });
});

describe("limit", () => {
    it("should not throw if any parameters are null", () => {
        expect(() => {
            limit(null!, null!, null!);
        }).not.to.throw();
        expect(() => {
            limit(0, null!, null!);
        }).not.to.throw();
        expect(() => {
            limit(0, null!, 1);
        }).not.to.throw();
        expect(() => {
            limit(0, 10, null!);
        }).not.to.throw();
    });

    it("should return `min` if `value` is equal to `min`", () => {
        expect(limit(0, 10, 0)).to.equal(0);
    });

    it("should return `min` if `value` is greater than `min`", () => {
        expect(limit(10, 15, -1)).to.equal(10);
    });

    it("should return `max` if `value` is equal to `max`", () => {
        expect(limit(0, 10, 10)).to.equal(10);
    });

    it("should return `max` if `value` is greater than `max`", () => {
        expect(limit(0, 10, 11)).to.equal(10);
    });

    it("should return the value if `value` is not less min or greater than max", () => {
        expect(limit(0, 10, 5)).to.equal(5);
    });
});

describe("inRange", () => {
    it("should not throw if any parameters are null", () => {
        expect(() => {
            inRange(null!, null!, null!);
        }).not.to.throw();
        expect(() => {
            inRange(0, null!, null!);
        }).not.to.throw();
        expect(() => {
            inRange(0, null!, 1);
        }).not.to.throw();
        expect(() => {
            inRange(0, 10, null!);
        }).not.to.throw();
    });

    it("should return `true` if `value` is within range of `min` and `max`", () => {
        expect(inRange(10, 0, 20)).to.be.true;
        expect(inRange(10, 20)).to.be.true;
    });

    it("should return `false` when `value` is less than `min` and `max`", () => {
        expect(inRange(10, 20, 30)).to.be.false;
    });

    it("should return `false` when `value` is greater than `min` and `max`", () => {
        expect(inRange(10, 0, 5)).to.be.false;
    });

    it("should return `false` when `value` is equal to `max`", () => {
        expect(inRange(10, 0, 10)).to.be.false;
    });

    it("should return `true` when `value` is less than `min` and `max` is omitted", () => {
        expect(inRange(10, 20)).to.be.true;
    });

    it("should return `false` when `value` is less than 0 and `max` is omitted", () => {
        expect(inRange(-10, 20)).to.be.false;
    });
});
