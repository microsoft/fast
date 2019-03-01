import "jest";
import {
    getDataLocationsOfChildren,
    getDataLocationsOfPlugins,
    mapSchemaLocationFromDataLocation,
    PluginLocation,
} from "./location.utilities";
import { ChildOptionItem } from "./";

import ChildrenWithRenderProp from "./__tests__/components/children-plugin";
import Children from "./__tests__/components/children";
import General from "./__tests__/components/general-example";
import TextField from "./__tests__/components/text-field";

import * as alignHorizontalSchema from "./__tests__/schemas/align-horizontal.schema.json";
import * as arraysSchema from "./__tests__/schemas/arrays.schema.json";
import * as generalSchema from "./__tests__/schemas/general-example.schema.json";
import * as anyOfSchema from "./__tests__/schemas/any-of.schema.json";
import * as childrenSchema from "./__tests__/schemas/children.schema.json";
import * as childrenWithPluginPropsSchema from "./__tests__/schemas/children-plugin.schema.json";
import * as componentPluginSchema from "./__tests__/schemas/component-plugin.schema.json";
import * as textFieldSchema from "./__tests__/schemas/text-field.schema.json";

/**
 * Map schema location from data location
 */
describe("mapSchemaLocationFromDataLocation", () => {
    test("should return a schema location from a root data location", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "",
            {},
            alignHorizontalSchema
        );

        expect(schemaLocation).toBe("");
    });
    test("should return a schema location from a nested property", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "alignHorizontal",
            { alignHorizontal: "left" },
            alignHorizontalSchema
        );

        expect(schemaLocation).toBe("properties.alignHorizontal");
    });
    test("should return a schema location from an array", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "strings[0]",
            { strings: ["a"] },
            arraysSchema
        );

        expect(schemaLocation).toBe("properties.strings.items");
    });
    test("should return a schema location from a nested array item", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "objects[1].string",
            { objects: [{ string: "foo" }, { string: "bar" }] },
            arraysSchema
        );

        expect(schemaLocation).toBe("properties.objects.items.properties.string");
    });
    test("should return a schema location from anyOf/oneOf locations", () => {
        const schemaLocationRoot: string = mapSchemaLocationFromDataLocation(
            "",
            { number: 5 },
            anyOfSchema
        );
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "number",
            { number: 5 },
            anyOfSchema
        );

        expect(schemaLocationRoot).toBe("");
        expect(schemaLocation).toBe("anyOf.1.properties.number");
    });
    test("should return a schema location from a nested anyOf/oneOf location", () => {
        const schemaLocationRootProperty: string = mapSchemaLocationFromDataLocation(
            "nestedAnyOf",
            { nestedAnyOf: { string: "foo" } },
            anyOfSchema
        );
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "nestedAnyOf.string",
            { nestedAnyOf: { string: "foo" } },
            anyOfSchema
        );

        expect(schemaLocationRootProperty).toBe("anyOf.2.properties.nestedAnyOf.anyOf.1");
        expect(schemaLocation).toBe(
            "anyOf.2.properties.nestedAnyOf.anyOf.1.properties.string"
        );
    });
    test("should return a schema location from a non-object anyOf/oneOf location", () => {
        const schemaLocationNumber: string = mapSchemaLocationFromDataLocation(
            "numberOrString",
            { numberOrString: 50 },
            anyOfSchema
        );
        const schemaLocationString: string = mapSchemaLocationFromDataLocation(
            "numberOrString",
            { numberOrString: "foo" },
            anyOfSchema
        );

        expect(schemaLocationNumber).toBe("anyOf.3.properties.numberOrString.anyOf.0");
        expect(schemaLocationString).toBe("anyOf.3.properties.numberOrString.anyOf.1");
    });
    test("should return a schema location from a non-object anyOf/oneOf location in an array", () => {
        const chemaLocationArrayOfStrings: string = mapSchemaLocationFromDataLocation(
            "numberOrString.0",
            { numberOrString: ["Foo"] },
            anyOfSchema
        );
        const schemaLocationArrayOfObjects: string = mapSchemaLocationFromDataLocation(
            "numberOrString[0].string",
            { numberOrString: [{ string: "Foo" }] },
            anyOfSchema
        );
        const schemaLocationArrayOfNumbers: string = mapSchemaLocationFromDataLocation(
            "numberOrString[0]",
            { numberOrString: [1, 2, 3] },
            anyOfSchema
        );

        expect(chemaLocationArrayOfStrings).toBe(
            "anyOf.3.properties.numberOrString.anyOf.2.items"
        );
        expect(schemaLocationArrayOfObjects).toBe(
            "anyOf.3.properties.numberOrString.anyOf.3.items.anyOf.0.properties.string"
        );
        expect(schemaLocationArrayOfNumbers).toBe(
            "anyOf.3.properties.numberOrString.anyOf.3.items.anyOf.1"
        );
    });
    test("should return a schema location from a child location", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "children",
            { children: { id: childrenSchema.id, props: {} } },
            childrenSchema
        );

        expect(schemaLocation).toBe("reactProperties.children");
    });
    test("should return a schema location from a child location", () => {
        const schemaLocationComponent: string = mapSchemaLocationFromDataLocation(
            "children",
            { children: { id: childrenSchema.id, props: {} } },
            childrenSchema
        );
        const schemaLocationString: string = mapSchemaLocationFromDataLocation(
            "children",
            { children: "Hello world" },
            childrenSchema
        );

        expect(schemaLocationComponent).toBe("reactProperties.children");
        expect(schemaLocationString).toBe("reactProperties.children");
    });
    test("should return a schema location from children locations", () => {
        const schemaLocationComponent: string = mapSchemaLocationFromDataLocation(
            "children[0]",
            { children: [{ id: childrenSchema.id, props: {} }, "Hello world"] },
            childrenSchema
        );
        const schemaLocationString: string = mapSchemaLocationFromDataLocation(
            "children[1]",
            { children: [{ id: childrenSchema.id, props: {} }, "Hello world"] },
            childrenSchema
        );

        expect(schemaLocationComponent).toBe("reactProperties.children");
        expect(schemaLocationString).toBe("reactProperties.children");
    });
});

