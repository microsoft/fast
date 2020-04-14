import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import {
    Grid,
    GridAlignment,
    GridClassNamesContract,
    GridHandledProps,
    GridUnhandledProps,
} from "./grid";
import { GridTag } from "./grid.props";

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

describe("Grid", (): void => {
    const managedClasses: GridClassNamesContract = {
        grid: "grid",
    };

    describe("with CSS grid support", () => {
        test("should set an inline style of `display: grid` when CSS grid is supported", () => {
            const rendered: any = shallow(<Grid />);

            expect(rendered.props().style.display).toEqual("grid");
        });

        test("should set an inline style for gridColumnGap in pixels equal to the `gutter` prop when passed", () => {
            const rendered: any = shallow(
                <Grid gutter={1} managedClasses={managedClasses} />
            );

            expect(rendered.props().style.gridColumnGap).toBe("1px");
        });

        test("should set `gridColumnGap` inline style value in pixels relative to the index of the current breakpoint", () => {
            const rendered: any = shallow(
                <Grid gutter={[8, 12, 24]} managedClasses={managedClasses} />
            );

            expect(rendered.props().style.gridColumnGap).toEqual("24px");

            (window as any)["innerWidth"] = 0;

            // set props to force an update
            rendered.setProps({ tag: GridTag.section });

            expect(rendered.props().style.gridColumnGap).toEqual("8px");
        });

        test("should set an inline style for `gridColumn` with a value equal to the `gridColumn` prop", () => {
            const rendered: any = shallow(
                <Grid gridColumn={2} managedClasses={managedClasses} />
            );

            expect(rendered.props().style.gridColumn).toBe(2);
        });

        test("should set an inline style for `gridRow` with a value equal to the `row` prop", () => {
            const rendered: any = shallow(
                <Grid row={1} managedClasses={managedClasses} />
            );

            expect(rendered.props().style.gridRow).toBe(1);
        });

        test("should set an inline style for alignItems with a value equal to the `verticalAlign` prop", () => {
            const rendered: any = shallow(
                <Grid
                    verticalAlign={GridAlignment.center}
                    managedClasses={managedClasses}
                />
            );

            expect(rendered.props().style.alignItems).toBe(GridAlignment.center);
        });

        test("should set an inline style for justifyItems with a value equal to the `horizontalAlign` prop", () => {
            const rendered: any = shallow(
                <Grid
                    horizontalAlign={GridAlignment.center}
                    managedClasses={managedClasses}
                />
            );

            expect(rendered.props().style.justifyItems).toBe(GridAlignment.center);
        });

        test("should set an inline style for gridTemplateColumns with a repeating column count equal to the `columnCount` prop", () => {
            const rendered: any = shallow(
                <Grid columnCount={5} managedClasses={managedClasses} />
            );

            expect(rendered.props().style.gridTemplateColumns).toBe(`repeat(5, 1fr)`);
        });
    });

    test("should have a displayName that matches the component name", () => {
        expect(`${(Grid as any).name}`).toBe(Grid.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Grid />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: GridUnhandledProps = {
            "aria-hidden": true,
        };

        const props: GridHandledProps & GridUnhandledProps = {
            ...unhandledProps,
        };

        const rendered: any = mount(<Grid managedClasses={managedClasses} {...props} />);

        expect(rendered.first().prop("aria-hidden")).toEqual(true);
    });

    test("should set a default tag value if no `tag` prop is passed", () => {
        const rendered: any = mount(<Grid managedClasses={managedClasses} />);

        expect(rendered.props().tag).not.toBe(undefined);
        expect(rendered.props().tag).toBe(GridTag.div);
    });

    test("should set a tag value equal to the `tag` prop when passed", () => {
        const rendered: any = shallow(
            <Grid tag={GridTag.main} managedClasses={managedClasses} />
        );

        expect(rendered.instance().props.tag).toBe(GridTag.main);
        expect(rendered.type()).toEqual(GridTag.main);
    });

    test("should set a default gridColumn value if no `gridColumn` prop is passed", () => {
        const rendered: any = mount(<Grid managedClasses={managedClasses} />);

        expect(rendered.props().gridColumn).not.toBe(undefined);
        expect(rendered.props().gridColumn).toBe(2);
    });

    test("should set a gridColumn value equal to the `gridColumn` prop when passed", () => {
        const rendered: any = mount(
            <Grid gridColumn={1} managedClasses={managedClasses} />
        );

        expect(rendered.props().gridColumn).toBe(1);
    });

    test("should set a default gutter value if no `gutter` prop is passed", () => {
        const rendered: any = mount(<Grid managedClasses={managedClasses} />);

        expect(rendered.props().gutter).not.toBe(undefined);
        expect(rendered.props().gutter).toBe(8);
    });

    test("should set a gutter value equal to the `gutter` prop when passed", () => {
        const rendered: any = mount(<Grid gutter={24} managedClasses={managedClasses} />);

        expect(rendered.props().gutter).toBe(24);
    });

    test("should accept an array of gutter values", () => {
        const rendered: any = mount(
            <Grid gutter={[8, 12, 24]} managedClasses={managedClasses} />
        );

        expect(() => rendered).not.toThrow();
        expect(rendered.props().gutter).toStrictEqual([8, 12, 24]);
    });

    test("should set a default verticalAlign value if no `verticalAlign` prop is passed", () => {
        const rendered: any = mount(<Grid managedClasses={managedClasses} />);

        expect(rendered.props().verticalAlign).not.toBe(undefined);
        expect(rendered.props().verticalAlign).toBe(GridAlignment.stretch);
    });

    test("should set a verticalAlign value equal to the `verticalAlign` prop when passed", () => {
        const rendered: any = mount(
            <Grid verticalAlign={GridAlignment.center} managedClasses={managedClasses} />
        );

        expect(rendered.props().verticalAlign).toBe(GridAlignment.center);
    });

    test("should set a default horizontalAlign value if no `horizontalAlign` prop is passed", () => {
        const rendered: any = mount(<Grid managedClasses={managedClasses} />);

        expect(rendered.props().horizontalAlign).not.toBe(undefined);
        expect(rendered.props().horizontalAlign).toBe(GridAlignment.stretch);
    });

    test("should set a horizontalAlign value equal to the `horizontalAlign` prop when passed", () => {
        const rendered: any = mount(
            <Grid
                horizontalAlign={GridAlignment.center}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().horizontalAlign).toBe(GridAlignment.center);
    });

    test("should set a default columnCount value if no `columnCount` prop is passed", () => {
        const rendered: any = mount(<Grid managedClasses={managedClasses} />);

        expect(rendered.props().columnCount).not.toBe(undefined);
        expect(rendered.props().columnCount).toBe(12);
    });

    test("should set a columnCount value equal to the `columnCount` prop when passed", () => {
        const rendered: any = mount(
            <Grid columnCount={5} managedClasses={managedClasses} />
        );

        expect(rendered.props().columnCount).toBe(5);
    });

    test("should set a display value equal to the `cssGridPropertyName` prop when passed", () => {
        const rendered: any = mount(
            <Grid cssGridPropertyName={"-ms-grid"} managedClasses={managedClasses} />
        );

        expect(rendered.props().cssGridPropertyName).toBe("-ms-grid");
    });

    test("should set the CSS display style to a value that equals the `cssGridPropertyName` prop when passed", () => {
        const rendered: any = shallow(
            <Grid cssGridPropertyName={"-ms-grid"} managedClasses={managedClasses} />
        );

        expect(rendered.props().style.display).toBe("-ms-grid");
    });
});
