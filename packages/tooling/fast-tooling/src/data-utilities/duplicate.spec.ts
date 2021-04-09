import { expect } from "chai";
import { getDataWithDuplicate } from "./duplicate";

/**
 * Gets duplicated data
 */
describe("getDataWithDuplicate", () => {
    it("should duplicate data inside an array", () => {
        const data: any = {
            foo: ["Hello"],
        };
        const updatedData: any = getDataWithDuplicate("foo[0]", data);

        expect(updatedData).to.deep.equal({ foo: ["Hello", "Hello"] });
    });
    it("should duplicate a string and convert the target string to an array", () => {
        const data: any = {
            foo: "Hello",
        };
        const updatedData: any = getDataWithDuplicate("foo", data);

        expect(updatedData).to.deep.equal({ foo: ["Hello", "Hello"] });
    });
    it("should duplicate an object and convert the target object to an array", () => {
        const data: any = {
            foo: { bar: "Hello" },
        };
        const updatedData: any = getDataWithDuplicate("foo", data);

        expect(updatedData).to.deep.equal({
            foo: [{ bar: "Hello" }, { bar: "Hello" }],
        });
    });
    it("should duplicate component data inside an array", () => {
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

        expect(updatedData).to.deep.equal({
            foo: [componentData, componentData],
        });
    });
    it("should duplicate component data inside an object", () => {
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

        expect(updatedData).to.deep.equal({
            foo: [componentData, componentData],
        });
    });
});