describe("getDataLocationsOfPlugins", () => {
    const childOptions: ChildOptionItem[] = [
        {
            component: Children,
            schema: childrenSchema,
        },
        {
            component: ChildrenWithRenderProp,
            schema: childrenWithPluginPropsSchema,
        },
        {
            component: TextField,
            schema: textFieldSchema,
        },
    ];
    test("should return the data location at the root", () => {
        const data: string = "";

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            componentPluginSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins.length).toBe(1);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe("");
    });

    test("should return the data location of a single react child", () => {
        const data: any = {
            render: {
                id: childrenSchema.id,
                props: {},
            },
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenWithPluginPropsSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins.length).toBe(1);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe("render");
    });
    test("should return the data location of a nested react child", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: childrenSchema.id,
                        props: {
                            children: {
                                id: childrenWithPluginPropsSchema.id,
                                props: {
                                    render: {
                                        id: childrenSchema.id,
                                        props: {},
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins.length).toBe(1);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe(
            "children.props.children.props.children.props.render"
        );
    });
    test("should return the data locations of multiple children", () => {
        const data: any = {
            children: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    render: {
                        id: childrenSchema.id,
                        props: {},
                    },
                },
            },
            restrictedWithChildren: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    render: {
                        id: childrenSchema.id,
                        props: {},
                    },
                },
            },
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins.length).toBe(2);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe("children.props.render");
        expect(dataLocationsOfPlugins[1].dataLocation).toBe(
            "restrictedWithChildren.props.render"
        );
    });
    test("should return data locations of nested react child with multiple children", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: childrenSchema.id,
                        props: {
                            children: {
                                id: childrenWithPluginPropsSchema.id,
                                props: {
                                    render: {
                                        id: childrenSchema.id,
                                        props: {},
                                    },
                                },
                            },
                            restrictedWithChildren: {
                                id: childrenWithPluginPropsSchema.id,
                                props: {
                                    render: {
                                        id: childrenSchema.id,
                                        props: {},
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins.length).toBe(2);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe(
            "children.props.children.props.children.props.render"
        );
        expect(dataLocationsOfPlugins[1].dataLocation).toBe(
            "children.props.children.props.restrictedWithChildren.props.render"
        );
    });
    test("should return data locations of an array of nested react children with multiple children", () => {
        const data: any = {
            children: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    render: [
                        {
                            id: childrenSchema.id,
                            props: {
                                children: "foo",
                            },
                        },
                        {
                            id: childrenSchema.id,
                            props: {
                                children: "bar",
                            },
                        },
                    ],
                },
            },
            restrictedWithChildren: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    render: {
                        id: childrenSchema.id,
                        props: {
                            children: "bat",
                        },
                    },
                },
            },
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins).toHaveLength(3);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe("children.props.render[0]");
        expect(dataLocationsOfPlugins[1].dataLocation).toBe("children.props.render[1]");
        expect(dataLocationsOfPlugins[2].dataLocation).toBe(
            "restrictedWithChildren.props.render"
        );
    });
    test("should return data locations of an array of items", () => {
        const data: any = {
            children: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    array: ["foo", "bar"],
                },
            },
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins).toHaveLength(1);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe("children.props.array");
    });
    test("should return data locations of children in an array of items", () => {
        const data: any = {
            arrayObject: [
                {
                    content: {
                        id: childrenSchema.id,
                        props: {
                            children: "foo",
                        },
                    },
                },
                {
                    content: {
                        id: childrenSchema.id,
                        props: {
                            children: "bar",
                        },
                    },
                },
            ],
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenWithPluginPropsSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins).toHaveLength(2);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe("arrayObject[0].content");
        expect(dataLocationsOfPlugins[1].dataLocation).toBe("arrayObject[1].content");
    });
    test("should return data locations of nested children in an array of items", () => {
        const data: any = {
            children: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    arrayObject: [
                        {
                            content: {
                                id: childrenSchema.id,
                                props: {
                                    children: "foo",
                                },
                            },
                        },
                        {
                            content: {
                                id: childrenSchema.id,
                                props: {
                                    children: "bat",
                                },
                            },
                        },
                    ],
                },
            },
        };

        const dataLocationsOfPlugins: PluginLocation[] = getDataLocationsOfPlugins(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfPlugins).toHaveLength(2);
        expect(dataLocationsOfPlugins[0].dataLocation).toBe(
            "children.props.arrayObject[0].content"
        );
        expect(dataLocationsOfPlugins[1].dataLocation).toBe(
            "children.props.arrayObject[1].content"
        );
    });
});

