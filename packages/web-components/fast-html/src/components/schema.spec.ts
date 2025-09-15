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
            },
            childrenMap: null,
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
            childrenMap: null,
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
            childrenMap: null,
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
            childrenMap: null,
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
    test("should add an object to a context in a schema", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "items",
            pathConfig: {
                type: "repeat",
                path: "items",
                currentContext: "item",
                parentContext: null,
            },
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "items",
            pathConfig: {
                type: "default",
                path: "item.a.b",
                currentContext: "item",
                parentContext: null,
            },
            childrenMap: null,
        });

        const schemaA = schema.getSchema("items");

        expect(schemaA).toBeDefined();
        expect(schemaA!.$ref).toBeDefined();
        expect(schemaA!.$ref).toEqual("#/$defs/item");
        expect(schemaA!.type).toEqual("array");
        expect(schemaA!.$defs?.["item"]).toBeDefined();
        expect(schemaA!.$defs?.["item"].$fast_context).toEqual("items");
        expect(schemaA!.$defs?.["item"].$fast_parent_contexts).toEqual([null]);
        expect(schemaA!.$defs?.["item"].properties).toBeDefined();
        expect(schemaA!.$defs?.["item"].properties["a"]).toBeDefined();
        expect(schemaA!.$defs?.["item"].properties["a"].type).toEqual("object");
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
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "a.items",
                currentContext: "item",
                parentContext: null,
            },
            childrenMap: null,
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
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "a.items",
                currentContext: "item",
                parentContext: null,
            },
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "access",
                path: "item.b",
                currentContext: "item",
                parentContext: null,
            },
            childrenMap: null,
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
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "a.users",
                currentContext: "user",
                parentContext: null,
            },
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "user.posts",
                currentContext: "post",
                parentContext: "user"
            },
            childrenMap: null,
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
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "access",
                path: "user.a.b",
                currentContext: "user",
                parentContext: null,
            },
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "user.posts",
                currentContext: "post",
                parentContext: "user"
            },
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "access",
                path: "post.c.d",
                currentContext: "post",
                parentContext: null,
            },
            childrenMap: null,
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "repeat",
                path: "post.meta.tags",
                currentContext: "tag",
                parentContext: "post"
            },
            childrenMap: null,
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
    test("should define an anyOf with a $ref to another schema", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: {
                customElementName: "my-custom-element-2",
                attributeName: "b",
            },
        });

        const schemaA = schema.getSchema("a");

        expect(schemaA).not.toBe(null);
        expect(schemaA!.$id).toEqual("https://fast.design/schemas/my-custom-element/a.json");
        expect(schemaA!.$schema).toEqual("https://json-schema.org/draft/2019-09/schema");
        expect(schemaA!.anyOf).not.toBeUndefined();
        expect(schemaA!.anyOf).toHaveLength(1);
        expect(schemaA!.anyOf?.[0].$ref).toEqual("https://fast.design/schemas/my-custom-element-2/b.json");
    });
    test("should define an anyOf with a $ref to multiple schemas", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: {
                customElementName: "my-custom-element-2",
                attributeName: "b",
            },
        });
        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: {
                customElementName: "my-custom-element-3",
                attributeName: "c",
            },
        });

        const schemaA = schema.getSchema("a");

        expect(schemaA).not.toBe(null);
        expect(schemaA!.$id).toEqual("https://fast.design/schemas/my-custom-element/a.json");
        expect(schemaA!.$schema).toEqual("https://json-schema.org/draft/2019-09/schema");
        expect(schemaA!.anyOf).not.toBeUndefined();
        expect(schemaA!.anyOf).toHaveLength(2);
        expect(schemaA!.anyOf?.[0].$ref).toEqual("https://fast.design/schemas/my-custom-element-2/b.json");
        expect(schemaA!.anyOf?.[1].$ref).toEqual("https://fast.design/schemas/my-custom-element-3/c.json");
    });
    test("should define an anyOf with a $ref to another schema in a nested object", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a.b",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: null,
        });

        let schemaA = schema.getSchema("a");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a.b.c",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: {
                customElementName: "my-custom-element-2",
                attributeName: "test"
            },
        });

        schemaA = schema.getSchema("a");

        expect(schemaA!.properties.b.properties.c).toBeDefined();
        expect(schemaA!.properties.b.properties.c.anyOf).not.toBeUndefined();
        expect(schemaA!.properties.b.properties.c.anyOf[0].$ref).toEqual("https://fast.design/schemas/my-custom-element-2/test.json");
    });
    test("should define an anyOf with a $ref to multiple schemas in a nested object", async () => {
        const schema = new Schema("my-custom-element");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a.b",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: null,
        });

        let schemaA = schema.getSchema("a");

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a.b.c",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: {
                customElementName: "my-custom-element-2",
                attributeName: "test"
            },
        });

        schema.addPath({
            rootPropertyName: "a",
            pathConfig: {
                type: "default",
                path: "a.b.c",
                currentContext: null,
                parentContext: null,
            },
            childrenMap: {
                customElementName: "my-custom-element-3",
                attributeName: "test-2"
            },
        });

        schemaA = schema.getSchema("a");

        expect(schemaA!.properties.b.properties.c).toBeDefined();
        expect(schemaA!.properties.b.properties.c.anyOf).not.toBeUndefined();
        expect(schemaA!.properties.b.properties.c.anyOf[0].$ref).toEqual("https://fast.design/schemas/my-custom-element-2/test.json");
        expect(schemaA!.properties.b.properties.c.anyOf[1].$ref).toEqual("https://fast.design/schemas/my-custom-element-3/test-2.json");
    });
});
