import "jest";
import { get } from "lodash-es";
import {
    BreadcrumbItem,
    getBreadcrumbs,
    getDataLocationsOfChildren,
    getLocationsFromObject,
    getNavigation,
    getReactChildrenLocationsFromSchema,
    getSchemaByDataLocation,
    getSchemaLocationSegmentsFromDataLocationSegments,
    HandleBreadcrumbClick,
    mapDataToComponent,
    mapSchemaLocationFromDataLocation,
    NavigationItem,
    orderChildrenByDataLocation
} from "./form.utilities";
import {
    BreadcrumbItemEventHandler,
    ChildOptionItem
} from "./form.props";

import Children from "../../app/components/children/children";
import General from "../../app/components/general-example/general-example";
import TextField from "../../app/components/text-field/text-field";
import OneOf from "../../app/components/one-of/one-of";

import * as alignHorizontalSchema from "../../app/components/align-horizontal/align-horizontal.schema.json";
import * as arraysSchema from "../../app/components/arrays/arrays.schema.json";
import * as generalSchema from "../../app/components/general-example/general-example.schema.json";
import * as objectsSchema from "../../app/components/objects/objects.schema.json";
import * as oneOfSchema from "../../app/components/one-of/one-of.schema.json";
import * as anyOfSchema from "../../app/components/any-of/any-of.schema.json";
import * as childrenSchema from "../../app/components/children/children.schema.json";
import * as textFieldSchema from "../../app/components/text-field/text-field.schema.json";
import { reactChildrenStringSchema } from "./form-item.children.text";

/**
 * Map schema location from data location
 */
describe("mapSchemaLocationFromDataLocation", () => {
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

        expect(schemaLocation).toBe("properties.strings.items");
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
    test("should return a schema location from a child location", () => {
        const schemaLocation: string = mapSchemaLocationFromDataLocation(
            "children",
            {children: {id: childrenSchema.id, props: {}}},
            childrenSchema
        );

        expect(schemaLocation).toBe("reactProperties.children");
    });
    test("should return a schema location from a child location", () => {
        const schemaLocationComponent: string = mapSchemaLocationFromDataLocation(
            "children",
            {children: {id: childrenSchema.id, props: {}}},
            childrenSchema
        );
        const schemaLocationString: string = mapSchemaLocationFromDataLocation(
            "children",
            {children: "Hello world"},
            childrenSchema
        );

        expect(schemaLocationComponent).toBe("reactProperties.children");
        expect(schemaLocationString).toBe("reactProperties.children");
    });
    test("should return a schema location from children locations", () => {
        const schemaLocationComponent: string = mapSchemaLocationFromDataLocation(
            "children[0]",
            {children: [{id: childrenSchema.id, props: {}}, "Hello world"]},
            childrenSchema
        );
        const schemaLocationString: string = mapSchemaLocationFromDataLocation(
            "children[1]",
            {children: [{id: childrenSchema.id, props: {}}, "Hello world"]},
            childrenSchema
        );

        expect(schemaLocationComponent).toBe("reactProperties.children");
        expect(schemaLocationString).toBe("reactProperties.children");
    });
});

/**
 * Gets the navigation
 */