describe("getDataLocationsOfChildren", () => {
    const childOptions: ChildOptionItem[] = [
        {
            component: Children,
            schema: childrenSchema,
        },
        {
            component: TextField,
            schema: textFieldSchema,
        },
        { component: General, schema: generalSchema },
    ];

    test("should return the data location of a single react child", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {},
            },
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfReactChildren.length).toBe(1);
        expect(dataLocationsOfReactChildren[0]).toBe("children");
    });
    test("should return the data location of a nested react child", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: generalSchema.id,
                        props: {
                            children: {
                                id: textFieldSchema.id,
                                props: {},
                            },
                        },
                    },
                },
            },
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfReactChildren.length).toBe(3);
        expect(dataLocationsOfReactChildren[0]).toBe("children");
        expect(dataLocationsOfReactChildren[1]).toBe("children.props.children");
        expect(dataLocationsOfReactChildren[2]).toBe(
            "children.props.children.props.children"
        );
    });
    test("should return the data locations of multiple children", () => {
        const data: any = {
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: childrenSchema.id,
                            props: {
                                children: {
                                    id: childrenSchema.id,
                                    props: {},
                                },
                            },
                        },
                    },
                },
                {
                    id: childrenSchema.id,
                    props: {},
                },
            ],
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfReactChildren.length).toBe(4);
        expect(dataLocationsOfReactChildren[0]).toBe("children[0]");
        expect(dataLocationsOfReactChildren[1]).toBe("children[1]");
        expect(dataLocationsOfReactChildren[2]).toBe("children[0].props.children");
        expect(dataLocationsOfReactChildren[3]).toBe(
            "children[0].props.children.props.children"
        );
    });
    test("should return data locations of nested react child with multiple children", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: childrenSchema.id,
                        props: {
                            children: [
                                {
                                    id: childrenSchema.id,
                                    props: {},
                                },
                                {
                                    id: childrenSchema.id,
                                    props: {},
                                },
                            ],
                        },
                    },
                },
            },
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfReactChildren.length).toBe(4);
        expect(dataLocationsOfReactChildren[0]).toBe("children");
        expect(dataLocationsOfReactChildren[1]).toBe("children.props.children");
        expect(dataLocationsOfReactChildren[2]).toBe(
            "children.props.children.props.children[0]"
        );
        expect(dataLocationsOfReactChildren[3]).toBe(
            "children.props.children.props.children[1]"
        );
    });
    test("should return data locations of an array of nested react children with multiple children", () => {
        const data: any = {
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: childrenSchema.id,
                            props: {
                                children: [
                                    {
                                        id: childrenSchema.id,
                                        props: {},
                                    },
                                    {
                                        id: childrenSchema.id,
                                        props: {},
                                    },
                                ],
                            },
                        },
                    },
                },
            ],
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(
            childrenSchema,
            data,
            childOptions
        );

        expect(dataLocationsOfReactChildren.length).toBe(4);
        expect(dataLocationsOfReactChildren[0]).toBe("children[0]");
        expect(dataLocationsOfReactChildren[1]).toBe("children[0].props.children");
        expect(dataLocationsOfReactChildren[2]).toBe(
            "children[0].props.children.props.children[0]"
        );
        expect(dataLocationsOfReactChildren[3]).toBe(
            "children[0].props.children.props.children[1]"
        );
    });
});
