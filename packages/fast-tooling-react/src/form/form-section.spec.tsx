import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import StyledFormSection, { FormSection } from "./form-section";
import { FormSectionClassNameContract, FormSectionProps } from "./form-section.props";
import { ContextComponent, DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const TestFormSection: typeof StyledFormSection & ContextComponent<any> = DragDropContext(
    HTML5Backend
)(StyledFormSection);
import { controls } from "./form-control-switch.spec";
import ajv, { Ajv, ValidateFunction } from "ajv";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formSectionProps: FormSectionProps = {
    dataLocation: "",
    schemaLocation: "",
    controls,
    childOptions: [],
    schema: {},
    disabled: false,
    data: "",
    untitled: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    validationErrors: null,
    default: {},
};

const managedClasses: FormSectionClassNameContract = {
    formSection: "formSection",
    formSection__disabled: "formSection__disabeld",
};

describe("FormSection", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<TestFormSection {...formSectionProps} />);
        }).not.toThrow();
    });
    test("should contain a root level fieldset element", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find("fieldset").prop("className")).toEqual(
            managedClasses.formSection
        );
    });
    test("should not be disabled if the disabled prop has not been passed", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.formSection}`).prop("disabled")).toEqual(
            undefined
        );
    });
    test("should not add a disabled class if the disabled prop is not passed", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.formSection__disabled}`)).toHaveLength(0);
    });
    test("should not be disabled if the disabled prop is false", () => {
        const schema: any = {
            type: "object",
            disabled: false,
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.formSection}`).prop("disabled")).toEqual(
            false
        );
    });
    test("should not add the disabled class if the disabled prop is false", () => {
        const schema: any = {
            type: "object",
            disabled: false,
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.formSection__disabled}`)).toHaveLength(0);
    });
    test("should be disabled if the disabled prop is true", () => {
        const schema: any = {
            type: "object",
            disabled: true,
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.formSection}`).prop("disabled")).toEqual(
            true
        );
    });
    test("should add a disabled class if the disabled prop is true", () => {
        const schema: any = {
            type: "object",
            disabled: true,
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.formSection__disabled}`)).toHaveLength(1);
    });
    test("should pass the disabled prop to the FormControlSwitch", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
            disabled: true,
        };
        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find("FormControlSwitch").prop("disabled")).toEqual(true);
    });
    test("should show an invalid message if validation errors have been passed", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
            required: ["foo"],
        };
        const validator: Ajv = new ajv({ schemaId: "auto", allErrors: true });
        const validate: ValidateFunction = validator.compile(schema);
        const isValid: boolean | PromiseLike<any> = validate({});
        let validationErrors: any = [];

        if (!!!isValid) {
            validationErrors = validate.errors;
        }

        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
                validationErrors={validationErrors}
            />
        );

        expect(rendered.find("FormSectionValidation")).toHaveLength(1);
    });
    test("should not show an invalid message if no validation errors have been passed", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
        };
        const validator: Ajv = new ajv({ schemaId: "auto", allErrors: true });
        const validate: ValidateFunction = validator.compile(schema);
        const isValid: boolean | PromiseLike<any> = validate({});
        let validationErrors: any = [];

        if (!!!isValid) {
            validationErrors = validate.errors;
        }

        const rendered: any = mount(
            <FormSection
                {...formSectionProps}
                managedClasses={managedClasses}
                schema={schema}
                data={{}}
                validationErrors={validationErrors}
            />
        );

        expect(rendered.find("FormSectionValidation")).toHaveLength(0);
    });
});
