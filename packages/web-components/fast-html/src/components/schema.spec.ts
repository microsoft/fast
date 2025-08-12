import { expect, test } from "@playwright/test";
import { Schema } from "./schema.js";

test.describe("Schema", async () => {
    test("should instantiate with a custom element name without throwing", async () => {
        expect(() => new Schema("my-custom-element")).not.toThrow();
    });
    test("should return null when a JSON schema is requested but none exists for that property name", async () => {
        const schema = new Schema("my-custom-element");

        expect(schema.getSchema("foo")).toEqual(null);
    });
    test("should be able to return a JSON schema after adding a path", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a",
                currentContext: null,
                parentContext: null,
            }
        });

        const schemaA = schema.getSchema("a");

        expect(schemaA).not.toBe(null);
        expect(schemaA!.$id).toEqual("https://fast.design/schemas/my-custom-element/a.json");
        expect(schemaA!.$schema).toEqual("https://json-schema.org/draft/2019-09/schema");
    });
    test("should add a property and cast the schema as type object if a nested path is given", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a.b",
                currentContext: null,
                parentContext: null,
            },
        });

        let schemaA = schema.getSchema("a");

        expect(schemaA!.properties).toBeDefined();
        expect(schemaA!.properties).toHaveProperty("b");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a.b.c",
                currentContext: null,
                parentContext: null,
            },
        });

        schemaA = schema.getSchema("a");

        expect(schemaA!.properties).toBeDefined();
        expect(schemaA!.properties).toHaveProperty("b");
        expect(schemaA!.properties.b.properties).toBeDefined();
        expect(schemaA!.properties.b.properties).toHaveProperty("c");
    });
    test("should add a new context in a schema", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "items",
            pathConfig: {
                type: "repeat",
                path: "items",
                currentContext: "item",
                parentContext: null,
            },
        });

        const schemaA = schema.getSchema("items");

        expect(schemaA).toBeDefined();
        expect(schemaA!.$ref).toBeDefined();
        expect(schemaA!.$ref).toEqual("#/$defs/item");
        expect(schemaA!.type).toEqual("array");
        expect(schemaA!.$defs?.["item"]).toBeDefined();
        expect(schemaA!.$defs?.["item"].$fast_context).toEqual("items");
        expect(schemaA!.$defs?.["item"].$fast_parent_contexts).toEqual([null]);
    });
    test("should add a nested context in a schema", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a",
                currentContext: null,
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "a.items",
                currentContext: "item",
                parentContext: null,
            },
        });

        const schemaA = schema.getSchema("a");

        expect(schemaA).toBeDefined();
        expect(schemaA?.properties?.["items"]).toBeDefined();
        expect(schemaA?.properties?.["items"].items.$ref).toEqual("#/$defs/item");
        expect(schemaA!.$defs?.["item"]).toBeDefined();
        expect(schemaA!.$defs?.["item"].$fast_context).toEqual("items");
        expect(schemaA!.$defs?.["item"].$fast_parent_contexts).toEqual([null]);
    });
    test("should define an object as a nested context in a schema", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a",
                currentContext: null,
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "a.items",
                currentContext: "item",
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "access",
                path: "item.b",
                currentContext: "item",
                parentContext: null,
            },
        });

        const schemaA = schema.getSchema("a");

        expect(schemaA).toBeDefined();
        expect(schemaA!.$defs?.["item"]).toBeDefined();
        expect(schemaA!.$defs?.["item"].$fast_context).toEqual("items");
        expect(schemaA!.$defs?.["item"].$fast_parent_contexts).toEqual([null]);
        expect(schemaA!.$defs?.["item"].type).toEqual("object");
        expect(schemaA!.$defs?.["item"].properties).toBeDefined();
        expect(schemaA!.$defs?.["item"].properties?.["b"]).toBeDefined();
    });
    test("should define nested contexts in a schema", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a",
                currentContext: null,
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "a.users",
                currentContext: "user",
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "user.posts",
                currentContext: "post",
                parentContext: "user"
            },
        });

        const schemaA = schema.getSchema("a");

        expect(schemaA).toBeDefined();
        expect(schemaA!.$defs?.["user"]).toBeDefined();
        expect(schemaA!.$defs?.["user"].$fast_context).toEqual("users");
        expect(schemaA!.$defs?.["user"].$fast_parent_contexts).toEqual([null]);
        expect(schemaA!.$defs?.["post"]).toBeDefined();
        expect(schemaA!.$defs?.["post"].$fast_context).toEqual("posts");
        expect(schemaA!.$defs?.["post"].$fast_parent_contexts).toEqual([null, "user"]);
    });
    test("should define nested contexts with objects in a schema", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "a.users",
                currentContext: "user",
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "access",
                path: "user.a.b",
                currentContext: "user",
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "user.posts",
                currentContext: "post",
                parentContext: "user"
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "access",
                path: "post.c.d",
                currentContext: "post",
                parentContext: null,
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "post.meta.tags",
                currentContext: "tag",
                parentContext: "post"
            },
        });

        const schemaA = schema.getSchema("a");

        expect(schemaA).toBeDefined();
        expect(schemaA!.$defs?.["user"]).toBeDefined();
        expect(schemaA!.$defs?.["user"].$fast_context).toEqual("users");
        expect(schemaA!.$defs?.["user"].$fast_parent_contexts).toEqual([null]);
        expect(schemaA!.$defs?.["user"].type).toEqual("object");
        expect(schemaA!.$defs?.["user"].properties).toBeDefined();
        expect(schemaA!.$defs?.["user"].properties["a"]).toBeDefined();
        expect(schemaA!.$defs?.["user"].properties["a"].properties["b"]).toBeDefined();
        expect(schemaA!.$defs?.["post"]).toBeDefined();
        expect(schemaA!.$defs?.["post"].$fast_context).toEqual("posts");
        expect(schemaA!.$defs?.["post"].$fast_parent_contexts).toEqual([null, "user"]);
        expect(schemaA!.$defs?.["post"].type).toEqual("object");
        expect(schemaA!.$defs?.["post"].properties).toBeDefined();
        expect(schemaA!.$defs?.["post"].properties["c"]).toBeDefined();
        expect(schemaA!.$defs?.["post"].properties["c"].properties["d"]).toBeDefined();
        expect(schemaA!.$defs?.["post"].properties["meta"]).toBeDefined();
        expect(schemaA!.$defs?.["post"].properties["meta"].properties["tags"]).toBeDefined();
        expect(schemaA!.$defs?.["post"].properties["meta"].properties["tags"].items).toBeDefined();
        expect(schemaA!.$defs?.["post"].properties["meta"].properties["tags"].items.$ref).toEqual("#/$defs/tag");
        expect(schemaA!.$defs?.["tag"]).toBeDefined();
        expect(schemaA!.$defs?.["tag"].$fast_context).toEqual("tags");
        expect(schemaA!.$defs?.["tag"].$fast_parent_contexts).toEqual([null, "user", "post"]);
    });
});
