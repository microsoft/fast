import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import StyledFormSectionValidation, {
    FormSectionValidation,
} from "./form-section-validation";
import {
    FormSectionValidationClassNameContract,
    FormSectionValidationProps,
} from "./form-section-validation.props";
import { ErrorObject } from "ajv";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formSectionValidationProps: FormSectionValidationProps = {
    invalidMessage: "",
    dataLocation: "",
    validationErrors: [],
};

const managedClasses: FormSectionValidationClassNameContract = {
    formSectionValidation: "formSectionValidation",
    formSectionValidation_expandTrigger: "formSectionValidation_expandTrigger",
    formSectionValidation_expandTrigger__active:
        "formSectionValidation_expandTrigger__active",
    formSectionValidation_controlRegion: "formSectionValidation_controlRegion",
    formSectionValidation_message: "formSectionValidation_message",
    formSectionValidation_errorList: "formSectionValidation_errorList",
    formSectionValidation_errorListItem: "formSectionValidation_errorListItem",
};

const validationErrors: ErrorObject[] = [
    {
        keyword: "",
        params: {},
        dataPath: "",
        schemaPath: "",
        message: "bar",
    },
    {
        keyword: "",
        params: {},
        dataPath: "",
        schemaPath: "",
        message: "bat",
    },
];

describe("FormSectionValidation", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<StyledFormSectionValidation {...formSectionValidationProps} />);
        }).not.toThrow();
    });
    test("should show a top level message denoting that the object is invalid", () => {
        const rendered: any = mount(
            <FormSectionValidation
                {...formSectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formSectionValidation}`).contains("foo")
        ).toEqual(true);
    });
    test("should not contain an expand button when there are no validationErrors", () => {
        const rendered: any = mount(
            <FormSectionValidation
                {...formSectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formSectionValidation_expandTrigger}`)
        ).toHaveLength(0);
    });
    test("should contain an expand button when validationErrors are passed", () => {
        const rendered: any = mount(
            <FormSectionValidation
                {...formSectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formSectionValidation_expandTrigger}`)
        ).toHaveLength(1);
    });
    test("should not show validationError messages initially", () => {
        const rendered: any = mount(
            <FormSectionValidation
                {...formSectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );

        expect(
            rendered.find(`.${managedClasses.formSectionValidation_errorListItem}`)
        ).toHaveLength(0);
    });
    test("should show all validationError messages when the expand button is pressed", () => {
        const rendered: any = mount(
            <FormSectionValidation
                {...formSectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );
        const expandTrigger: any = rendered.find(
            `.${managedClasses.formSectionValidation_expandTrigger}`
        );
        expandTrigger.simulate("click");

        expect(
            rendered.find(`.${managedClasses.formSectionValidation_errorListItem}`)
        ).toHaveLength(2);
    });
    test("should hide all validationError messages when the expand button is collapsed", () => {
        const rendered: any = mount(
            <FormSectionValidation
                {...formSectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );
        const expandTrigger: any = rendered.find(
            `.${managedClasses.formSectionValidation_expandTrigger}`
        );
        expandTrigger.simulate("click");
        expandTrigger.simulate("click");

        expect(
            rendered.find(`.${managedClasses.formSectionValidation_errorListItem}`)
        ).toHaveLength(0);
    });
});
