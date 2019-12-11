import { getDataWithDuplicate } from "./duplicate";

/**
 * Gets duplicated data
 */
describe("getDataWithDuplicate", () => {
    test("should duplicate data inside an array", () => {
        const data: any = {
            foo: ["Hello"],
        };
        const updatedData: any = getDataWithDuplicate("foo[0]", data);

        expect(updatedData).toEqual({ foo: ["Hello", "Hello"] });
    });
    test("should duplicate a string and convert the target string to an array", () => {
        const data: any = {
            foo: "Hello",
        };
        const updatedData: any = getDataWithDuplicate("foo", data);

        expect(updatedData).toEqual({ foo: ["Hello", "Hello"] });
    });
    test("should duplicate an object and convert the target object to an array", () => {
        const data: any = {
            foo: { bar: "Hello" },
        };
        const updatedData: any = getDataWithDuplicate("foo", data);

        expect(updatedData).toEqual({
            foo: [{ bar: "Hello" }, { bar: "Hello" }],
        });
    });
    test("should duplicate component data inside an array", () => {
        const componentData: any = {
            id: "foo",
            props: {
                children: "bar",
            },
        };
        const data: any = {
            foo: [componentData],
        };
        const updatedData: any = getDataWithDuplicate("foo[0]", data);

        expect(updatedData).toEqual({
            foo: [componentData, componentData],
        });
    });
    test("should duplicate component data inside an object", () => {
        const componentData: any = {
            id: "foo",
            props: {
                children: "bar",
            },
        };
        const data: any = {
            foo: componentData,
        };
        const updatedData: any = getDataWithDuplicate("foo", data);

        expect(updatedData).toEqual({
            foo: [componentData, componentData],
        });
    });
});
