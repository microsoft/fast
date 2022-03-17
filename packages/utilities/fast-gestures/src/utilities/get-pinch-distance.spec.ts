import { getPinchDistance } from "./get-pinch-distance";

describe("getPinchDistance", () => {
    test("should return 0 pinch distance", () => {
        expect(Math.round(getPinchDistance(-10, -10, 30, 30, 100))).toBe(0);
    });

    test("should return pinch distance", () => {
        expect(Math.round(getPinchDistance(-10, -10, 30, 30, 0.001))).toBe(57);
    });
});