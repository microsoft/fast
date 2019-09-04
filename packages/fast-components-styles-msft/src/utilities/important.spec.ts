import { importantValue } from "./important";

describe("important", (): void => {
    test("adds !important to a passed in css value", (): void => {
        const result: string = importantValue("width: 10px");
        expect(result).toEqual("width: 10px !important");
    });
});
