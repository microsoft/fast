import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import { controls } from "./control-switch.spec";
import { Dictionary } from "./dictionary";
import { DictionaryProps } from "./dictionary.props";
import { DictionaryClassNameContract } from "./dictionary.style";
import { ControlType } from "../../templates";
import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    DisplayControl,
    NumberFieldControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "../../index";
import defaultStrings from "../../form.strings";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: DictionaryClassNameContract = {
    dictionary: "dictionary-class",
    dictionary_controlAddTrigger: "dictionary_controlAddTrigger-class",
    dictionary_itemControlInput: "dictionary_itemControlInput-class",
    dictionary_itemControlLabel: "dictionary_itemControlLabel-class",
    dictionary_itemControlRemoveTrigger: "dictionary_itemControlRemoveTrigger-class",
};

const dictionaryProps: DictionaryProps = {
    index: 1,
    type: ControlType.section,
    schemaDictionary: {},
    controls,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    dataDictionary: [
        {
            "": {
                schemaId: "",
                data: {},
            },
        },
        "",
    ],
    navigation: {},
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
    validationErrors: undefined,
    controlComponents: {
        [ControlType.array]: ArrayControl,
        [ControlType.button]: ButtonControl,
        [ControlType.checkbox]: CheckboxControl,
        [ControlType.display]: DisplayControl,
        [ControlType.numberField]: NumberFieldControl,
        [ControlType.sectionLink]: SectionLinkControl,
        [ControlType.select]: SelectControl,
        [ControlType.textarea]: TextareaControl,
    },
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
    categories: {},
};

describe("Dictionary", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<Dictionary {...dictionaryProps} managedClasses={managedClasses} />);
        }).not.toThrow();
    });
    test("should add a property if the add trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            .find(`.${managedClasses.dictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("example text");
    });
    test("should add a property using a default if a default has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            .find(`.${managedClasses.dictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("foobar");
    });
    test("should add a property using an example if an examples array has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            .find(`.${managedClasses.dictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("foobar");
    });
    test("should add a property using generated data if an empty examples array has been provided", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            .find(`.${managedClasses.dictionary_controlAddTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0].value).toEqual("example text");
    });
    test("should remove a property if the remove trigger is clicked", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            .find(`.${managedClasses.dictionary_itemControlRemoveTrigger}`)
            .at(0)
            .simulate("click");

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0]).toEqual({
            dataLocation: "a",
            dictionaryId: "",
            value: void 0,
        });
    });
    test("should update the property key if the property key input is updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            .find(`.${managedClasses.dictionary_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(onChangeCallback.mock.calls[0][0]).toEqual({
            dataLocation: "",
            dictionaryId: "",
            value: { b: "bar", c: "foo" },
        });
    });
    test("should retain the location of the property keys in the object if they are updated", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            .find(`.${managedClasses.dictionary_itemControlInput}`)
            .at(0)
            .simulate("blur", { target: { value: "c" } });

        expect(onChangeCallback).toHaveBeenCalled();
        expect(Object.keys(onChangeCallback.mock.calls[0][0].value)).toEqual(["c", "b"]);
    });
    test("should render a control based on the schema type", () => {
        const onChangeCallback: any = jest.fn();
        const rendered: any = mount(
            <Dictionary
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
            <Dictionary
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
            <Dictionary
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
            `.${managedClasses.dictionary_itemControlInput}`
        );
        const formControlSwitch: any = rendered.find(
            `.${managedClasses.dictionary_controlRegion}`
        );

        expect(propertyKeyInputs).toHaveLength(2);
        expect(formControlSwitch).toHaveLength(0);
    });
    test("should show invalid message when the invalid message has been passed", () => {
        const schema: any = {
            type: "object",
            additionalProperties: {
                type: "number",
            },
        };
        const data: any = {
            randoma: "foo",
            b: "bar",
        };
        const rendered: any = render(
            <Dictionary
                {...dictionaryProps}
                managedClasses={managedClasses}
                data={data}
                schema={schema}
                validationErrors={[
                    {
                        dataLocation: "randoma",
                        invalidMessage: "should be number",
                    },
                    {
                        dataLocation: "b",
                        invalidMessage: "should be number",
                    },
                ]}
                additionalProperties={{
                    type: "number",
                }}
                displayValidationInline={true}
            />
        );

        expect(rendered.html()).toContain("should be number");
    });
});
