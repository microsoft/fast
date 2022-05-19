import { getRotationAngle } from "./get-rotation-angle.js";

describe("getRotationAngle", () => {
    test("should return rotation angle", () => {
        expect(getRotationAngle(1, 1, 30, 30)).toBe(45);
    });
});
