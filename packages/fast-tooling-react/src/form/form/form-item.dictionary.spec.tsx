import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { FormItemDictionary } from "./form-item.dictionary";
import {
    FormItemDictionaryClassNameContract,
    FormItemDictionaryProps,
} from "./form-item.dictionary.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: FormItemDictionaryClassNameContract = {
    formItemDictionary: "formItemDictionary-class",
    formItemDictionary_controlAddTrigger: "formItemDictionary_controlAddTrigger-class",
    formItemDictionary_itemControlInput: "formItemDictionary_itemControlInput-class",
    formItemDictionary_itemControlLabel: "formItemDictionary_itemControlLabel-class",
    formItemDictionary_itemControlRemoveTrigger:
        "formItemDictionary_itemControlRemoveTrigger-class",
};

const dictionaryProps: FormItemDictionaryProps = {
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

describe("FormItemDictionary", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(
                <FormItemDictionary
                    {...dictionaryProps}
                    managedClasses={managedClasses}
                />
            );
        }).not.toThrow();
    });
    test("should add a property if the add trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDictionary
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
            .find(`.${managedClasses.formItemDictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual("example text");
    });
    test("should add a property using a default if a default has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDictionary
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
            .find(`.${managedClasses.formItemDictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual("foobar");
    });
    test("should add a property using an example if an examples array has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDictionary
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
            .find(`.${managedClasses.formItemDictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual("foobar");
    });
    test("should remove a property if the remove trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDictionary
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
            .find(`.${managedClasses.formItemDictionary_itemControlRemoveTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0]).toEqual("a");
        expect(onChangeCallback.mock.calls[0][1]).toEqual(void 0);
    });
    test("should update the property key if the property key input is updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDictionary
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
            .find(`.${managedClasses.formItemDictionary_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][1]).toEqual({ b: "bar", c: "foo" });
    });
    test("should retain the location of the property keys in the object if they are updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDictionary
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
            .find(`.${managedClasses.formItemDictionary_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(Object.keys(onChangeCallback.mock.calls[0][1])).toEqual(["c", "b"]);
    });
    test("should render a control based on the schema type", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <FormItemDictionary
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

        const formControls: any = rendered.find("FormItemTextarea");

        expect(formControls).toHaveLength(2);
    });
});
