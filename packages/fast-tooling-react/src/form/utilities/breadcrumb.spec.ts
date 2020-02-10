import { BreadcrumbItem, getBreadcrumbs } from "./breadcrumb";
import { DataType } from "../../data-utilities/types";

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
            "bar",
            jest.fn()
        );

        expect(breadcrumbs.length).toBe(3);
    });
});
