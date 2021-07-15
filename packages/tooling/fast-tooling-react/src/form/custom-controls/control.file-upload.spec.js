import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { FileUploadControl } from "./control.file-upload";
import { FileUploadControl as StyledFileUploadControl } from "./control.file-upload";
import { ControlType } from "../templates";
import defaultStrings from "../form.strings";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const fileUploadControlProps = {
    type: ControlType.textarea,
    dataLocation: "",
    navigationConfigId: "",
    dictionaryId: "",
    navigation: {},
    disabled: false,
    elementRef: null,
    value: "",
    schema: {},
    onChange: jest.fn(),
    reportValidity: jest.fn(),
    updateValidity: jest.fn(),
    validationErrors: [],
    required: false,
    messageSystem: void 0,
    strings: defaultStrings,
    messageSystemOptions: null,
};
describe("FileUploadControl", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<StyledFileUploadControl {...fileUploadControlProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered = mount(<FileUploadControl {...fileUploadControlProps} />);
        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should generate an HTML label element", () => {
        const rendered = mount(<FileUploadControl {...fileUploadControlProps} />);
        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered = mount(<FileUploadControl {...fileUploadControlProps} />);
        const label = rendered.find("label");
        const input = rendered.find("input");
        expect(label.prop("htmlFor")).toMatch(input.prop("id"));
    });
});
