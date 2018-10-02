import { joinClasses } from "./string-extensions";

/* tslint:disable:no-string-literal */
describe("joinClasses", (): void => {
    test("should join classes if the condition is true", (): void => {
        const classes: string = joinClasses(true, "foo", "bar");

        expect(classes).toBe("foo bar");
    });

    test("should not join classes if the condition is false", (): void => {
        const classes: string = joinClasses(false, "foo", "bar");

        expect(classes).toBe("foo");
    });
});
