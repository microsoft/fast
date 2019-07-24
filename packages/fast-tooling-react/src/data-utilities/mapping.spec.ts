import "jest";
import { get } from "lodash-es";
import React from "react";
import { ChildOptionItem, mapDataToComponent } from "./";
import {
    CodePreviewChildOption,
    CodePreviewConfig,
    mapDataToCodePreview,
} from "./mapping";

import ChildrenWithRenderProp from "./__tests__/components/children-plugin";
import Children from "./__tests__/components/children";
import TextField from "./__tests__/components/text-field";
import badgeSchema from "../__tests__/schemas/badge.schema.json";
import childrenSchema from "../__tests__/schemas/children.schema.json";
import childrenWithPluginPropsSchema from "../__tests__/schemas/children-plugin.schema.json";
import textFieldSchema from "../__tests__/schemas/text-field.schema.json";
import MapChildrenPropToCallbackPassingClassName from "./__tests__/plugins/map-children-prop-to-callback-passing-class-name";
import MapBooleanPropToString from "./__tests__/plugins/map-boolean-prop-to-string";
import MapArrayPropToObject from "./__tests__/plugins/map-array-prop-to-object";
import { Plugin, PluginProps } from "./plugin";

/* tslint:disable:max-classes-per-file */
describe("mapDataToComponent", () => {
    const childrenPluginResolverId: string =
        childrenWithPluginPropsSchema.reactProperties.render.pluginId;
    const arrayPluginResolverId: string =
        childrenWithPluginPropsSchema.properties.array.pluginId;
    const booleanPluginResolverId: string =
        childrenWithPluginPropsSchema.properties.boolean.pluginId;
    const childOptions: ChildOptionItem[] = [
        { component: Children, schema: childrenSchema },
        { component: TextField, schema: textFieldSchema },
        { component: ChildrenWithRenderProp, schema: childrenWithPluginPropsSchema },
    ];

    test("should map data to a child", () => {
        const textString: string = "Hello world";
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {},
            },
        };
        const dataWithChildString: any = {
            children: textString,
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);
        const mappedDataWithChildString: any = mapDataToComponent(
            childrenSchema,
            dataWithChildString,
            childOptions
        );

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
                    props: {},
                },
                "Hello pluto",
            ],
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
                            props: {},
                        },
                    },
                },
                {
                    id: textFieldSchema.id,
                    props: {},
                },
            ],
        };

        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions);

        expect(typeof get(mappedData, "children[0].type")).toBe("function");
        expect(get(mappedData, "children[0].type.displayName")).toBe("Children");
        expect(typeof get(mappedData, "children[0].props.children.type")).toBe(
            "function"
        );
        expect(get(mappedData, "children[0].props.children.type.displayName")).toBe(
            "Text field"
        );
        expect(typeof get(mappedData, "children[1].type")).toBe("function");
        expect(get(mappedData, "children[1].type.displayName")).toBe("Text field");
    });

    test("should map simple data to a plugin", () => {
        const data: any = {
            boolean: true,
            array: ["foo", "bar", "bat"],
        };
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapBooleanPropToString({
                    id: [booleanPluginResolverId],
                }),
                new MapArrayPropToObject({
                    id: arrayPluginResolverId,
                }),
            ]
        );

        expect(typeof mappedData.boolean).toBe("string");
        expect(typeof mappedData.array).toBe("object");
        expect(mappedData.array.foo).toEqual(0);
        expect(mappedData.array.bar).toEqual(1);
        expect(mappedData.array.bat).toEqual(2);
    });
    test("should map children to a plugin", () => {
        const data: any = {
            render: {
                id: textFieldSchema.id,
                props: {},
            },
        };
        const testClass: string = "Hello world";
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapChildrenPropToCallbackPassingClassName({
                    id: childrenPluginResolverId,
                }),
            ]
        );

        expect(mappedData.render).toHaveLength(1);
        expect(typeof mappedData.render).toBe("function");
        expect(mappedData.render(testClass).type.displayName).toEqual("Text field");
        expect(mappedData.render(testClass).props.className).toBe(testClass);
    });
    test("should invoke plugin resolver with string and number data", () => {
        ["child text", 10].forEach(
            (childData: unknown): void => {
                const data: any = {
                    render: childData,
                };
                const resolver: jest.Mock = jest.fn();
                class MyPlugin extends Plugin<PluginProps> {
                    public resolver(
                        d: any,
                        childItem?: ChildOptionItem,
                        dataLocation?: string
                    ): any {
                        resolver(d, childItem, dataLocation);
                    }
                }
                const mappedData: any = mapDataToComponent(
                    childrenWithPluginPropsSchema,
                    data,
                    childOptions,
                    [
                        new MyPlugin({
                            id: childrenPluginResolverId,
                        }),
                    ]
                );

                expect(resolver).toHaveBeenCalledTimes(1);
                expect(resolver.mock.calls[0][0]).toBe(childData);
            }
        );
    });
    test("should map arrays of children to plugins", () => {
        const data: any = {
            render: [
                {
                    id: textFieldSchema.id,
                    props: {},
                },
                {
                    id: childrenSchema.id,
                    props: {},
                },
            ],
        };
        const testClass1: string = "Foo";
        const testClass2: string = "Bar";
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapChildrenPropToCallbackPassingClassName({
                    id: childrenPluginResolverId,
                }),
            ]
        );

        expect(mappedData.render).toHaveLength(2);
        expect(typeof mappedData.render[0]).toBe("function");
        expect(mappedData.render[0](testClass1).type.displayName).toEqual("Text field");
        expect(mappedData.render[0](testClass1).props.className).toBe(testClass1);
        expect(typeof mappedData.render[1]).toBe("function");
        expect(mappedData.render[1](testClass2).type.displayName).toEqual("Children");
        expect(mappedData.render[1](testClass2).props.className).toBe(testClass2);
    });
    test("should map children in arrays to plugins", () => {
        const data: any = {
            render: [
                {
                    children: [
                        {
                            id: textFieldSchema.id,
                            props: {},
                        },
                        {
                            id: childrenSchema.id,
                            props: {},
                        },
                    ],
                },
            ],
        };
        const arrayPropertyPluginId: string = "myPluginId";
        const schema: any = {
            type: "object",
            properties: {
                render: {
                    type: "array",
                    items: {
                        type: "object",
                        reactProperties: {
                            children: {
                                type: "children",
                                pluginId: arrayPropertyPluginId,
                            },
                        },
                    },
                },
            },
        };

        const testClass1: string = "Foo";
        const testClass2: string = "Bar";

        const mappedData: any = mapDataToComponent(schema, data, childOptions, [
            new MapChildrenPropToCallbackPassingClassName({
                id: arrayPropertyPluginId,
            }),
        ]);
        expect(mappedData.render[0].children).toHaveLength(2);
        expect(typeof mappedData.render[0].children[0]).toBe("function");
        expect(mappedData.render[0].children[0](testClass1).type.displayName).toEqual(
            "Text field"
        );
        expect(mappedData.render[0].children[0](testClass1).props.className).toBe(
            testClass1
        );
        expect(typeof mappedData.render[0].children[1]).toBe("function");
        expect(mappedData.render[0].children[1](testClass2).type.displayName).toEqual(
            "Children"
        );
        expect(mappedData.render[0].children[1](testClass2).props.className).toBe(
            testClass2
        );
    });
    test("should map children to a plugin nested inside a child", () => {
        const data: any = {
            children: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    render: {
                        id: textFieldSchema.id,
                        props: {},
                    },
                },
            },
        };

        const testClass: string = "Foo";
        const mappedData: any = mapDataToComponent(childrenSchema, data, childOptions, [
            new MapChildrenPropToCallbackPassingClassName({
                id: childrenPluginResolverId,
            }),
        ]);

        expect(typeof get(mappedData, "children.type")).toBe("function");
        expect(get(mappedData, "children.type.displayName")).toBe(
            "ChildrenWithRenderProp"
        );
        expect(get(mappedData, "children.props.render")(testClass).props.className).toBe(
            testClass
        );
    });
    test("should map a child nested inside a children plugin", () => {
        const data: any = {
            render: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: textFieldSchema.id,
                        props: {},
                    },
                },
            },
        };

        const testClass: string = "Foo";
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapChildrenPropToCallbackPassingClassName({
                    id: childrenPluginResolverId,
                }),
            ]
        );

        const executedRenderProp: any = get(mappedData, "render")(testClass);

        expect(executedRenderProp.props.className).toBe(testClass);

        expect(typeof get(executedRenderProp, "props.children.type")).toBe("function");
        expect(get(executedRenderProp, "props.children.type.displayName")).toBe(
            "Text field"
        );
    });
    test("should resolve plugins with the data location of the item", () => {
        const resolver: jest.Mock = jest.fn();
        class MyPlugin extends Plugin<PluginProps> {
            public resolver(
                d: any,
                childItem?: ChildOptionItem,
                dataLocation?: string
            ): any {
                resolver(d, childItem, dataLocation);
            }
        }
        const data: any = {
            render: {
                id: textFieldSchema.id,
                props: {},
            },
        };
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [new MyPlugin({ id: childrenPluginResolverId })]
        );

        expect(resolver).toHaveBeenCalled();
        expect(resolver.mock.calls[0][2]).toBe("render");
    });
    test("should resolve plugins with the data location of the item within arrays", () => {
        const resolver: jest.Mock = jest.fn();
        class MyPlugin extends Plugin<PluginProps> {
            public resolver(
                d: any,
                childItem?: ChildOptionItem,
                dataLocation?: string
            ): any {
                resolver(data, childItem, dataLocation);
                return React.createElement(childItem.component, data);
            }
        }

        const data: any = {
            render: {
                id: childrenWithPluginPropsSchema.id,
                props: {
                    render: {
                        id: textFieldSchema.id,
                        props: {},
                    },
                },
            },
        };

        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [new MyPlugin({ id: childrenPluginResolverId })]
        );

        expect(resolver).toHaveBeenCalledTimes(2);
        expect(resolver.mock.calls[0][2]).toBe("render.props.render");
        expect(resolver.mock.calls[1][2]).toBe("render");
    });
    test("should resolve plugins in an array with the data location", () => {
        const resolver: jest.Mock = jest.fn();
        class MyPlugin extends Plugin<PluginProps> {
            public resolver(
                d: any,
                childItem?: ChildOptionItem,
                dataLocation?: string
            ): any {
                resolver(data, childItem, dataLocation);
                return React.createElement(childItem.component, data);
            }
        }

        const data: any = {
            render: [
                {
                    children: [
                        {
                            id: textFieldSchema.id,
                            props: {},
                        },
                        {
                            id: childrenSchema.id,
                            props: {},
                        },
                    ],
                },
            ],
        };
        const arrayPropertyPluginId: string = "myPluginId";
        const schema: any = {
            type: "object",
            properties: {
                render: {
                    type: "array",
                    items: {
                        type: "object",
                        reactProperties: {
                            children: {
                                type: "children",
                                pluginId: arrayPropertyPluginId,
                            },
                        },
                    },
                },
            },
        };

        const testClass1: string = "Foo";
        const testClass2: string = "Bar";

        const mappedData: any = mapDataToComponent(schema, data, childOptions, [
            new MyPlugin({
                id: arrayPropertyPluginId,
            }),
        ]);
        expect(resolver).toHaveBeenCalledTimes(2);
        expect(resolver.mock.calls[0][2]).toBe("render[0].children[0]");
        expect(resolver.mock.calls[1][2]).toBe("render[0].children[1]");
    });
    test("should not map data to a plugin if a plugin is not available but a pluginId has been specified", () => {
        const data: any = {
            render: [
                {
                    id: textFieldSchema.id,
                    props: {},
                },
            ],
            boolean: true,
            array: ["foo", "bar", "bat"],
        };
        const mappedData: any = mapDataToComponent(
            childrenWithPluginPropsSchema,
            data,
            childOptions,
            [
                new MapBooleanPropToString({
                    id: booleanPluginResolverId,
                }),
            ]
        );

        expect(typeof mappedData.boolean).toBe("string");
        expect(Array.isArray(mappedData.array)).toBe(true);
        expect(mappedData.render[0].props).toEqual({});
    });
});

