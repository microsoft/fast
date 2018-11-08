import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Breadcrumb, {
    BreadcrumbClassNameContract,
    BreadcrumbUnhandledProps,
} from "./breadcrumb";
import BreadcrumbItem from "../breadcrumb-item";
import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("breadcrumb", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((Breadcrumb as any).name).toBe(Breadcrumb.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Breadcrumb />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: BreadcrumbUnhandledProps = {
            "aria-controls": "controls",
        };

        const rendered: any = shallow(<Breadcrumb {...unhandledProps} />);

        expect(rendered.first().prop("aria-controls")).toEqual("controls");
    });

    test("should set current value on last rendered", (): void => {
        const rendered: any = mount(
            <Breadcrumb>
                <BreadcrumbItem />
                <BreadcrumbItem />
                <BreadcrumbItem />
                <BreadcrumbItem />
            </Breadcrumb>
        );

        expect(rendered.find("BreadcrumbItem").get(3).props.current).toBe(true);
    });

    test("should render a `span` element as second child if the `seprator` prop is passed", () => {
        const managedClasses: BreadcrumbClassNameContract = {
            breadcrumb: "breadcrumb-class",
            breadcrumb__seperator: "breadcrumb-seperator-class",
        };

        const rendered: any = shallow(
            <Breadcrumb managedClasses={managedClasses} seperator={<div />}>
                <BreadcrumbItem />
                <BreadcrumbItem />
            </Breadcrumb>
        );

        expect(rendered.find("span").hasClass("breadcrumb-seperator-class")).toBe(true);
    });
});
