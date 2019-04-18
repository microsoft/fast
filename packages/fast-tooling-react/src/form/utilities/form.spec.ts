import "jest";
import {
    BreadcrumbItem,
    getBreadcrumbs,
    getNavigation,
    getSchemaByDataLocation,
    HandleBreadcrumbClick,
    NavigationItem,
} from "./form";
import { BreadcrumbItemEventHandler, FormChildOptionItem } from "../form/form.props";

import arraysSchema from "../../__tests__/schemas/arrays.schema.json";
import generalSchema from "../../__tests__/schemas/general.schema.json";
import objectsSchema from "../../__tests__/schemas/objects.schema.json";
import oneOfSchema from "../../__tests__/schemas/one-of.schema.json";
import anyOfSchema from "../../__tests__/schemas/any-of.schema.json";
import childrenSchema from "../../__tests__/schemas/children.schema.json";
import textFieldSchema from "../../__tests__/schemas/textarea.schema.json";
import deeplyNestedOneOfSchema from "../../__tests__/schemas/one-of-deeply-nested.schema.json";
import { reactChildrenStringSchema } from "../form/form-item.children.text";

/**
 * Gets the navigation
 */
describe("getNavigation", () => {
    const childOptions: FormChildOptionItem[] = [
        {
            name: childrenSchema.id,
            component: null,
            schema: childrenSchema,
        },
        {
            name: textFieldSchema.id,
            component: null,
            schema: textFieldSchema,
        },
        { name: oneOfSchema.id, component: null, schema: oneOfSchema },
    ];

    test("should return a single navigation item when the location is at the root", () => {
        const navigation: NavigationItem[] = getNavigation(
            "",
            {
                alignHorizontal: "left",
            },
            generalSchema,
            childOptions
        );

        expect(navigation.length).toBe(1);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(generalSchema);
        expect(navigation[0].data).toEqual({
            alignHorizontal: "left",
        });
    });
    test("should return navigation items for a nested property", () => {
        const navigation: NavigationItem[] = getNavigation(
            "optionalObjectWithNestedObject.nestedObject",
            {
                optionalObjectWithNestedObject: {
                    nestedObject: {
                        boolean: true,
                    },
                },
            },
            objectsSchema,
            childOptions
        );

        expect(navigation.length).toBe(3);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(objectsSchema);
        expect(navigation[0].data).toEqual({
            optionalObjectWithNestedObject: {
                nestedObject: {
                    boolean: true,
                },
            },
        });
        expect(navigation[1].dataLocation).toBe("optionalObjectWithNestedObject");
        expect(navigation[1].schema).toEqual(
            objectsSchema.properties.optionalObjectWithNestedObject
        );
        expect(navigation[1].data).toEqual({
            nestedObject: {
                boolean: true,
            },
        });
        expect(navigation[2].dataLocation).toBe(
            "optionalObjectWithNestedObject.nestedObject"
        );
        expect(navigation[2].schema).toEqual(
            objectsSchema.properties.optionalObjectWithNestedObject.properties
                .nestedObject
        );
        expect(navigation[2].data).toEqual({
            boolean: true,
        });
    });
    test("should return navigation items for an array", () => {
        const objectNavigation: NavigationItem[] = getNavigation(
            "objects.1",
            {
                objects: [{ string: "foo" }, { string: "bar" }],
                strings: ["foo", "bar"],
            },
            arraysSchema,
            childOptions
        );
        const stringNavigation: NavigationItem[] = getNavigation(
            "strings.1",
            {
                objects: [{ string: "foo" }, { string: "bar" }],
                strings: ["foo", "bar"],
            },
            arraysSchema,
            childOptions
        );

        expect(objectNavigation.length).toBe(2);
        expect(objectNavigation[0].dataLocation).toBe("");
        expect(objectNavigation[0].schema).toEqual(arraysSchema);
        expect(objectNavigation[0].data).toEqual({
            objects: [{ string: "foo" }, { string: "bar" }],
            strings: ["foo", "bar"],
        });
        expect(objectNavigation[1].dataLocation).toBe("objects[1]");
        expect(objectNavigation[1].schema).toEqual(arraysSchema.properties.objects.items);
        expect(objectNavigation[1].data).toEqual({ string: "bar" });

        expect(stringNavigation.length).toBe(2);
        expect(stringNavigation[0].dataLocation).toBe("");
        expect(stringNavigation[0].schema).toEqual(arraysSchema);
        expect(stringNavigation[0].data).toEqual({
            objects: [{ string: "foo" }, { string: "bar" }],
            strings: ["foo", "bar"],
        });
        expect(stringNavigation[1].dataLocation).toBe("strings[1]");
        expect(stringNavigation[1].schema).toEqual(arraysSchema.properties.strings.items);
        expect(stringNavigation[1].data).toEqual("bar");
    });
    test("should return navigation items when the schema includes an anyOf", () => {
        const navigationRoot: NavigationItem[] = getNavigation(
            "",
            { nestedAnyOf: { string: "foo" } },
            anyOfSchema,
            childOptions
        );
        const navigation: NavigationItem[] = getNavigation(
            "nestedAnyOf",
            { nestedAnyOf: { string: "foo" } },
            anyOfSchema,
            childOptions
        );

        const navigationObject: NavigationItem[] = getNavigation(
            "subObjectAlpha",
            { subObjectAlpha: {} },
            anyOfSchema,
            childOptions
        );

        expect(navigationRoot.length).toBe(1);
        expect(navigationRoot[0].dataLocation).toBe("");
        expect(navigationRoot[0].schema).toEqual(anyOfSchema);
        expect(navigationRoot[0].data).toEqual({ nestedAnyOf: { string: "foo" } });

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(anyOfSchema);
        expect(navigation[0].data).toEqual({ nestedAnyOf: { string: "foo" } });
        expect(navigation[1].dataLocation).toBe("nestedAnyOf");
        expect(navigation[1].schema).toEqual(anyOfSchema.anyOf[4].properties.nestedAnyOf);
        expect(navigation[1].data).toEqual({ string: "foo" });

        expect(navigationObject.length).toBe(2);
        expect(navigationObject[0].dataLocation).toBe("");
        expect(navigationObject[0].schema).toEqual(anyOfSchema);
        expect(navigationObject[0].data).toEqual({ subObjectAlpha: {} });
        expect(navigationObject[1].dataLocation).toBe("subObjectAlpha");
        expect(navigationObject[1].schema).toEqual(
            anyOfSchema.anyOf[2].properties.subObjectAlpha
        );
        expect(navigationObject[1].data).toEqual({});
    });
    test("should return navigation items when the schema includes a oneOf", () => {
        const navigationNonObject: NavigationItem[] = getNavigation(
            "numberOrString",
            { numberOrString: 54 },
            oneOfSchema,
            childOptions
        );

        expect(navigationNonObject.length).toBe(2);
        expect(navigationNonObject[0].dataLocation).toBe("");
        expect(navigationNonObject[0].schema).toEqual(oneOfSchema);
        expect(navigationNonObject[0].data).toEqual({ numberOrString: 54 });
        expect(navigationNonObject[1].dataLocation).toBe("numberOrString");
        expect(navigationNonObject[1].schema).toEqual(
            oneOfSchema.oneOf[2].properties.numberOrString
        );
        expect(navigationNonObject[1].data).toEqual(54);
    });
    test("should return navigation items for children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children",
            {
                children: {
                    id: textFieldSchema.id,
                    props: {},
                },
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: { id: textFieldSchema.id, props: {} },
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(textFieldSchema);
        expect(navigation[1].data).toEqual({});
    });
    test("should return navigation items for nested children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children.props.children.props",
            {
                children: {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: textFieldSchema.id,
                            props: {},
                        },
                    },
                },
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(3);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: textFieldSchema.id,
                        props: {},
                    },
                },
            },
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            children: {
                id: textFieldSchema.id,
                props: {},
            },
        });
        expect(navigation[2].dataLocation).toBe("children.props.children.props");
        expect(navigation[2].schema).toEqual(textFieldSchema);
        expect(navigation[2].data).toEqual({});
    });
    test("should return navigation items for a nested array of children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children[0].props.children.props",
            {
                children: [
                    {
                        id: childrenSchema.id,
                        props: {
                            children: {
                                id: textFieldSchema.id,
                                props: {},
                            },
                        },
                    },
                ],
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(3);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: textFieldSchema.id,
                            props: {},
                        },
                    },
                },
            ],
        });
        expect(navigation[1].dataLocation).toBe("children[0].props");
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            children: {
                id: textFieldSchema.id,
                props: {},
            },
        });
        expect(navigation[2].dataLocation).toBe("children[0].props.children.props");
        expect(navigation[2].schema).toEqual(textFieldSchema);
        expect(navigation[2].data).toEqual({});
    });
    test("should return navigation items for multiple data root items that can contain children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "restrictedChildrenWithReactDefaults[0].props.children.props",
            {
                restrictedChildrenWithReactDefaults: [
                    {
                        id: childrenSchema.id,
                        props: {
                            children: {
                                id: textFieldSchema.id,
                                props: {},
                            },
                        },
                    },
                ],
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(3);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            restrictedChildrenWithReactDefaults: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: textFieldSchema.id,
                            props: {},
                        },
                    },
                },
            ],
        });
        expect(navigation[1].dataLocation).toBe(
            "restrictedChildrenWithReactDefaults[0].props"
        );
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            children: {
                id: textFieldSchema.id,
                props: {},
            },
        });
        expect(navigation[2].dataLocation).toBe(
            "restrictedChildrenWithReactDefaults[0].props.children.props"
        );
        expect(navigation[2].schema).toEqual(textFieldSchema);
        expect(navigation[2].data).toEqual({});
    });
    test("should return navigation items for text children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children",
            {
                children: "example text",
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: "example text",
        });
        expect(navigation[1].dataLocation).toBe("children");
        expect(navigation[1].schema).toEqual(reactChildrenStringSchema);
        expect(navigation[1].data).toEqual("example text");
    });
    test("should return navigation items for nested children with properties", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children.props.objectContainingNestedChildren.nestedObjectChildren",
            {
                children: {
                    id: childrenSchema.id,
                    props: {
                        objectContainingNestedChildren: {
                            nestedObjectChildren: {
                                id: childrenSchema.id,
                                props: {},
                            },
                        },
                    },
                },
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(4);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: {
                id: childrenSchema.id,
                props: {
                    objectContainingNestedChildren: {
                        nestedObjectChildren: {
                            id: childrenSchema.id,
                            props: {},
                        },
                    },
                },
            },
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            objectContainingNestedChildren: {
                nestedObjectChildren: {
                    id: childrenSchema.id,
                    props: {},
                },
            },
        });
        expect(navigation[2].dataLocation).toBe(
            "children.props.objectContainingNestedChildren"
        );
        expect(navigation[2].schema).toEqual(
            childrenSchema.properties.objectContainingNestedChildren
        );
        expect(navigation[2].data).toEqual({
            nestedObjectChildren: {
                id: childrenSchema.id,
                props: {},
            },
        });
        expect(navigation[3].dataLocation).toBe(
            "children.props.objectContainingNestedChildren.nestedObjectChildren.props"
        );
        expect(navigation[3].schema).toEqual(childrenSchema);
        expect(navigation[3].data).toEqual({});
    });
    test("should return navigation items for nested children with anyOf/oneOf", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children.props",
            {
                children: {
                    id: oneOfSchema.id,
                    props: {
                        string: "Foo",
                    },
                },
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: {
                id: oneOfSchema.id,
                props: {
                    string: "Foo",
                },
            },
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(oneOfSchema);
        expect(navigation[1].data).toEqual({
            string: "Foo",
        });
    });
    test("should return navigation items for oneOf/anyOf nested objects", () => {
        const navigation: NavigationItem[] = getNavigation(
            "numberOrString.object",
            {
                numberOrString: {
                    object: {
                        number: 47,
                    },
                },
            },
            oneOfSchema,
            childOptions
        );

        expect(navigation.length).toBe(3);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(oneOfSchema);
        expect(navigation[0].data).toEqual({
            numberOrString: {
                object: {
                    number: 47,
                },
            },
        });
        expect(navigation[1].dataLocation).toBe("numberOrString");
        expect(navigation[1].schema).toEqual(
            oneOfSchema.oneOf[2].properties.numberOrString
        );
        expect(navigation[1].data).toEqual({
            object: {
                number: 47,
            },
        });
        expect(navigation[2].dataLocation).toBe("numberOrString.object");
        expect(navigation[2].schema).toEqual(
            oneOfSchema.oneOf[2].properties.numberOrString.oneOf[2].properties.object
        );
        expect(navigation[2].data).toEqual({
            number: 47,
        });
    });
    test("should return navigation items for oneOf/anyOf nested arrays", () => {
        const navigation: NavigationItem[] = getNavigation(
            "numberOrString[0]",
            {
                numberOrString: ["foo", "bar"],
            },
            oneOfSchema,
            childOptions
        );

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(oneOfSchema);
        expect(navigation[0].data).toEqual({
            numberOrString: ["foo", "bar"],
        });
        expect(navigation[1].dataLocation).toBe("numberOrString[0]");
        expect(navigation[1].schema).toEqual(
            oneOfSchema.oneOf[2].properties.numberOrString.oneOf[3].items
        );
        expect(navigation[1].data).toEqual("foo");
    });
    test("should return navigation items for oneOf/anyOf nested objects inside children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children.props.numberOrString.object",
            {
                children: {
                    id: oneOfSchema.id,
                    props: {
                        numberOrString: {
                            object: {
                                number: 47,
                            },
                        },
                    },
                },
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(4);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: {
                id: oneOfSchema.id,
                props: {
                    numberOrString: {
                        object: {
                            number: 47,
                        },
                    },
                },
            },
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(oneOfSchema);
        expect(navigation[1].data).toEqual({
            numberOrString: {
                object: {
                    number: 47,
                },
            },
        });
        expect(navigation[2].dataLocation).toBe("children.props.numberOrString");
        expect(navigation[2].schema).toEqual(
            oneOfSchema.oneOf[2].properties.numberOrString
        );
        expect(navigation[2].data).toEqual({
            object: {
                number: 47,
            },
        });
        expect(navigation[3].dataLocation).toBe("children.props.numberOrString.object");
        expect(navigation[3].schema).toEqual(
            oneOfSchema.oneOf[2].properties.numberOrString.oneOf[2].properties.object
        );
        expect(navigation[3].data).toEqual({
            number: 47,
        });
    });
    test("should return navigational items for deeply nested oneOfs", () => {
        const navigation: NavigationItem[] = getNavigation(
            "propertyKey.propertyKey1.propertyKey2",
            {
                propertyKey: {
                    propertyKey1: {
                        propertyKey2: {},
                    },
                },
            },
            deeplyNestedOneOfSchema,
            []
        );

        expect(navigation).toHaveLength(4);
        expect(navigation[0].dataLocation).toEqual("");
        expect(navigation[1].dataLocation).toEqual("propertyKey");
        expect(navigation[2].dataLocation).toEqual("propertyKey.propertyKey1");
        expect(navigation[3].dataLocation).toEqual(
            "propertyKey.propertyKey1.propertyKey2"
        );
    });
});

