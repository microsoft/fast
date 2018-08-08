import { Orientation } from "./aria";

describe("aria-orientation", () => {
    test("should correctly return orientation values", () => {
        expect(Orientation.horizontal).toBe("horizontal");
        expect(Orientation.vertical).toBe("vertical");
    });
});
