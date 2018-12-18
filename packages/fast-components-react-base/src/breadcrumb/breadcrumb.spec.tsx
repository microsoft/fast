import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import Breadcrumb, {
    BreadcrumbClassNameContract,
    BreadcrumbUnhandledProps,
} from "./breadcrumb";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: BreadcrumbClassNameContract = {
    breadcrumb: "breadcrumb-class",
    breadcrumb_item: "breadcrumb-item-class",
    breadcrumb_item__current: "breadcrumb-item-current-class",
    breadcrumb_itemsContainer: "breadcrumb-items-container-class",
    breadcrumb_separator: "breadcrumb-separator-class",
};

describe("breadcrumb", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((Breadcrumb as any).name).toBe(Breadcrumb.displayName);
    });

    test("should have correct root element type 'nav'", () => {
        const rendered: ShallowWrapper = shallow(<Breadcrumb />);
        expect(rendered.type()).toBe("nav");
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(
                <Breadcrumb
                    managedClasses={managedClasses}
                    /* tslint:disable-next-line */
                    separator={(className?: string): React.ReactNode => {
                        return <div className={className}>\</div>;
                    }}
                >
                    <a />
                    <a />
                </Breadcrumb>
            );
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: BreadcrumbUnhandledProps = {
            "aria-controls": "controls",
        };

        const rendered: any = shallow(<Breadcrumb {...unhandledProps} />);

        expect(rendered.first().prop("aria-controls")).toEqual("controls");
    });

    test("should set current class name on last rendered", (): void => {
        const rendered: any = mount(
            <Breadcrumb managedClasses={managedClasses}>
                <a />
                <a />
                <a />
                <a />
            </Breadcrumb>
        );

        const lastItem: any = rendered.findWhere((element: any) => {
            return element.props()["aria-current"] !== undefined;
        });
        /* tslint:disable-next-line */
        expect(lastItem.props()["className"]).toContain("breadcrumb-item-current-class");
    });

    test("should not clobber custom class name on last rendered", (): void => {
        const rendered: any = mount(
            <Breadcrumb managedClasses={managedClasses}>
                <a />
                <a />
                <a />
                <a className="Test" />
            </Breadcrumb>
        );

        const lastItem: any = rendered.findWhere((element: any) => {
            return element.props()["aria-current"] !== undefined;
        });
        /* tslint:disable-next-line */
        const className: string = lastItem.props()["className"];
        expect(className).toContain("breadcrumb-item-current-class");
        expect(className).toContain("Test");
        expect(className).not.toContain("Testbreadcrumb-item-current-class");
        expect(className).not.toContain("breadcrumb-item-current-classTest");
    });

    test("should set seprator class name on seperator if the `separator` prop is passed", () => {
        const rendered: any = shallow(
            <Breadcrumb
                managedClasses={managedClasses}
                /* tslint:disable-next-line */
                separator={(className?: string): React.ReactNode => {
                    return <div className={className}>\</div>;
                }}
            >
                <a />
                <a />
            </Breadcrumb>
        );

        expect(rendered.exists("div.breadcrumb-separator-class")).toBe(true);
    });

    test("should not set undefined if classes are not defined", () => {
        const missingManagedClasses: BreadcrumbClassNameContract = {
            breadcrumb: "breadcrumb-class",
            breadcrumb_itemsContainer: "breadcrumb-items-container-class",
        };
        const rendered: any = shallow(
            <Breadcrumb
                managedClasses={missingManagedClasses}
                /* tslint:disable-next-line */
                separator={(className?: string): React.ReactNode => {
                    return <div className={className}>\</div>;
                }}
            >
                <a />
                <a />
            </Breadcrumb>
        );

        expect(rendered.exists("a.undefined")).toBe(false);
        expect(rendered.exists("div.undefined")).toBe(false);
    });
});
