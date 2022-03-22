import { ErrorHandler, errorHandler, onUnexpectedError } from "./errors";

describe("onUnexpectedError", () => {
    const error = new Error();

    test("should return undefined.", () => {
        expect(onUnexpectedError(error)).toBeUndefined();

        error.name = "Canceled";
        error.message = "Canceled";

        expect(onUnexpectedError(error)).toBeUndefined();
    });
});
