import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
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
        cssSpacing_type__margin__active: "cssSpacing_type__margin__active",
        cssSpacing_type__padding__active: "cssSpacing_type__padding__active",
        cssSpacing_type__margin__hover: "cssSpacing_type__margin__hover",
        cssSpacing_type__padding__hover: "cssSpacing_type__padding__hover",
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
    test("should display the `type` as margin when it the `type` prop is not passed", () => {
        const rendered: any = mount(<CSSSpacing />);

        expect(rendered.find("span").text()).toEqual("MARGIN");
    });
    test("should display the `type` as margin when margin is passed as the `type` prop", () => {
        const rendered: any = mount(<CSSSpacing type={SpacingType.margin} />);

        expect(rendered.find("span").text()).toEqual("MARGIN");
    });
    test("should display the `type` as padding when padding is passed as the `type` prop", () => {
        const rendered: any = mount(<CSSSpacing type={SpacingType.padding} />);

        expect(rendered.find("span").text()).toEqual("PADDING");
    });
    test("should add an active class to margin `type` region when the `type` prop is not passed", () => {
        const rendered: any = mount(<Spacing managedClasses={managedClasses} />);
        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__margin}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__margin__active
            )
        ).not.toBe(undefined);
    });
    test("should add an active class to the margin `type` region when margin is passed to the `type` prop", () => {
        const rendered: any = mount(
            <Spacing type={SpacingType.margin} managedClasses={managedClasses} />
        );
        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__margin}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__margin__active
            )
        ).not.toBe(undefined);
    });
    test("should add an active class to the padding `type` region when padding is passed to the `type` prop", () => {
        const rendered: any = mount(
            <Spacing type={SpacingType.padding} managedClasses={managedClasses} />
        );
        const classes: string[] = rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .prop("className")
            .split(" ");

        expect(
            classes.find(
                (className: string) =>
                    className === managedClasses.cssSpacing_type__padding__active
            )
        ).not.toBe(undefined);
    });
    test("should add a class to the hovered margin `type` region when the region is hovered", () => {
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
                    className === managedClasses.cssSpacing_type__margin__hover
            )
        ).not.toBe(undefined);
    });
    test("should add a class to the hovered padding `type` region when the region is hovered", () => {
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
                    className === managedClasses.cssSpacing_type__padding__hover
            )
        ).not.toBe(undefined);
    });
    test("should remove the hover active class when mouseout of the `type` regions", () => {
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
                    className === managedClasses.cssSpacing_type__padding__hover
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
                    className === managedClasses.cssSpacing_type__padding__hover
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
                    className === managedClasses.cssSpacing_type__padding__hover
            )
        ).toBe(undefined);
    });
    test("should fire the `onSpacingTypeUpdate` callback when the regions for `type` are clicked", () => {
        const onSpacingTypeUpdateCallback: any = jest.fn();
        const rendered: any = shallow(
            <Spacing
                onSpacingTypeUpdate={onSpacingTypeUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find(`.${managedClasses.cssSpacing_type__padding}`)
            .simulate("click", { currentTarget: true, target: true });

        expect(onSpacingTypeUpdateCallback).toHaveBeenCalled();
        expect(onSpacingTypeUpdateCallback.mock.calls[0][0]).toEqual(SpacingType.padding);
    });
    test("should fire the `onSpacingUpdate` callback when the top margin input values are changed", () => {
        const value: string = "top-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(top)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({ marginTop: value });
    });
    test("should fire the `onSpacingUpdate` callback when the bottom margin input values are changed", () => {
        const value: string = "bottom-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(bottom)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({ marginBottom: value });
    });
    test("should fire the `onSpacingUpdate` callback when the left margin input values are changed", () => {
        const value: string = "left-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({ marginLeft: value });
    });
    test("should fire the `onSpacingUpdate` callback when the right margin input values are changed", () => {
        const value: string = "right-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(right)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({ marginRight: value });
    });
    test("should fire the `onSpacingUpdate` callback when multiple margin input values are changed", () => {
        const rightValue: string = "right-value-example";
        const leftValue: string = "left-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
                marginRight={rightValue}
            />
        );

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value: leftValue } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({
            marginRight: rightValue,
            marginLeft: leftValue,
        });
    });
    test("should fire the `onSpacingUpdate` callback when the top padding input values are changed", () => {
        const value: string = "top-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                type={SpacingType.padding}
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(top)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({ paddingTop: value });
    });
    test("should fire the `onSpacingUpdate` callback when the bottom padding input values are changed", () => {
        const value: string = "bottom-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                type={SpacingType.padding}
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(bottom)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({
            paddingBottom: value,
        });
    });
    test("should fire the `onSpacingUpdate` callback when the left padding input values are changed", () => {
        const value: string = "left-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                type={SpacingType.padding}
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({ paddingLeft: value });
    });
    test("should fire the `onSpacingUpdate` callback when the right padding input values are changed", () => {
        const value: string = "right-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                type={SpacingType.padding}
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
            />
        );

        rendered
            .find("input")
            .at(right)
            .simulate("change", { target: { value } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({ paddingRight: value });
    });
    test("should fire the `onSpacingUpdate` callback when multiple padding input values are changed", () => {
        const rightValue: string = "right-value-example";
        const leftValue: string = "left-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                type={SpacingType.padding}
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
                paddingRight={rightValue}
            />
        );

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value: leftValue } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({
            paddingRight: rightValue,
            paddingLeft: leftValue,
        });
    });
    test("should fire the `onSpacingUpdate` callback when multiple margin input values and padding values are changed", () => {
        const rightValue: string = "right-value-example";
        const leftValue: string = "left-value-example";
        const topValue: string = "top-value-example";
        const onSpacingUpdateCallback: any = jest.fn();
        const rendered: any = mount(
            <Spacing
                type={SpacingType.padding}
                onSpacingUpdate={onSpacingUpdateCallback}
                managedClasses={managedClasses}
                paddingRight={rightValue}
                marginTop={topValue}
            />
        );

        rendered
            .find("input")
            .at(left)
            .simulate("change", { target: { value: leftValue } });

        expect(onSpacingUpdateCallback).toHaveBeenCalled();
        expect(onSpacingUpdateCallback.mock.calls[0][0]).toEqual({
            paddingRight: rightValue,
            paddingLeft: leftValue,
            marginTop: topValue,
        });
    });
    test("should", () => {
        const rendered: any = mount(
            <Spacing type={SpacingType.margin} managedClasses={managedClasses} />
        );

        expect(rendered.state("activeType")).toBe(SpacingType.margin);
        rendered.setProps({ type: SpacingType.padding });
        expect(rendered.state("activeType")).toBe(SpacingType.padding);
    });
});
