import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import FormControl, { FormControlProps } from "./form-control";

import numberFieldSchema from "../../__tests__/schemas/number-field.schema.json";
import textareaSchema from "../../__tests__/schemas/textarea.schema.json";
import checkboxSchema from "../../__tests__/schemas/checkbox.schema.json";
import objectSchema from "../../__tests__/schemas/objects.schema.json";
import arraySchema from "../../__tests__/schemas/arrays.schema.json";
import childrenSchema from "../../__tests__/schemas/children.schema.json";
import oneOfSchema from "../../__tests__/schemas/one-of.schema.json";

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
    invalidMessage: "",
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
    test("should restrict the child options if ids have been passed", () => {
        const renderedWithDefault: any = mount(
            <FormControl
                {...formControlProps}
                childOptions={[
                    {
                        component: null,
                        schema: objectSchema,
                    },
                    {
                        component: null,
                        schema: arraySchema,
                    },
                    {
                        component: null,
                        schema: childrenSchema,
                    },
                ]}
                schema={childrenSchema.reactProperties.children}
                schemaLocation={"reactProperties.children"}
                dataLocation={"children"}
                propertyName={"children"}
                data={[]}
            />
        );

        const renderedWithoutDefaultAndIds: any = mount(
            <FormControl
                {...formControlProps}
                childOptions={[
                    {
                        component: null,
                        schema: objectSchema,
                    },
                    {
                        component: null,
                        schema: arraySchema,
                    },
                    {
                        component: null,
                        schema: childrenSchema,
                    },
                ]}
                schema={
                    childrenSchema.reactProperties.restrictedChildrenWithReactDefaults
                }
                schemaLocation={"reactProperties.restrictedChildrenWithReactDefaults"}
                dataLocation={"restrictedChildrenWithReactDefaults"}
                propertyName={"restrictedChildrenWithReactDefaults"}
                data={[]}
            />
        );

        const renderedWithDefaultAndIds: any = mount(
            <FormControl
                {...formControlProps}
                childOptions={[
                    {
                        component: null,
                        schema: objectSchema,
                    },
                    {
                        component: null,
                        schema: arraySchema,
                    },
                    {
                        component: null,
                        schema: childrenSchema,
                    },
                ]}
                schema={childrenSchema.reactProperties.restrictedWithChildren}
                schemaLocation={"reactProperties.restrictedWithChildren"}
                dataLocation={"restrictedWithChildren"}
                propertyName={"restrictedWithChildren"}
                data={[]}
            />
        );

        expect(renderedWithDefault.find("li")).toHaveLength(4);
        expect(renderedWithoutDefaultAndIds.find("li")).toHaveLength(1);
        expect(renderedWithDefaultAndIds.find("li")).toHaveLength(3);
    });
});
