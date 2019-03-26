import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import FormSection from "./form-section";
import { FormSectionProps } from "./form-section.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formSectionProps: FormSectionProps = {
    dataLocation: "",
    schemaLocation: "",
    dataCache: {},
    childOptions: [],
    schema: {},
    data: "",
    untitled: "",
    onChange: jest.fn(),
    onUpdateActiveSection: jest.fn(),
    validationErrors: null,
};

describe("FormSection", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<FormSection {...formSectionProps} />);
        }).not.toThrow();
    });
});
