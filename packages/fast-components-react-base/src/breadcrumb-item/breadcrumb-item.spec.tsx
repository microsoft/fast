import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import BreadcrumbItem, { BreadcrumbItemUnhandledProps } from "./breadcrumb-item";
import { BreadcrumbItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Breadcrumb from "../breadcrumb/breadcrumb";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("breadcrumb-item", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((BreadcrumbItem as any).name).toBe(BreadcrumbItem.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<BreadcrumbItem />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: BreadcrumbItemUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<BreadcrumbItem {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should set aria-current to page when props is set to current", (): void => {
        const rendered: any = shallow(<BreadcrumbItem current={true} />);

        expect(rendered.find("Hypertext").get(0).props["aria-current"]).toBe("page");
    });

    test("should set aria-current to undefined when current prop is not set", (): void => {
        const rendered: any = shallow(<BreadcrumbItem />);

        expect(rendered.find("Hypertext").get(0).props["aria-current"]).toBe(undefined);
    });

    test("should add the current className and the base className when the hidden prop is passed", () => {
        const managedClasses: BreadcrumbItemClassNameContract = {
            breadcrumbItem: "breadcrumb-item-class",
            breadcrumbItem__current: "breadcrumb-item-current-class",
            breadcrumbItem__hypertext: "breadcrumb-item-hypertext-class",
        };

        const rendered: any = shallow(
            <BreadcrumbItem current={true} managedClasses={managedClasses} />
        );

        expect(
            rendered.hasClass("breadcrumb-item-class breadcrumb-item-current-class")
        ).toBe(true);
    });
});
