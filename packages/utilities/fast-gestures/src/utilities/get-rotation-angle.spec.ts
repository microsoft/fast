import { getRotationAngle } from "./get-rotation-angle";

describe("getRotationAngle", () => {
    test("should return rotation angle", () => {
        expect(getRotationAngle(1, 1, 30, 30)).toBe(45);
    });
});