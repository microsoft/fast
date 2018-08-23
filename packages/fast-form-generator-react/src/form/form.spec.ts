import "jest";
import { mapSchemaLocationFromDataLocation } from "./form.utilities";
import * as alignHorizontalSchema from "../../app/components/align-horizontal/align-horizontal.schema.json";
import * as arraysSchema from "../../app/components/arrays/arrays.schema.json";
import * as objectsSchema from "../../app/components/objects/objects.schema.json";
import * as anyOfSchema from "../../app/components/any-of/any-of.schema.json";
import * as childrenSchema from "../../app/components/children/children.schema.json";
import * as textFieldSchema from "../../app/components/text-field/text-field.schema.json";

/**
 * Map schema location from data location
 */
describe("Map schema location from data location", () => {
    test("should return a schema location from a root data location", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation("", {}, alignHorizontalSchema);

        expect(schemaLocation).toBe("");
    });
    test("should return a schema location from a nested property", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "alignHorizontal",
            {alignHorizontal: "left"},
            alignHorizontalSchema
        );

        expect(schemaLocation).toBe("properties.alignHorizontal");
    });
    test("should return a schema location from an array", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation("strings[0]", {strings: ["a"]}, arraysSchema);

        expect(schemaLocation).toBe("properties.strings");
    });
    test("should return a schema location from a nested array item", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "objects[1].string",
            {objects: [{ string: "foo" }, { string: "bar" }]},
            arraysSchema
        );

        expect(schemaLocation).toBe("properties.objects.items.properties.string");
    });
    test("should return a schema location from anyOf/oneOf locations", () => {
        const schemaLocationRoot: string = mapSchemaLocationFromDataLocation("", {number: 5}, anyOfSchema);
        const schemaLocation: string = mapSchemaLocationFromDataLocation("number", {number: 5}, anyOfSchema);

        expect(schemaLocationRoot).toBe("");
        expect(schemaLocation).toBe("anyOf.1.properties.number");
    });
    test("should return a schema location from a nested anyOf/oneOf location", () => {
        const schemaLocationRootProperty: string = mapSchemaLocationFromDataLocation(
            "nestedAnyOf",
            {nestedAnyOf: {string: "foo"}},
            anyOfSchema
        );
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "nestedAnyOf.string",
            {nestedAnyOf: {string: "foo"}},
            anyOfSchema
        );

        expect(schemaLocationRootProperty).toBe("anyOf.2.properties.nestedAnyOf");
        expect(schemaLocation).toBe("anyOf.2.properties.nestedAnyOf.anyOf.1.properties.string");
    });
});