describe("getNavigation", () => {
    const childOptions: ChildOptionItem[] = [
        {name: childrenSchema.id, component: Children, schema: childrenSchema},
        {name: textFieldSchema.id, component: TextField, schema: textFieldSchema},
        {name: oneOfSchema.id, component: OneOf, schema: oneOfSchema}
    ];

    test("should return a single navigation item when the location is at the root", () => {
        const navigation: NavigationItem[] = getNavigation(
            "",
            {
                alignHorizontal: "left"
            },
            alignHorizontalSchema,
            childOptions
        );

        expect(navigation.length).toBe(1);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(alignHorizontalSchema);
        expect(navigation[0].data).toEqual({
            alignHorizontal: "left"
        });
    });
    test("should return navigation items for a nested property", () => {
        const navigation: NavigationItem[] = getNavigation(
            "optionalObjectWithNestedObject.nestedObject",
            {
                optionalObjectWithNestedObject: {
                    nestedObject: {
                        boolean: true
                    }
                }
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
                    boolean: true
                }
            }
        });
        expect(navigation[1].dataLocation).toBe("optionalObjectWithNestedObject");
        expect(navigation[1].schema).toEqual(objectsSchema.properties.optionalObjectWithNestedObject);
        expect(navigation[1].data).toEqual({
            nestedObject: {
                boolean: true
            }
        });
        expect(navigation[2].dataLocation).toBe("optionalObjectWithNestedObject.nestedObject");
        expect(navigation[2].schema).toEqual(objectsSchema.properties.optionalObjectWithNestedObject.properties.nestedObject);
        expect(navigation[2].data).toEqual({
            boolean: true
        });
    });
    test("should return navigation items for an array", () => {
        const objectNavigation: NavigationItem[] = getNavigation(
            "objects.1",
            {objects: [{ string: "foo" }, { string: "bar" }], strings: ["foo", "bar"]},
            arraysSchema,
            childOptions
        );
        const stringNavigation: NavigationItem[] = getNavigation(
            "strings.1",
            {objects: [{ string: "foo" }, { string: "bar" }], strings: ["foo", "bar"]},
            arraysSchema,
            childOptions
        );

        expect(objectNavigation.length).toBe(2);
        expect(objectNavigation[0].dataLocation).toBe("");
        expect(objectNavigation[0].schema).toEqual(arraysSchema);
        expect(objectNavigation[0].data).toEqual(
            {objects: [{ string: "foo" }, { string: "bar" }], strings: ["foo", "bar"]}
        );
        expect(objectNavigation[1].dataLocation).toBe("objects[1]");
        expect(objectNavigation[1].schema).toEqual(arraysSchema.properties.objects.items);
        expect(objectNavigation[1].data).toEqual({ string: "bar" });

        expect(stringNavigation.length).toBe(2);
        expect(stringNavigation[0].dataLocation).toBe("");
        expect(stringNavigation[0].schema).toEqual(arraysSchema);
        expect(stringNavigation[0].data).toEqual(
            {objects: [{ string: "foo" }, { string: "bar" }], strings: ["foo", "bar"]}
        );
        expect(stringNavigation[1].dataLocation).toBe("strings[1]");
        expect(stringNavigation[1].schema).toEqual(arraysSchema.properties.strings.items);
        expect(stringNavigation[1].data).toEqual("bar");
    });
    test("should return navigation items for a anyOf/oneOfs", () => {
        const navigationRoot: NavigationItem[] = getNavigation(
            "",
            {nestedAnyOf: {string: "foo"}},
            anyOfSchema,
            childOptions
        );
        const navigation: NavigationItem[] = getNavigation(
            "nestedAnyOf",
            {nestedAnyOf: {string: "foo"}},
            anyOfSchema,
            childOptions
        );

        expect(navigationRoot.length).toBe(1);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(anyOfSchema);
        expect(navigation[0].data).toEqual({nestedAnyOf: {string: "foo"}});

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(anyOfSchema);
        expect(navigation[0].data).toEqual({nestedAnyOf: {string: "foo"}});
        expect(navigation[1].dataLocation).toBe("nestedAnyOf");
        expect(navigation[1].schema).toEqual(anyOfSchema.anyOf[2].properties.nestedAnyOf);
        expect(navigation[1].data).toEqual({string: "foo"});
    });
    test("should return navigation items for children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children",
            {
                children: {
                    id: textFieldSchema.id,
                    props: {}
                }
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({children: {id: textFieldSchema.id, props: {}}});
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
                            props: {}
                        }
                    }
                }
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
                        props: {}
                    }
                }
            }
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            children: {
                id: textFieldSchema.id,
                props: {}
            }
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
                                props: {}
                            }
                        }
                    }
                ]
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
                            props: {}
                        }
                    }
                }
            ]
        });
        expect(navigation[1].dataLocation).toBe("children[0].props");
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            children: {
                id: textFieldSchema.id,
                props: {}
            }
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
                                props: {}
                            }
                        }
                    }
                ]
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
                            props: {}
                        }
                    }
                }
            ]
        });
        expect(navigation[1].dataLocation).toBe("restrictedChildrenWithReactDefaults[0].props");
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            children: {
                id: textFieldSchema.id,
                props: {}
            }
        });
        expect(navigation[2].dataLocation).toBe("restrictedChildrenWithReactDefaults[0].props.children.props");
        expect(navigation[2].schema).toEqual(textFieldSchema);
        expect(navigation[2].data).toEqual({});
    });
    test("should return navigation items for text children", () => {
        const navigation: NavigationItem[] = getNavigation(
            "children",
            {
                children: "example text"
            },
            childrenSchema,
            childOptions
        );

        expect(navigation.length).toBe(2);
        expect(navigation[0].dataLocation).toBe("");
        expect(navigation[0].schema).toEqual(childrenSchema);
        expect(navigation[0].data).toEqual({
            children: "example text"
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
                                props: {}
                            }
                        }
                    }
                }
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
                            props: {}
                        }
                    }
                }
            }
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(childrenSchema);
        expect(navigation[1].data).toEqual({
            objectContainingNestedChildren: {
                nestedObjectChildren: {
                    id: childrenSchema.id,
                    props: {}
                }
            }
        });
        expect(navigation[2].dataLocation).toBe("children.props.objectContainingNestedChildren");
        expect(navigation[2].schema).toEqual(childrenSchema.properties.objectContainingNestedChildren);
        expect(navigation[2].data).toEqual({
            nestedObjectChildren: {
                id: childrenSchema.id,
                props: {}
            }
        });
        expect(navigation[3].dataLocation).toBe("children.props.objectContainingNestedChildren.nestedObjectChildren.props");
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
                        string: "Foo"
                    }
                }
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
                    string: "Foo"
                }
            }
        });
        expect(navigation[1].dataLocation).toBe("children.props");
        expect(navigation[1].schema).toEqual(oneOfSchema);
        expect(navigation[1].data).toEqual({
            string: "Foo"
        });
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
    const childOptions: ChildOptionItem[] = [
        {name: childrenSchema.id, component: Children, schema: childrenSchema},
        {name: textFieldSchema.id, component: TextField, schema: textFieldSchema},
        {name: generalSchema.id, component: General, schema: generalSchema},
    ];

    test("should return a single breadcrumb item", () => {
        const navigation: NavigationItem[] = getNavigation(
            "",
            {
                alignHorizontal: "left"
            },
            alignHorizontalSchema,
            childOptions
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(navigation, handleBreadcrumbClick);

        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("Component with align horizontal");
    });
    test("should return breadcrumbs for nested property locations", () => {
        const navigation: NavigationItem[] = getNavigation(
            "optionalObjectWithNestedObject.nestedObject",
            {
                optionalObjectWithNestedObject: {
                    nestedObject: {
                        boolean: true
                    }
                }
            },
            objectsSchema,
            childOptions
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(navigation, handleBreadcrumbClick);

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
            {objects: [{ string: "foo" }, { string: "bar" }]},
            arraysSchema,
            childOptions
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(navigation, handleBreadcrumbClick);

        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("Component with array");
        expect(breadcrumbs[1].href).toBe("objects[1]");
        expect(breadcrumbs[1].text).toBe("Object");
    });
    test("should return items for an anyOf/oneOf location", () => {
        const navigationRoot: NavigationItem[] = getNavigation(
            "",
            {nestedAnyOf: {string: "foo"}},
            anyOfSchema,
            childOptions
        );
        const navigation: NavigationItem[] = getNavigation(
            "nestedAnyOf",
            {nestedAnyOf: {string: "foo"}},
            anyOfSchema,
            childOptions
        );
        const breadcrumbsRoot: BreadcrumbItem[] = getBreadcrumbs(navigationRoot, handleBreadcrumbClick);
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(navigation, handleBreadcrumbClick);

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

describe("orderChildrenByDataLocation", () => {
    test("should sort in descending order", () => {
        const testStrings: string[] = [
            "one",
            "one.two",
            "foo",
            "foo.bar",
            "foo.bar.bat",
            "hello.world",
            "hello"
        ];

        testStrings.sort(orderChildrenByDataLocation);

        expect(testStrings[0].split(".").length).toBe(3);
        expect(testStrings[1].split(".").length).toBe(2);
        expect(testStrings[2].split(".").length).toBe(2);
        expect(testStrings[3].split(".").length).toBe(2);
        expect(testStrings[4].split(".").length).toBe(1);
        expect(testStrings[5].split(".").length).toBe(1);
        expect(testStrings[6].split(".").length).toBe(1);
    });
});

describe("getLocationsFromObject", () => {
    test("should get all locations from a shallow object", () => {
        const data: any = {
            a: "foo",
            b: "bar",
            c: "bat"
        };

        const locations: string[] = getLocationsFromObject(data);

        expect(locations.length).toBe(3);
        expect(locations[0]).toBe("a");
        expect(locations[1]).toBe("b");
        expect(locations[2]).toBe("c");
    });
    test("should get all locations from a deep object", () => {
        const data: any = {
            a: {
                nestedA: "foo"
            },
            b: {
                nestedB: "bar"
            },
            c: {
                nestedC: "bat"
            }
        };

        const locations: string[] = getLocationsFromObject(data);
        expect(locations.length).toBe(6);
        expect(locations[0]).toBe("a");
        expect(locations[1]).toBe("a.nestedA");
        expect(locations[2]).toBe("b");
        expect(locations[3]).toBe("b.nestedB");
        expect(locations[4]).toBe("c");
        expect(locations[5]).toBe("c.nestedC");
    });
    test("should get locations from an object containing an array", () => {
        const data: any = {
            a: [
                {
                    nestedA: "foo"
                },
                "bar"
            ]
        };

        const locations: string[] = getLocationsFromObject(data);
        expect(locations.length).toBe(4);
        expect(locations[0]).toBe("a");
        expect(locations[1]).toBe("a.0");
        expect(locations[2]).toBe("a.0.nestedA");
        expect(locations[3]).toBe("a.1");
    });
});

describe("getReactChildrenLocationsFromSchema", () => {
    test("should identify React children from a set of schema locations", () => {
        const schema: any = {
            type: "object",
            properties: {
                a: {
                    type: "string"
                }
            },
            reactProperties: {
                b: {
                    type: "children"
                },
                c: {
                    type: "children"
                }
            }
        };
        const locations: string[] = getLocationsFromObject(schema);
        const reactChildrenLocations: string[] = getReactChildrenLocationsFromSchema(schema, locations);

        expect(reactChildrenLocations.length).toBe(2);
        expect(reactChildrenLocations[0]).toBe("reactProperties.b");
        expect(reactChildrenLocations[1]).toBe("reactProperties.c");
    });
});

describe("getSchemaByDataLocation", () => {
    test("should return the schema given from data requiring no children", () => {
        const data: any = {
            tag: "span",
            text: "test"
        };
        const schema: any = getSchemaByDataLocation(textFieldSchema, data, "", [
            {name: "text-field", component: TextField, schema: textFieldSchema}
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
                            props: {}
                        },
                        {
                            id: textFieldSchema.id,
                            props: {
                                tag: "span",
                                text: "test"
                            }
                        }
                    ]
                }
            }
        };
        const schema1: any = getSchemaByDataLocation(childrenSchema, data, "children.props.children[0]", [
            {name: "text-field", component: TextField, schema: textFieldSchema}
        ]);
        expect(schema1.id).toBe(childrenSchema.id);

        const schema2: any = getSchemaByDataLocation(childrenSchema, data, "children.props.children[1]", [
            {name: "text-field", component: TextField, schema: textFieldSchema}
        ]);
        expect(schema2.id).toBe(textFieldSchema.id);
    });
});

describe("getDataLocationsOfChildren", () => {
    const childOptions: ChildOptionItem[] = [
        {name: childrenSchema.id, component: Children, schema: childrenSchema},
        {name: textFieldSchema.id, component: TextField, schema: textFieldSchema},
        {name: generalSchema.id, component: General, schema: generalSchema},
    ];

    test("should return the data location of a single react child", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {}
            }
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(childrenSchema, data, childOptions);

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
                                props: {}
                            }
                        }
                    }
                }
            }
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(childrenSchema, data, childOptions);

        expect(dataLocationsOfReactChildren.length).toBe(3);
        expect(dataLocationsOfReactChildren[0]).toBe("children");
        expect(dataLocationsOfReactChildren[1]).toBe("children.props.children");
        expect(dataLocationsOfReactChildren[2]).toBe("children.props.children.props.children");
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
                                    props: {}
                                }
                            }
                        }
                    }
                },
                {
                    id: childrenSchema.id,
                    props: {}
                }
            ]
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(childrenSchema, data, childOptions);

        expect(dataLocationsOfReactChildren.length).toBe(4);
        expect(dataLocationsOfReactChildren[0]).toBe("children[0]");
        expect(dataLocationsOfReactChildren[1]).toBe("children[1]");
        expect(dataLocationsOfReactChildren[2]).toBe("children[0].props.children");
        expect(dataLocationsOfReactChildren[3]).toBe("children[0].props.children.props.children");
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
                                    props: {}
                                },
                                {
                                    id: childrenSchema.id,
                                    props: {}
                                }
                            ]
                        }
                    }
                }
            }
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(childrenSchema, data, childOptions);

        expect(dataLocationsOfReactChildren.length).toBe(4);
        expect(dataLocationsOfReactChildren[0]).toBe("children");
        expect(dataLocationsOfReactChildren[1]).toBe("children.props.children");
        expect(dataLocationsOfReactChildren[2]).toBe("children.props.children.props.children[0]");
        expect(dataLocationsOfReactChildren[3]).toBe("children.props.children.props.children[1]");
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
                                        props: {}
                                    },
                                    {
                                        id: childrenSchema.id,
                                        props: {}
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        };

        const dataLocationsOfReactChildren: string[] = getDataLocationsOfChildren(childrenSchema, data, childOptions);

        expect(dataLocationsOfReactChildren.length).toBe(4);
        expect(dataLocationsOfReactChildren[0]).toBe("children[0]");
        expect(dataLocationsOfReactChildren[1]).toBe("children[0].props.children");
        expect(dataLocationsOfReactChildren[2]).toBe("children[0].props.children.props.children[0]");
        expect(dataLocationsOfReactChildren[3]).toBe("children[0].props.children.props.children[1]");
    });
});

