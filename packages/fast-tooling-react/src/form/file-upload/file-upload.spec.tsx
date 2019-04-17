import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import FileUpload from "./index";
import { CustomFormItemComponent } from "../form/form-item.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const fileUploadProps: CustomFormItemComponent = {
    options: [],
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
    invalidMessage: "",
    schema: {},
};

describe("FileUpload", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<FileUpload {...fileUploadProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML input element", () => {
        const rendered: any = mount(<FileUpload {...fileUploadProps} />);

        expect(rendered.find("input")).toHaveLength(1);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(<FileUpload {...fileUploadProps} />);

        expect(rendered.find("label")).toHaveLength(2);
    });
    test("should have an `id` attribute on the HTML input element and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<FileUpload {...fileUploadProps} />);
        const labels: any = rendered.find("label");
        const input: any = rendered.find("input");

        expect(labels.at(0).prop("htmlFor")).toMatch(input.prop("id"));
        expect(labels.at(1).prop("htmlFor")).toMatch(input.prop("id"));
    });
});
