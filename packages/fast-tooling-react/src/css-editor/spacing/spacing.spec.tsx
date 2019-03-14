import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Spacing from "./spacing";
import { CSSSpacingClassNameContract } from "./spacing.style";
import { CSSSpacing, SpacingType } from "./";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSSpacing", () => {
    const managedClasses: CSSSpacingClassNameContract = {
        cssSpacing: "cssSpacing",
        cssSpacing_row: "cssSpacing_row",
        cssSpacing_type: "cssSpacing_type",
        cssSpacing_type_contentRegion: "cssSpacing_type_contentRegion",
        cssSpacing_type__margin: "cssSpacing_type__margin",
        cssSpacing_type__padding: "cssSpacing_type__padding",
        cssSpacing_type__marginActive: "cssSpacing_type__marginActive",
        cssSpacing_type__paddingActive: "cssSpacing_type__paddingActive",
        cssSpacing_type__marginHover: "cssSpacing_type__marginHover",
        cssSpacing_type__paddingHover: "cssSpacing_type__paddingHover",
        cssSpacing_input: "cssSpacing_input",
    };
    const top: number = 0;
    const left: number = 1;
    const right: number = 2;
    const bottom: number = 3;

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSSpacing />);
        }).not.toThrow();
    });
    test("should display the `spacingType` as margin intitially", () => {
        const rendered: any = mount(<CSSSpacing />);

        expect(rendered.find("span").text()).toEqual("MARGIN");
    });
    test("should display the `spacingType` as padding when padding is clicked", () => {
        const rendered: any = mount(<Spacing managedClasses={managedClasses} />);

        rendered.find(`.${managedClasses.cssSpacing_type__padding}`).simulate("click");

        expect(rendered.find("span").text()).toEqual("PADDING");
    });
    test("should display the `spacingType` as margin when margin is clicked", () => {
        const rendered: any = mount(<Spacing managedClasses={managedClasses} />);

        rendered.find(`.${managedClasses.cssSpacing_type__padding}`).simulate("click");
        rendered.find(`.${managedClasses.cssSpacing_type__margin}`).simulate("click");

        expect(rendered.find("span").text()).toEqual("MARGIN");
    });
    test("should add an active class to margin `spacingType` region initially", () => {
        const rendered: any = mount(<Spacing managedClasses={managedClasses} />);
        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__margin}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__marginActive
            )
        ).not.toBe(undefined);
    });
    test("should add an active class to the padding `spacingType` region when padding is clicked", () => {
        const rendered: any = mount(<Spacing managedClasses={managedClasses} />);

        rendered.find(`.${managedClasses.cssSpacing_type__padding}`).simulate("click");

        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__paddingActive
            )
        ).not.toBe(undefined);
    });
    test("should add a class to the hovered margin `spacingType` region when the region is hovered", () => {
        const rendered: any = shallow(<Spacing managedClasses={managedClasses} />);
        rendered
            .find(`.${managedClasses.cssSpacing_type__margin}`)
            .simulate("mouseover", { currentTarget: true, target: true });

        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__margin}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__marginHover
            )
        ).not.toBe(undefined);
    });
    test("should add a class to the hovered padding `spacingType` region when the region is hovered", () => {
        const rendered: any = shallow(<Spacing managedClasses={managedClasses} />);
        rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .simulate("mouseover", { currentTarget: true, target: true });

        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__paddingHover
            )
        ).not.toBe(undefined);
    });
    test("should remove the hover active class when mouseout of the `spacingType` regions", () => {
        const rendered: any = shallow(<Spacing managedClasses={managedClasses} />);
        rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .simulate("mouseout", { currentTarget: true, target: true });

        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__paddingHover
            )
        ).toBe(undefined);
    });
    test("should remove the hover active class when mouseover of the inner span", () => {
        const rendered: any = shallow(<Spacing managedClasses={managedClasses} />);
        rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .simulate("mouseover", { currentTarget: true, target: true });

        const classesBefore: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .prop("className")
            .split(" ");

        expect(
            classesBefore.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__paddingHover
            )
        ).not.toBe(undefined);

        rendered.find("span").simulate("mouseenter");

        const classesAfter: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .prop("className")
            .split(" ");

        expect(
            classesAfter.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__paddingHover
            )
        ).toBe(undefined);
    });
    test("should fire the `onUpdate` callback when the top margin input values are changed", () => {
        const value: string = "top-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered
            .find("input")
            .at(top)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({ marginTop: value });
    });
    test("should fire the `onUpdate` callback when the bottom margin input values are changed", () => {
        const value: string = "bottom-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered
            .find("input")
            .at(bottom)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({ marginBottom: value });
    });
    test("should fire the `onUpdate` callback when the left margin input values are changed", () => {
        const value: string = "left-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({ marginLeft: value });
    });
    test("should fire the `onUpdate` callback when the right margin input values are changed", () => {
        const value: string = "right-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered
            .find("input")
            .at(right)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({ marginRight: value });
    });
    test("should fire the `onUpdate` callback when multiple margin input values are changed", () => {
        const rightValue: string = "right-value-example";
        const leftValue: string = "left-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                data={{ marginRight: rightValue }}
                onUpdate={onUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value: leftValue } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({
            marginRight: rightValue,
            marginLeft: leftValue,
        });
    });
    test("should fire the `onUpdate` callback when the top padding input values are changed", () => {
        const value: string = "top-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered.setState({ activeType: SpacingType.padding });

        rendered
            .find("input")
            .at(top)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({ paddingTop: value });
    });
    test("should fire the `onUpdate` callback when the bottom padding input values are changed", () => {
        const value: string = "bottom-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered.setState({ activeType: SpacingType.padding });

        rendered
            .find("input")
            .at(bottom)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({
            paddingBottom: value,
        });
    });
    test("should fire the `onUpdate` callback when the left padding input values are changed", () => {
        const value: string = "left-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered.setState({ activeType: SpacingType.padding });

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({ paddingLeft: value });
    });
    test("should fire the `onUpdate` callback when the right padding input values are changed", () => {
        const value: string = "right-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing onUpdate={onUpdateCallback} managedClasses={managedClasses} />
        );

        rendered.setState({ activeType: SpacingType.padding });

        rendered
            .find("input")
            .at(right)
            .simulate("change", { target: { value } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({ paddingRight: value });
    });
    test("should fire the `onUpdate` callback when multiple padding input values are changed", () => {
        const rightValue: string = "right-value-example";
        const leftValue: string = "left-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                data={{
                    paddingRight: rightValue,
                }}
                onUpdate={onUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered.setState({ activeType: SpacingType.padding });

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value: leftValue } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({
            paddingRight: rightValue,
            paddingLeft: leftValue,
        });
    });
    test("should fire the `onUpdate` callback when multiple margin input values and padding values are changed", () => {
        const rightValue: string = "right-value-example";
        const leftValue: string = "left-value-example";
        const topValue: string = "top-value-example";
        const onUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                data={{
                    paddingRight: rightValue,
                    marginTop: topValue,
                }}
                onUpdate={onUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered.setState({ activeType: SpacingType.padding });

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value: leftValue } });

        expect(onUpdateCallback).toHaveBeenCalled();
        expect(onUpdateCallback.mock.calls[0][0]).toEqual({
            paddingRight: rightValue,
            paddingLeft: leftValue,
            marginTop: topValue,
        });
    });
});