describe("getSchemaLocationSegmentsFromDataLocationSegments", () => {
    test("should get a list of schema locations from children", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: textFieldSchema.id,
                        props: {}
                    }
                }
            }
        };

        const schemaLocationSegments: string[] = getSchemaLocationSegmentsFromDataLocationSegments(["children"], childrenSchema, data);

        expect(schemaLocationSegments.length).toBe(2);
        expect(schemaLocationSegments[0]).toBe("reactProperties");
        expect(schemaLocationSegments[1]).toBe("children");
    });
    test("should get a list of schema locations from an array of children", () => {
        const data: any = {
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: textFieldSchema.id,
                            props: {}
                        }
                    }
                },
                {
                    id: textFieldSchema.id,
                    props: {}
                }
            ]
        };

        const schemaLocationSegments: string[] = getSchemaLocationSegmentsFromDataLocationSegments(["children[1]"], childrenSchema, data);

        expect(schemaLocationSegments.length).toBe(2);
        expect(schemaLocationSegments[0]).toBe("reactProperties");
        expect(schemaLocationSegments[1]).toBe("children");
    });
});

describe("mapDataToComponent", () => {
    const childOptions: ChildOptionItem[] = [
        {name: "children", component: Children, schema: childrenSchema},
        {name: "textField", component: TextField, schema: textFieldSchema}
    ];

    test("should map data to a child", () => {
        const textString: string = "Hello world";
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {}
            }
        };
        const dataWithChildString: any = {
            children: textString
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);
        const mappedDataWithChildString: any = mapDataToComponent(childrenSchema, dataWithChildString, childOptions);

        expect(typeof get(mappedData, "children.type")).toBe("function");
        expect(get(mappedData, "children.type.displayName")).toBe("Children");
        expect(typeof get(mappedDataWithChildString, "children")).toBe("string");
        expect(get(mappedDataWithChildString, "children")).toBe(textString);
    });
    test("should map data to multiple children", () => {
        const data: any = {
            children: [
                {
                    id: childrenSchema.id,
                    props: {}
                },
                "Hello pluto"
            ]
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);

        expect(typeof get(mappedData, "children[0].type")).toBe("function");
        expect(get(mappedData, "children[0].type.displayName")).toBe("Children");
        expect(typeof get(mappedData, "children[1]")).toBe("string");
        expect(get(mappedData, "children[1]")).toBe("Hello pluto");
    });
    test("should map data to nested children", () => {
        const data: any = {
            children: [
                {
                    id: childrenSchema.id,
                    props: {
                        children: {
                            id: textFieldSchema.id,
                            props: {}
                        }
                    }
                },
                {
                    id: textFieldSchema.id,
                    props: {}
                }
            ]
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);

        expect(typeof get(mappedData, "children[0].type")).toBe("function");
        expect(get(mappedData, "children[0].type.displayName")).toBe("Children");
        expect(typeof get(mappedData, "children[0].props.children.type")).toBe("function");
        expect(get(mappedData, "children[0].props.children.type.displayName")).toBe("Text field");
        expect(typeof get(mappedData, "children[1].type")).toBe("function");
        expect(get(mappedData, "children[1].type.displayName")).toBe("Text field");
    });
});