/**
 * Gets breadcrumbs from navigation items
 */
describe("getBreadcrumbs", () => {
    const handleBreadcrumbClick: HandleBreadcrumbClick = (
        schemaLocation: string,
        dataLocation: string,
        schema: any
    ): BreadcrumbItemEventHandler => {
        return (e: React.MouseEvent): void => {
            e.preventDefault();
        };
    };
    const childOptions: FormChildOptionItem[] = [
        {
            name: childrenSchema.id,
            component: null,
            schema: childrenSchema,
        },
        {
            name: textFieldSchema.id,
            component: null,
            schema: textFieldSchema,
        },
        { name: generalSchema.id, component: null, schema: generalSchema },
    ];

    test("should return a single breadcrumb item", () => {
        const navigation: NavigationItem[] = getNavigation(
            "",
            {
                alignHorizontal: "left",
            },
            generalSchema,
            childOptions
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigation,
            handleBreadcrumbClick
        );

        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("General example");
    });
    test("should return breadcrumbs for nested property locations", () => {
        const navigation: NavigationItem[] = getNavigation(
            "optionalObjectWithNestedObject.nestedObject",
            {
                optionalObjectWithNestedObject: {
                    nestedObject: {
                        boolean: true,
                    },
                },
            },
            objectsSchema,
            childOptions
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigation,
            handleBreadcrumbClick
        );

        expect(breadcrumbs.length).toBe(3);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("Component with objects");
        expect(breadcrumbs[1].href).toBe("optionalObjectWithNestedObject");
        expect(breadcrumbs[1].text).toBe("object with nested object");
        expect(breadcrumbs[2].href).toBe("optionalObjectWithNestedObject.nestedObject");
        expect(breadcrumbs[2].text).toBe("Nested object");
    });
    test("should return breadcrumb items for an array location", () => {
        const navigation: NavigationItem[] = getNavigation(
            "objects.1",
            { objects: [{ string: "foo" }, { string: "bar" }] },
            arraysSchema,
            childOptions
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigation,
            handleBreadcrumbClick
        );

        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("Component with array");
        expect(breadcrumbs[1].href).toBe("objects[1]");
        expect(breadcrumbs[1].text).toBe("Object");
    });
    test("should return items for an anyOf/oneOf location", () => {
        const navigationRoot: NavigationItem[] = getNavigation(
            "",
            { nestedAnyOf: { string: "foo" } },
            anyOfSchema,
            childOptions
        );
        const navigation: NavigationItem[] = getNavigation(
            "nestedAnyOf",
            { nestedAnyOf: { string: "foo" } },
            anyOfSchema,
            childOptions
        );
        const breadcrumbsRoot: BreadcrumbItem[] = getBreadcrumbs(
            navigationRoot,
            handleBreadcrumbClick
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigation,
            handleBreadcrumbClick
        );

        expect(breadcrumbsRoot.length).toBe(1);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("Component with anyOf");

        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("Component with anyOf");
        expect(breadcrumbs[1].href).toBe("nestedAnyOf");
        expect(breadcrumbs[1].text).toBe("Nested anyOf");
    });
});

