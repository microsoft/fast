import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import { controls } from "./form-control-switch.spec";
import { FormDictionary } from "./form-dictionary";
import { FormDictionaryProps } from "./form-dictionary.props";
import { FormDictionaryClassNameContract } from "./form-dictionary.style";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormDictionaryClassNameContract = {
    formDictionary: "formDictionary-class",
    formDictionary_controlAddTrigger: "formDictionary_controlAddTrigger-class",
    formDictionary_itemControlInput: "formDictionary_itemControlInput-class",
    formDictionary_itemControlLabel: "formDictionary_itemControlLabel-class",
    formDictionary_itemControlRemoveTrigger:
        "formDictionary_itemControlRemoveTrigger-class",
};

const dictionaryProps: FormDictionaryProps = {
    index: 1,
    controls,
    dataLocation: "",
    schemaLocation: "",
    data: "",
    schema: {},
    required: false,
    label: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    examples: void 0,
    propertyLabel: "",
    additionalProperties: {
        type: "string",
    },
    enumeratedProperties: [],
    childOptions: [],
    validationErrors: undefined,
};

describe("FormDictionary", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <FormDictionary {...dictionaryProps} managedClasses={managedClasses} />
            );
        }).not.toThrow();
    });
    test("should add a property if the add trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
            />
        );

        rendered
            .find(`.${managedClasses.formDictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("example text");
    });
    test("should add a property using a default if a default has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={{
                    type: "string",
                    default: "foobar",
                }}
            />
        );

        rendered
            .find(`.${managedClasses.formDictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("foobar");
    });
    test("should add a property using an example if an examples array has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        rendered
            .find(`.${managedClasses.formDictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("foobar");
    });
    test("should add a property using generated data if an empty examples array has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={{
                    type: "string",
                    examples: [],
                }}
            />
        );

        rendered
            .find(`.${managedClasses.formDictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("example text");
    });
    test("should remove a property if the remove trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={{
                    type: "string",
                }}
            />
        );

        rendered
            .find(`.${managedClasses.formDictionary_itemControlRemoveTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0]).toEqual({
            dataLocation: "a",
            value: void 0,
        });
    });
    test("should update the property key if the property key input is updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        rendered
            .find(`.${managedClasses.formDictionary_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0]).toEqual({
            dataLocation: "",
            value: { b: "bar", c: "foo" },
        });
    });
    test("should retain the location of the property keys in the object if they are updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        rendered
            .find(`.${managedClasses.formDictionary_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(Object.keys(onChangeCallback.mock.calls[0][0].value)).toEqual(["c", "b"]);
    });
    test("should render a control based on the schema type", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                onChange={onChangeCallback}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        const formControls: any = rendered.find("TextareaControl");

        expect(formControls).toHaveLength(2);
    });
    test("should show all dictionary keys no matter the order", () => {
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                data={{
                    foo: "a",
                    a: "foo",
                    bar: "b",
                    b: "bar",
                }}
                enumeratedProperties={["foo", "bar"]}
                additionalProperties={{
                    type: "string",
                    examples: ["foobar"],
                }}
            />
        );

        const formControls: any = rendered.find("TextareaControl");

        expect(formControls).toHaveLength(2);
    });
    test("should show only property key inputs if the additionalProperties is false", () => {
        const rendered: any = mount(
            <FormDictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                data={{
                    a: "foo",
                    b: "bar",
                }}
                additionalProperties={false}
            />
        );

        const propertyKeyInputs: any = rendered.find(
            `.${managedClasses.formDictionary_itemControlInput}`
        );
        const formControlSwitch: any = rendered.find(
            `.${managedClasses.formDictionary_controlRegion}`
        );

        expect(propertyKeyInputs).toHaveLength(2);
        expect(formControlSwitch).toHaveLength(0);
    });
});
