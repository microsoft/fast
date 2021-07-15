import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import StyledSectionValidation, { SectionValidation } from "./section.validation";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const sectionValidationProps = {
    invalidMessage: "",
    dataLocation: "",
    validationErrors: [],
};
const managedClasses = {
    sectionValidation: "sectionValidation",
    sectionValidation_expandTrigger: "sectionValidation_expandTrigger",
    sectionValidation_expandTrigger__active: "sectionValidation_expandTrigger__active",
    sectionValidation_controlRegion: "sectionValidation_controlRegion",
    sectionValidation_message: "sectionValidation_message",
    sectionValidation_errorList: "sectionValidation_errorList",
    sectionValidation_errorListItem: "sectionValidation_errorListItem",
};
const validationErrors = [
    {
        dataLocation: "",
        invalidMessage: "bar",
    },
    {
        dataLocation: "",
        invalidMessage: "bat",
    },
];
describe("SectionValidation", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<StyledSectionValidation {...sectionValidationProps} />);
        }).not.toThrow();
    });
    test("should show a top level message denoting that the object is invalid", () => {
        const rendered = mount(
            <SectionValidation
                {...sectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
            />
        );
        expect(
            rendered.find(`.${managedClasses.sectionValidation}`).contains("foo")
        ).toEqual(true);
    });
    test("should not contain an expand button when there are no validationErrors", () => {
        const rendered = mount(
            <SectionValidation
                {...sectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
            />
        );
        expect(
            rendered.find(`.${managedClasses.sectionValidation_expandTrigger}`)
        ).toHaveLength(0);
    });
    test("should contain an expand button when validationErrors are passed", () => {
        const rendered = mount(
            <SectionValidation
                {...sectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );
        expect(
            rendered.find(`.${managedClasses.sectionValidation_expandTrigger}`)
        ).toHaveLength(1);
    });
    test("should not show validationError messages initially", () => {
        const rendered = mount(
            <SectionValidation
                {...sectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );
        expect(
            rendered.find(`.${managedClasses.sectionValidation_errorListItem}`)
        ).toHaveLength(0);
    });
    test("should show all validationError messages when the expand button is pressed", () => {
        const rendered = mount(
            <SectionValidation
                {...sectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );
        const expandTrigger = rendered.find(
            `.${managedClasses.sectionValidation_expandTrigger}`
        );
        expandTrigger.simulate("click");
        expect(
            rendered.find(`.${managedClasses.sectionValidation_errorListItem}`)
        ).toHaveLength(2);
    });
    test("should hide all validationError messages when the expand button is collapsed", () => {
        const rendered = mount(
            <SectionValidation
                {...sectionValidationProps}
                managedClasses={managedClasses}
                invalidMessage={"foo"}
                validationErrors={validationErrors}
            />
        );
        const expandTrigger = rendered.find(
            `.${managedClasses.sectionValidation_expandTrigger}`
        );
        expandTrigger.simulate("click");
        expandTrigger.simulate("click");
        expect(
            rendered.find(`.${managedClasses.sectionValidation_errorListItem}`)
        ).toHaveLength(0);
    });
});
