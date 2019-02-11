import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import FormControl, { FormControlProps } from "./form-control";

import * as numberFieldSchema from "../../app/configs/number-field/number-field.schema.json";
import * as textareaSchema from "../../app/configs/textarea/textarea.schema.json";
import * as checkboxSchema from "../../app/configs/checkbox/checkbox.schema.json";
import * as objectSchema from "../../app/configs/objects/objects.schema.json";
import * as arraySchema from "../../app/configs/arrays/arrays.schema.json";
import * as childrenSchema from "../../app/configs/children/children.schema.json";
import * as oneOfSchema from "../../app/configs/one-of/one-of.schema.json";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formControlProps: FormControlProps = {
    index: 0,
    propertyName: "",
    label: "Label",
    schema: {},
    data: {},
    required: false,
    untitled: "",
    schemaLocation: "",
    dataLocation: "",
    childOptions: [],
    onUpdateActiveSection: null,
    onChange: null,
};

describe("FormControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<FormControl {...formControlProps} />);
        }).not.toThrow();
    });
    test("should render a number field when a number type is available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={numberFieldSchema.properties.quantity}
                schemaLocation={"properties.quantity"}
                dataLocation={"quantity"}
                propertyName={"quantity"}
                data={30}
            />
        );

        expect(rendered.find("FormItemNumberField")).toHaveLength(1);
    });
    test("should render a textarea when a string type is available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={textareaSchema.properties.text}
                schemaLocation={"properties.text"}
                dataLocation={"text"}
                propertyName={"text"}
                data={"Foo"}
            />
        );

        expect(rendered.find("FormItemTextarea")).toHaveLength(1);
    });
    test("should render a checkbox when a boolean type is available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={checkboxSchema.properties.toggle}
                schemaLocation={"properties.toggle"}
                dataLocation={"toggle"}
                propertyName={"toggle"}
                data={true}
            />
        );

        expect(rendered.find("FormItemCheckbox")).toHaveLength(1);
    });
    test("should render a link when an object type is available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={objectSchema.properties.objectNoRequired}
                schemaLocation={"properties.objectNoRequired"}
                dataLocation={"objectNoRequired"}
                propertyName={"objectNoRequired"}
                data={{}}
            />
        );

        expect(rendered.find("FormItemSectionLink")).toHaveLength(1);
    });
    test("should render the array UI when an array type is available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={arraySchema.properties.strings}
                schemaLocation={"properties.strings"}
                dataLocation={"strings"}
                propertyName={"strings"}
                data={[]}
            />
        );

        expect(rendered.find("FormItemArray")).toHaveLength(1);
    });
    test("should render the children UI when a children type is available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={childrenSchema.reactProperties.children}
                schemaLocation={"reactProperties.children"}
                dataLocation={"children"}
                propertyName={"children"}
                data={[]}
            />
        );

        expect(rendered.find("FormItemChildren")).toHaveLength(1);
    });
    test("should render a select when enums are available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={textareaSchema.properties.tag}
                schemaLocation={"properties.tag"}
                dataLocation={"tag"}
                propertyName={"tag"}
                data={"span"}
            />
        );

        expect(rendered.find("FormItemSelect")).toHaveLength(1);
    });
    test("should render a oneOf/anyOf select when the keywords are available", () => {
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={oneOfSchema}
                schemaLocation={""}
                dataLocation={""}
                propertyName={""}
                data={{}}
            />
        );

        expect(rendered.find("FormOneOfAnyOf")).toHaveLength(1);
    });
    test("should handle the onChange of a oneOf/anyOf select", () => {
        const callback: any = jest.fn();
        const rendered: any = mount(
            <FormControl
                {...formControlProps}
                schema={oneOfSchema}
                schemaLocation={""}
                dataLocation={""}
                propertyName={""}
                data={{}}
                onChange={callback}
            />
        );

        rendered.find("select").simulate("change", { target: { value: "1" } });

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual("");
        expect(typeof callback.mock.calls[0][1].number).toEqual("number");
    });
});
