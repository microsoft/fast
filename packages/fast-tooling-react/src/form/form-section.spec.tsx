import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import FormSection from "./form-section";
import { FormSectionProps } from "./form-section.props";
import { ContextComponent, DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const TestFormSection: typeof FormSection & ContextComponent<any> = DragDropContext(
    HTML5Backend
)(FormSection);

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formSectionProps: FormSectionProps = {
    dataLocation: "",
    schemaLocation: "",
    childOptions: [],
    schema: {},
    data: "",
    untitled: "",
    onChange: jest.fn(),
    onUpdateActiveSection: jest.fn(),
    validationErrors: null,
    default: {},
};

describe("FormSection", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<TestFormSection {...formSectionProps} />);
        }).not.toThrow();
    });
});
