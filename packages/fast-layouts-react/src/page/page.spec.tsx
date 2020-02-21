import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import {
    Page,
    PageClassNamesContract,
    PageHandledProps,
    PageUnhandledProps,
} from "./page";

/**
 * Mock and allow control of canUseCssGrid return value
 */
jest.mock("@microsoft/fast-web-utilities", () => {
    return {
        ...jest.requireActual("@microsoft/fast-web-utilities"),
        canUseCssGrid: (): boolean => true,
    };
});

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Page", (): void => {
    const managedClasses: PageClassNamesContract = {
        page: "page",
    };
    test("should have a displayName that matches the component name", () => {
        expect(`${(Page as any).name}`).toBe(Page.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Page />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: PageHandledProps = {
            maxWidth: "1400px",
        };
        const unhandledProps: PageUnhandledProps = {
            "aria-hidden": true,
        };

        const props: PageHandledProps & PageUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<Page managedClasses={managedClasses} {...props} />);

        expect(rendered.first().prop("aria-hidden")).toEqual(true);
    });

    test("should set an inline style of `display: grid` when CSS grid is supported", () => {
        const rendered: any = shallow(<Page />);

        expect(rendered.props().style.display).toEqual("grid");
    });

    test("should set an inline style of `display: -ms-grid` when -ms-grid is specified and CSS grid is supported", () => {
        const rendered: any = shallow(<Page cssGridPropertyName="-ms-grid" />);

        expect(rendered.props().style.display).toEqual("-ms-grid");
    });

    test("should set an inline style of `display: grid` when grid is specified and CSS grid is supported", () => {
        const rendered: any = shallow(<Page cssGridPropertyName="grid" />);

        expect(rendered.props().style.display).toEqual("grid");
    });

    test("should set a default maxWidth value if no `maxWidth` prop is passed", () => {
        const rendered: any = mount(<Page managedClasses={managedClasses} />);

        expect(rendered.props().maxWidth).not.toBe(undefined);
        expect(rendered.props().maxWidth).toBe("1600px");
    });

    test("should set a maxWidth value equal to the `maxWidth` prop when passed", () => {
        const rendered: any = mount(
            <Page maxWidth={"100%"} managedClasses={managedClasses} />
        );

        expect(rendered.props().maxWidth).toBe("100%");
    });

    test("should set a default margin value if no `margin` prop is passed", () => {
        const rendered: any = mount(<Page managedClasses={managedClasses} />);

        expect(rendered.props().margin).not.toBe(undefined);
        expect(rendered.props().margin).toBe("minmax(5vw, 1fr)");
    });

    test("should set a margin value equal to the `margin` prop when passed", () => {
        const rendered: any = mount(
            <Page margin={"10%"} managedClasses={managedClasses} />
        );

        expect(rendered.props().margin).toBe("10%");
    });

    test("should set an inline style of `gridTemplateColumns` when CSS grid is supported", () => {
        const expectedMargin: string = "0";
        const expectedMaxWidth: string = "1200px";
        const rendered: any = shallow(
            <Page margin={expectedMargin} maxWidth={expectedMaxWidth} />
        );
        function gridTemplateColumnsFormatter(margin: string, maxWidth: string): string {
            return `${margin} minmax(0, ${maxWidth}) ${margin}`;
        }

        expect(rendered.props().style.gridTemplateColumns).toEqual(
            gridTemplateColumnsFormatter(expectedMargin, expectedMaxWidth)
        );
    });
});
