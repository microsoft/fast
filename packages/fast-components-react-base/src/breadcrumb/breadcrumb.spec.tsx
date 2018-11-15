import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Breadcrumb, {
    BreadcrumbClassNameContract,
    BreadcrumbUnhandledProps,
} from "./breadcrumb";
import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: BreadcrumbClassNameContract = {
    breadcrumb: "breadcrumb-class",
    breadcrumb_item: "breadcrumb-item-class",
    breadcrumb_item__current: "breadcrumb-item-current-class",
    breadcrumb_ol: "breadcrumb-ol-class",
    breadcrumb_seperator: "breadcrumb-seperator-class",
};

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
        const rendered: any = shallow(
            <Breadcrumb managedClasses={managedClasses}>
                <a />
                <a />
                <a />
                <a />
            </Breadcrumb>
        );

        expect(rendered.exists("a.breadcrumb-item-current-class")).toBe(true);
    });

    test("should render a `div` element as second child if the `seperator` prop is passed", () => {
        const rendered: any = shallow(
            <Breadcrumb
                managedClasses={managedClasses}
                /* tslint:disable-next-line */
                seperator={(className?: string): React.ReactNode => {
                    return <div className={className}>\</div>;
                }}
            >
                <a />
                <a />
            </Breadcrumb>
        );

        expect(rendered.exists("div.breadcrumb-seperator-class")).toBe(true);
    });
});
