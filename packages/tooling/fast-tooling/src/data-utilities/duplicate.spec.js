import { expect } from "chai";
import { getDataWithDuplicate } from "./duplicate";
/**
 * Gets duplicated data
 */
describe("getDataWithDuplicate", () => {
    it("should duplicate data inside an array", () => {
        const data = {
            foo: ["Hello"],
        };
        const updatedData = getDataWithDuplicate("foo[0]", data);
        expect(updatedData).to.deep.equal({ foo: ["Hello", "Hello"] });
    });
    it("should duplicate a string and convert the target string to an array", () => {
        const data = {
            foo: "Hello",
        };
        const updatedData = getDataWithDuplicate("foo", data);
        expect(updatedData).to.deep.equal({ foo: ["Hello", "Hello"] });
    });
    it("should duplicate an object and convert the target object to an array", () => {
        const data = {
            foo: { bar: "Hello" },
        };
        const updatedData = getDataWithDuplicate("foo", data);
        expect(updatedData).to.deep.equal({
            foo: [{ bar: "Hello" }, { bar: "Hello" }],
        });
    });
    it("should duplicate component data inside an array", () => {
        const componentData = {
            id: "foo",
            props: {
                children: "bar",
            },
        };
        const data = {
            foo: [componentData],
        };
        const updatedData = getDataWithDuplicate("foo[0]", data);
        expect(updatedData).to.deep.equal({
            foo: [componentData, componentData],
        });
    });
    it("should duplicate component data inside an object", () => {
        const componentData = {
            id: "foo",
            props: {
                children: "bar",
            },
        };
        const data = {
            foo: componentData,
        };
        const updatedData = getDataWithDuplicate("foo", data);
        expect(updatedData).to.deep.equal({
            foo: [componentData, componentData],
        });
    });
});
