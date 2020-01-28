import { BreadcrumbItemEventHandler } from "../form.props";
import { FormChildOptionItem } from "../types";

import arraysSchema from "../../__tests__/schemas/arrays.schema.json";
import generalSchema from "../../__tests__/schemas/general.schema.json";
import objectsSchema from "../../__tests__/schemas/objects.schema.json";
import childrenSchema from "../../__tests__/schemas/children.schema.json";
import textFieldSchema from "../../__tests__/schemas/text-field.schema.json";
import oneOfSchema from "../../__tests__/schemas/one-of.schema.json";
import deeplyNestedOneOfSchema from "../../__tests__/schemas/one-of-deeply-nested.schema.json";
import { reactChildrenStringSchema } from "../controls/control.children.text";
import anyOfSchema from "../../__tests__/schemas/any-of.schema.json";

import Navigation, { NavigationItem } from "./navigation";
import { BreadcrumbItem, getBreadcrumbs, HandleBreadcrumbClick } from "./breadcrumb";

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
        const navigation: Navigation = new Navigation({
            dataLocation: "",
            data: {
                alignHorizontal: "left",
            },
            schema: generalSchema,
            childOptions,
        });
        const navigationItems: NavigationItem[] = navigation.get();
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigationItems,
            handleBreadcrumbClick
        );

        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("General example");
    });
    test("should return breadcrumbs for nested property locations", () => {
        const navigation: Navigation = new Navigation({
            dataLocation: "optionalObjectWithNestedObject.nestedObject",
            data: {
                optionalObjectWithNestedObject: {
                    nestedObject: {
                        boolean: true,
                    },
                },
            },
            schema: objectsSchema,
            childOptions,
        });
        const navigationItems: NavigationItem[] = navigation.get();
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigationItems,
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
        const navigation: Navigation = new Navigation({
            dataLocation: "objects.1",
            data: { objects: [{ string: "foo" }, { string: "bar" }] },
            schema: arraysSchema,
            childOptions,
        });
        const navigationItems: NavigationItem[] = navigation.get();
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigationItems,
            handleBreadcrumbClick
        );

        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[0].href).toBe("");
        expect(breadcrumbs[0].text).toBe("Component with array");
        expect(breadcrumbs[1].href).toBe("objects[1]");
        expect(breadcrumbs[1].text).toBe("Object");
    });
    test("should return items for an anyOf/oneOf location", () => {
        const navigationRoot: Navigation = new Navigation({
            dataLocation: "",
            data: { nestedAnyOf: { string: "foo" } },
            schema: anyOfSchema,
            childOptions,
        });
        const navigationItemsRoot: NavigationItem[] = navigationRoot.get();
        const navigation: Navigation = new Navigation({
            dataLocation: "nestedAnyOf",
            data: { nestedAnyOf: { string: "foo" } },
            schema: anyOfSchema,
            childOptions,
        });
        const navigationItems: NavigationItem[] = navigation.get();
        const breadcrumbsRoot: BreadcrumbItem[] = getBreadcrumbs(
            navigationItemsRoot,
            handleBreadcrumbClick
        );
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            navigationItems,
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
