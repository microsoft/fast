import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, ShallowWrapper } from "enzyme";
import { DisplayNamePrefix } from "../utilities";
import Toggle, {
    ToggleClassNameContract,
    ToggleHandledProps,
    ToggleProps,
    ToggleUnhandledProps,
} from "./toggle";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("toggle", (): void => {
    const managedClasses: ToggleClassNameContract = {
        toggle: "toggle-class",
        toggle_label: "toggle-label-class",
        toggle_toggleButton: "toggle-wrapper-class",
        toggle_input: "toggle-input-class",
        toggle_stateIndicator: "toggle-button-class",
        toggle_statusMessage: "toggle_statusMessage-class",
    };
    const handledProps: ToggleHandledProps = {
        managedClasses,
        inputId: "id",
        selectedMessage: "selected-message",
        statusMessageId: "status-message-id",
        unselectedMessage: "unselected-message",
    };

    const inputSelector: string = `.${managedClasses.toggle_input}`;

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(Toggle as any).name}`).toBe(Toggle.displayName);
    });

    test("should have correct input type attribute 'checkbox'", () => {
        const rendered: ShallowWrapper = shallow(<Toggle {...handledProps} />);
        expect(rendered.find("#id").prop("type")).toBe("checkbox");
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(
                <Toggle
                    inputId="id"
                    selectedMessage="selectedString"
                    unselectedMessage="selectedString"
                    statusMessageId="statusLabelId"
                    labelId="labelId"
                />
            );
        }).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const unhandledProps: ToggleUnhandledProps = {
            "aria-label": "true",
        };

        const props: ToggleProps = { ...handledProps, ...unhandledProps };
        const rendered: any = shallow(<Toggle {...props} />);

        expect(rendered.first().prop("aria-label")).toBe("true");
    });

    test("should initalize as unselected if the `selected` prop is not provided", () => {
        const rendered: any = shallow(<Toggle {...handledProps} />);

        expect(rendered.state("selected")).toBe(false);
    });

    test("should render with an `aria-disabled` prop when `disabled` prop is passed as true", () => {
        const rendered: any = shallow(<Toggle {...handledProps} disabled={true} />);

        expect(rendered.prop("aria-disabled")).toBe(true);
    });

    test("should allow a change event to update the selected state when no `selected` prop is provided", () => {
        const rendered: any = shallow(<Toggle {...handledProps} />);

        expect(rendered.state("selected")).toBe(false);

        rendered.find(inputSelector).simulate("change");

        expect(rendered.state("selected")).toBe(true);
    });

    test("should call a registered callback after a change event", () => {
        const onChange: any = jest.fn();
        const uncontrolled: any = shallow(
            <Toggle {...handledProps} onChange={onChange} />
        );
        const controlled: any = shallow(
            <Toggle {...handledProps} selected={true} onChange={onChange} />
        );

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test("should not allow a change event to update the selected state when props.selected is provided", () => {
        const rendered: any = shallow(<Toggle {...handledProps} selected={false} />);

        expect(rendered.state("selected")).toEqual(false);
        rendered.find(inputSelector).simulate("change");

        expect(rendered.state("selected")).toEqual(false);

        rendered.setProps({ selected: true });

        expect(rendered.state("selected")).toEqual(true);
        rendered.find(inputSelector).simulate("change");
        expect(rendered.state("selected")).toEqual(true);
    });

    test("should render status message when unselected or selected message prop is passed", () => {
        const rendered: any = shallow(
            <Toggle inputId="id" {...handledProps} selected={false} />
        );

        expect(rendered.exists("span.toggle_statusMessage-class")).toBe(true);
    });

    test("should not render status message when unselected and selected message prop is not passed", () => {
        const rendered: any = shallow(
            <Toggle inputId="id" managedClasses={managedClasses} selected={false} />
        );

        expect(rendered.exists("span.toggle_statusMessage-class")).toBe(false);
    });

    test("should set id on span and aria-describedby on input when statusMessageId is passed", () => {
        const rendered: any = shallow(
            <Toggle inputId="id" {...handledProps} selected={false} />
        );

        const span: any = rendered.find("span.toggle_statusMessage-class");
        const input: any = rendered.find("input.toggle-input-class");

        expect(span.prop("id")).toEqual("status-message-id");
        expect(input.prop("aria-describedby")).toEqual("status-message-id");
    });

    test("should render an input with an `name` prop when an `name` prop is passed", () => {
        const testId: string = "toggle";
        const toggleName: string = "toggleName";
        const rendered: any = shallow(
            <Toggle managedClasses={managedClasses} inputId={testId} name={toggleName} />
        );

        expect(rendered.find(inputSelector).prop("name")).toBe(toggleName);
    });
});
