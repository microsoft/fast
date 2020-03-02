import { BreadcrumbItem, getBreadcrumbs, getDictionaryBreadcrumbs } from "./breadcrumb";
import { DataType } from "../../data-utilities/types";

/**
 * Gets breadcrumbs from navigation dictionary
 */
describe("getDictionaryBreadcrumbs", () => {
    test("should return a breadcrumb item for a single linked data item", () => {
        const breadcrumbs: BreadcrumbItem[] = getDictionaryBreadcrumbs(
            [
                {
                    foo: [
                        {
                            "": {
                                self: "",
                                parent: null,
                                relativeDataLocation: "",
                                schemaLocation: "",
                                schema: {},
                                data: {},
                                text: "General example",
                                type: DataType.object,
                                items: [],
                            },
                        },
                        "",
                    ],
                },
                "foo",
            ],
            "foo",
            "",
            jest.fn()
        );

        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("General example");
    });
    test("should return a breadcrumb item for multiple linked data items", () => {
        const breadcrumbs: BreadcrumbItem[] = getDictionaryBreadcrumbs(
            [
                {
                    foo: [
                        {
                            "": {
                                self: "",
                                parent: null,
                                relativeDataLocation: "",
                                schemaLocation: "",
                                schema: {},
                                data: {},
                                text: "General example root",
                                type: DataType.object,
                                items: [],
                            },
                            bat: {
                                self: "bat",
                                parent: "",
                                relativeDataLocation: "bat",
                                schemaLocation: "properties.bat",
                                schema: {},
                                data: {},
                                text: "General example property",
                                type: DataType.object,
                                items: [],
                            },
                        },
                        "",
                    ],
                    bar: [
                        {
                            "": {
                                self: "",
                                parent: null,
                                parentDictionaryItem: {
                                    id: "foo",
                                    dataLocation: "bat",
                                },
                                relativeDataLocation: "",
                                schemaLocation: "",
                                schema: {},
                                data: {},
                                text: "General example child",
                                type: DataType.object,
                                items: [],
                            },
                        },
                        "",
                    ],
                },
                "foo",
            ],
            "bar",
            "",
            jest.fn()
        );

        expect(breadcrumbs.length).toBe(3);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("General example root");
        expect(breadcrumbs[1].href).toBe("bat");
        expect(breadcrumbs[1].text).toBe("General example property");
        expect(breadcrumbs[2].href).toBe("");
        expect(breadcrumbs[2].text).toBe("General example child");
    });
});

/**
 * Gets breadcrumbs from navigation items
 */
describe("getBreadcrumbs", () => {
    test("should return a single breadcrumb item", () => {
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {},
                    data: {},
                    text: "General example",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
            "",
            jest.fn()
        );

        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("General example");
    });
    test("should return breadcrumbs for nested property locations", () => {
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {},
                    data: {},
                    text: "A",
                    type: DataType.object,
                    items: ["foo"],
                },
                foo: {
                    self: "",
                    parent: "",
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {},
                    data: {},
                    text: "B",
                    type: DataType.object,
                    items: ["bar"],
                },
                bar: {
                    self: "",
                    parent: "foo",
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {},
                    data: {},
                    text: "C",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
            "bar",
            jest.fn()
        );

        expect(breadcrumbs.length).toBe(3);
    });
});
