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
    data: "",
    untitled: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    validationErrors: null,
    default: {},
};

const managedClasses: FormSectionClassNameContract = {
    formSection: "formSection",
    formSection_invalidMessage: "formSection_invalidMessage",
};

describe("FormSection", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<TestFormSection {...formSectionProps} />);
        }).not.toThrow();
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

        expect(
            rendered.find(`.${managedClasses.formSection_invalidMessage}`)
        ).toHaveLength(1);
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

        expect(
            rendered.find(`.${managedClasses.formSection_invalidMessage}`)
        ).toHaveLength(0);
    });
});
