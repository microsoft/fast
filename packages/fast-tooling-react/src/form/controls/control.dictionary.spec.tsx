import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { DictionaryFormControl } from "./control.dictionary";
import {
    DictionaryFormControlClassNameContract,
    DictionaryFormControlProps,
} from "./control.dictionary.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: DictionaryFormControlClassNameContract = {
    dictionaryFormControl: "dictionaryFormControl-class",
    dictionaryFormControl_controlAddTrigger:
        "dictionaryFormControl_controlAddTrigger-class",
    dictionaryFormControl_itemControlInput:
        "dictionaryFormControl_itemControlInput-class",
    dictionaryFormControl_itemControlLabel:
        "dictionaryFormControl_itemControlLabel-class",
    dictionaryFormControl_itemControlRemoveTrigger:
        "dictionaryFormControl_itemControlRemoveTrigger-class",
};

const dictionaryProps: DictionaryFormControlProps = {
    index: 1,
    dataLocation: "",
    schemaLocation: "",
    data: "",
    required: false,
    label: "",
    untitled: "",
    onChange: jest.fn(),
    onUpdateActiveSection: jest.fn(),
    invalidMessage: "",
    schema: {},
    enumeratedProperties: [],
    childOptions: [],
};

describe("DictionaryFormControl", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <DictionaryFormControl
                    {...dictionaryProps}
                    managedClasses={managedClasses}
                />
            );
        }).not.toThrow();
    });
    test("should add a property if the add trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <DictionaryFormControl
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                schema={{
                    type: "string",
                }}
            />
        );

        rendered
            .find(`.${managedClasses.dictionaryFormControl_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual("example text");
    });
    test("should add a property using a default if a default has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <DictionaryFormControl
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                schema={{
                    type: "string",
                    default: "foobar",
                }}
            />
        );

        rendered
            .find(`.${managedClasses.dictionaryFormControl_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual("foobar");
    });
    test("should add a property using an example if an examples array has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <DictionaryFormControl
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                schema={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        rendered
            .find(`.${managedClasses.dictionaryFormControl_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual("foobar");
    });
    test("should remove a property if the remove trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <DictionaryFormControl
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                schema={{
                    type: "string",
                }}
            />
        );

        rendered
            .find(`.${managedClasses.dictionaryFormControl_itemControlRemoveTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0]).toEqual("a");
        expect(onChangeCallback.mock.calls[0][1]).toEqual(void 0);
    });
    test("should update the property key if the property key input is updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <DictionaryFormControl
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                schema={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        rendered
            .find(`.${managedClasses.dictionaryFormControl_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual({ b: "bar", c: "foo" });
    });
    test("should retain the location of the property keys in the object if they are updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <DictionaryFormControl
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                schema={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        rendered
            .find(`.${managedClasses.dictionaryFormControl_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(Object.keys(onChangeCallback.mock.calls[0][1])).toEqual(["c", "b"]);
    });
    test("should render a control based on the schema type", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <DictionaryFormControl
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                schema={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        const formControls: any = rendered.find("TextareaFormControl");

        expect(formControls).toHaveLength(2);
    });
});