describe("mapDataToCodePreview", () => {
    const textFieldJSXName: string = "TextField";
    const childrenJSXName: string = "Children";
    const badgeJSXName: string = "Badge";
    const tabIndent: string = "    ";
    const childOptions: CodePreviewChildOption[] = [
        {
            name: textFieldJSXName,
            schema: textFieldSchema,
        },
        {
            name: childrenJSXName,
            schema: childrenSchema,
        },
        {
            name: badgeJSXName,
            schema: badgeSchema,
        },
    ];

    test("should return a string", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
            },
            childOptions,
        });

        expect(typeof mappedData).toBe("string");
    });
    test("should return a string containing a self closing JSX element", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
            },
            childOptions,
        });

        expect(mappedData).toEqual(`<${badgeJSXName} />`);
    });
    test("should return a string containing a self closing JSX element with props", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
                props: {
                    string: "Foo",
                    boolean: true,
                    number: 42,
                },
            },
            childOptions,
        });

        expect(mappedData).toEqual(
            `<${badgeJSXName}\n${tabIndent}string={"Foo"}\n${tabIndent}boolean={true}\n${tabIndent}number={42}\n/>`
        );
    });
    test("should return a string containing a JSX element with a string children", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
                props: {
                    children: "foo",
                },
            },
            childOptions,
        });

        expect(mappedData).toEqual(
            `<${badgeJSXName}>\n${tabIndent}foo\n</${badgeJSXName}>`
        );
    });
    test("should return a string containing a JSX element with multiple string children", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
                props: {
                    children: ["foo", "bar"],
                },
            },
            childOptions,
        });

        expect(mappedData).toEqual(
            `<${badgeJSXName}>\n${tabIndent}foobar\n</${badgeJSXName}>`
        );
    });
    test("should return a string containing a JSX element with multiple component children", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
                props: {
                    children: [
                        {
                            id: badgeSchema.id,
                            props: {
                                children: "foo",
                            },
                        },
                        {
                            id: badgeSchema.id,
                            props: {
                                children: "bar",
                            },
                        },
                    ],
                },
            },
            childOptions,
        });

        expect(mappedData).toEqual(
            `<${badgeJSXName}>\n${tabIndent}<${badgeJSXName}>\n${tabIndent +
                tabIndent}foo\n${tabIndent}</${badgeJSXName}>\n${tabIndent}<${badgeJSXName}>\n${tabIndent +
                tabIndent}bar\n${tabIndent}</${badgeJSXName}>\n</${badgeJSXName}>`
        );
    });
    test("should return a string containing a JSX element with a self closing component child", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: badgeSchema.id,
                        props: {},
                    },
                },
            },
            childOptions,
        });

        expect(mappedData).toEqual(
            `<${childrenJSXName}>\n${tabIndent}<${badgeJSXName} />\n</${childrenJSXName}>`
        );
    });
    test("should return a string containing a JSX element with component children", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: childrenSchema.id,
                props: {
                    children: {
                        id: badgeSchema.id,
                        props: {
                            children: "foo",
                        },
                    },
                },
            },
            childOptions,
        });

        expect(mappedData).toEqual(
            `<${childrenJSXName}>\n${tabIndent}<${badgeJSXName}>\n${tabIndent +
                tabIndent}foo\n${tabIndent}</${badgeJSXName}>\n</${childrenJSXName}>`
        );
    });
    test("should return a string containing a JSX element with component children containing attributes", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
                props: {
                    string: "foo",
                    children: {
                        id: badgeSchema.id,
                        props: {
                            string: "bar",
                            children: "bat",
                        },
                    },
                },
            },
            childOptions,
        });

        expect(mappedData).toEqual(
            `<${badgeJSXName}\n${tabIndent}string={"foo"}\n>\n${tabIndent}<${badgeJSXName}\n${tabIndent +
                tabIndent}string={"bar"}\n${tabIndent}>\n${tabIndent +
                tabIndent}bat\n${tabIndent}</${badgeJSXName}>\n</${badgeJSXName}>`
        );
    });
    test("should return a string containing a JSX element with variables assigned to attributes", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
                props: {
                    object: {
                        number: 42,
                    },
                },
            },
            childOptions,
        });
        const regex: RegExp = new RegExp(
            `const\\s(\\w+)\\s\\=\\s{\\n\\s\\s"number":\\s42\\n};\\n\\n<${badgeJSXName}\\n${tabIndent}object\\={(\\w+)}\\n\\/>`
        );
        expect(mappedData.match(regex)).not.toEqual(null);

        const id1: string = typeof mappedData.match(regex)[1];
        const id2: string = typeof mappedData.match(regex)[2];

        expect(id1).toEqual(id2);
    });
    test("should return a string containing nested JSX elements with variables assigned to attributes", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: badgeSchema.id,
                props: {
                    object: {
                        number: 42,
                    },
                    children: {
                        id: badgeSchema.id,
                        props: {
                            object: {
                                number: 24,
                            },
                        },
                    },
                },
            },
            childOptions,
        });

        const regex: RegExp = new RegExp(
            `const\\s(\\w+)\\s\\=\\s{\\n\\s\\s"number":\\s42\\n};\\n\\nconst\\s(\\w+)\\s\\=\\s{\\n\\s\\s"number":\\s24\\n};\\n\\n<${badgeJSXName}\\n${tabIndent}object={(\\w+)}\\n>\\n${tabIndent}<${badgeJSXName}\\n${tabIndent +
                tabIndent}object\\={(\\w+)}\\n${tabIndent}\\/>\\n<\\/${badgeJSXName}>`
        );
        expect(mappedData.match(regex)).not.toBe(null);

        const id1: string = typeof mappedData.match(regex)[1];
        const id2: string = typeof mappedData.match(regex)[2];
        const id3: string = typeof mappedData.match(regex)[3];
        const id4: string = typeof mappedData.match(regex)[4];

        expect(id1).toEqual(id3);
        expect(id2).toEqual(id4);
    });
    test("should return a string containing JSX elements with variables assigned to attributes", () => {
        const mappedData: string = mapDataToCodePreview({
            data: {
                id: childrenSchema.id,
                props: {
                    restrictedWithChildren: {
                        id: childrenSchema.id,
                        props: {
                            restrictedWithChildren: "foo",
                        },
                    },
                },
            },
            childOptions,
        });

        const regex: RegExp = new RegExp(
            `const\\s(\\w+)\\s\\=\\s\\(\\n${tabIndent}foo\\n\\);\\n\\nconst\\s(\\w+)\\s\\=\\s\\(\\n${tabIndent}<${childrenJSXName}\\n${tabIndent +
                tabIndent}restrictedWithChildren\\={(\\w+)}\\n${tabIndent}\\/>\\n\\);\\n\\n<${childrenJSXName}\\n${tabIndent}restrictedWithChildren={(\\w+)}\\n\\/>`
        );

        expect(mappedData.match(regex)).not.toBe(null);

        const id1: string = typeof mappedData.match(regex)[1];
        const id2: string = typeof mappedData.match(regex)[2];
        const id3: string = typeof mappedData.match(regex)[3];
        const id4: string = typeof mappedData.match(regex)[4];

        expect(id1).toEqual(id3);
        expect(id2).toEqual(id4);
    });
});
/* tslint:disable:max-classes-per-file */