describe("getSchemaByDataLocation", () => {
    test("should return the schema given from data requiring no children", () => {
        const data: any = {
            tag: "span",
            text: "test",
        };
        const schema: any = getSchemaByDataLocation(textFieldSchema, data, "", [
            {
                name: "textarea",
                component: null,
                schema: textFieldSchema,
            },
        ]);

        expect(schema.id).toBe(textFieldSchema.id);
    });
    test("should return the schema given from data with a single child", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: [
                        {
                            id: childrenSchema.id,
                            props: {},
                        },
                        {
                            id: textFieldSchema.id,
                            props: {
                                tag: "span",
                                text: "test",
                            },
                        },
                    ],
                },
            },
        };
        const schema1: any = getSchemaByDataLocation(
            childrenSchema,
            data,
            "children.props.children[0]",
            [
                {
                    name: "textarea",
                    component: null,
                    schema: textFieldSchema,
                },
            ]
        );
        expect(schema1.id).toBe(childrenSchema.id);

        const schema2: any = getSchemaByDataLocation(
            childrenSchema,
            data,
            "children.props.children[1]",
            [
                {
                    name: "textarea",
                    component: null,
                    schema: textFieldSchema,
                },
            ]
        );
        expect(schema2.id).toBe(textFieldSchema.id);
    });
});
