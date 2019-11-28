import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import StyledSectionControl, { SectionControl } from "./control.section";
import {
    SectionControlClassNameContract,
    SectionControlProps,
} from "./control.section.props";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { controls } from "./utilities/control-switch.spec";
import ajv, { Ajv, ValidateFunction } from "ajv";
import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    ChildrenControl,
    ControlType,
    DisplayControl,
    NumberFieldControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "../index";

const TestSectionControl: any = (
        props: React.PropsWithChildren<SectionControlProps>
    ): React.ReactElement => {
        return (
            <DndProvider backend={HTML5Backend}>
                <StyledSectionControl {...props} />
            </DndProvider>
        );
    };

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const sectionControlProps: SectionControlProps = {
    type: ControlType.section,
    dataLocation: "",
    schemaLocation: "",
    controls,
    childOptions: [],
    schema: {},
    disabled: false,
    value: "",
    untitled: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
    validationErrors: null,
    default: {},
    controlComponents: {
        [ControlType.array]: ArrayControl,
        [ControlType.button]: ButtonControl,
        [ControlType.checkbox]: CheckboxControl,
        [ControlType.children]: ChildrenControl,
        [ControlType.display]: DisplayControl,
        [ControlType.numberField]: NumberFieldControl,
        [ControlType.sectionLink]: SectionLinkControl,
        [ControlType.section]: SectionControl,
        [ControlType.select]: SelectControl,
        [ControlType.textarea]: TextareaControl,
    },
    elementRef: null,
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    required: false,
};

const managedClasses: SectionControlClassNameContract = {
    sectionControl: "sectionControl",
    sectionControl__disabled: "sectionControl__disabeld",
};

describe("SectionControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<TestSectionControl {...sectionControlProps} />);
        }).not.toThrow();
    });
    test("should contain a root level fieldset element", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find("fieldset").prop("className")).toEqual(
            managedClasses.sectionControl
        );
    });
    test("should not be disabled if the disabled prop has not been passed", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionControl}`).prop("disabled")
        ).toEqual(undefined);
    });
    test("should not add a disabled class if the disabled prop is not passed", () => {
        const schema: any = {
            type: "object",
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.sectionControl__disabled}`)).toHaveLength(
            0
        );
    });
    test("should not be disabled if the disabled prop is false", () => {
        const schema: any = {
            type: "object",
            disabled: false,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionControl}`).prop("disabled")
        ).toEqual(false);
    });
    test("should not add the disabled class if the disabled prop is false", () => {
        const schema: any = {
            type: "object",
            disabled: false,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.sectionControl__disabled}`)).toHaveLength(
            0
        );
    });
    test("should be disabled if the disabled prop is true", () => {
        const schema: any = {
            type: "object",
            disabled: true,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(
            rendered.find(`.${managedClasses.sectionControl}`).prop("disabled")
        ).toEqual(true);
    });
    test("should add a disabled class if the disabled prop is true", () => {
        const schema: any = {
            type: "object",
            disabled: true,
        };
        const rendered: any = mount(
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find(`.${managedClasses.sectionControl__disabled}`)).toHaveLength(
            1
        );
    });
    test("should pass the disabled prop to the ControlSwitch", () => {
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
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
            />
        );

        expect(rendered.find("ControlSwitch").prop("disabled")).toEqual(true);
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
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
                validationErrors={validationErrors}
            />
        );

        expect(rendered.find("SectionValidation")).toHaveLength(1);
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
            <SectionControl
                {...sectionControlProps}
                managedClasses={managedClasses}
                schema={schema}
                value={{}}
                validationErrors={validationErrors}
            />
        );

        expect(rendered.find("SectionValidation")).toHaveLength(0);
    });
});
