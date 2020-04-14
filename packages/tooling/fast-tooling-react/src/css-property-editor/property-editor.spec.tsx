import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper, shallow } from "enzyme";
import { CSSPropertyEditor } from "./";
import { CSSPropertyEditorClassNameContract } from "./property-editor.props";
import { keyCodeEnter } from "@microsoft/fast-web-utilities";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSPropertyEditor", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<CSSPropertyEditor />);
        }).not.toThrow();
    });

    test("should show no inputs by default", () => {
        const rendered: any = mount(<CSSPropertyEditor />);

        expect(rendered.find("input")).toHaveLength(0);
        rendered.first().simulate("focus");
        expect(rendered.find("input")).toHaveLength(2);
    });

    test("should fire the onChange callback on loss of focus and there is data available", () => {
        const callback: any = jest.fn();
        const key: string = "padding";
        const value: string = "10px";
        const rendered: any = mount(<CSSPropertyEditor onChange={callback} />);

        expect(callback).toBeCalledTimes(0);
        rendered.first().simulate("focus");
        const inputs: any = rendered.find("input");
        inputs.at(0).simulate("change", { target: { value: key } });
        inputs.at(1).simulate("change", { target: { value } });
        expect(callback).toBeCalledTimes(1);
        inputs.at(0).simulate("blur");
        expect(callback).toBeCalledTimes(2);
        expect(callback.mock.calls[1][0]).toEqual({ [key]: value });
    });

    // Test is incompatible with Jest 25.x, refer to issue #2880
    xtest("should focus the key input when the containing div has been clicked", () => {
        const rendered: any = mount(<CSSPropertyEditor />);

        rendered.find("div").at(0).simulate("click");

        expect(rendered.find("input").at(0).getDOMNode()).toEqual(document.activeElement);
    });

    test("should show data key/value pairs as inputs using the key and value as input values", () => {
        const data: { [key: string]: string } = {
            padding: "10px",
            margin: "30px",
        };
        const rendered: any = mount(<CSSPropertyEditor data={data} />);
        const inputs: any = rendered.find("input");
        const dataKeys: string[] = Object.keys(data);

        expect(inputs).toHaveLength(4);
        expect(inputs.at(0).prop("value")).toEqual(dataKeys[0]);
        expect(inputs.at(1).prop("value")).toEqual(data[dataKeys[0]]);
        expect(inputs.at(2).prop("value")).toEqual(dataKeys[1]);
        expect(inputs.at(3).prop("value")).toEqual(data[dataKeys[1]]);
    });

    test("should allow updates to key/value pairs in the same order they appear in the object", () => {
        const callback: any = jest.fn();
        const data: { [key: string]: string } = {
            padding: "10px",
            margin: "30px",
        };
        const rendered: any = mount(
            <CSSPropertyEditor data={data} onChange={callback} />
        );
        const inputs: any = rendered.find("input");
        const dataKeys: string[] = Object.keys(data);

        inputs.at(0).simulate("focus");
        inputs.at(0).simulate("change", { target: { value: "padding-top" } });
        inputs.at(0).simulate("blur");

        const updatedDataKeys: string[] = Object.keys(callback.mock.calls[0][0]);

        expect(dataKeys[0]).not.toEqual(updatedDataKeys[0]);
        expect(dataKeys[1]).toEqual(updatedDataKeys[1]);
    });

    test("should convert a camelCased property key into a dash separated key in the input value", () => {
        const callback: any = jest.fn();
        const data: { [key: string]: string } = {
            paddingTop: "10px",
        };
        const rendered: any = mount(
            <CSSPropertyEditor data={data} onChange={callback} />
        );
        const inputs: any = rendered.find("input");

        expect(inputs.at(0).prop("value")).toEqual("padding-top");
    });

    test("should convert a dash separated key that ends in a dash into a camelCased key when the onChange callback is fired", () => {
        const callback: any = jest.fn();
        const data: { [key: string]: string } = {
            margin: "10px",
        };
        const rendered: any = mount(
            <CSSPropertyEditor data={data} onChange={callback} />
        );
        const inputs: any = rendered.find("input");

        inputs.at(0).simulate("focus");
        inputs.at(0).simulate("change", { target: { value: "padding-" } });
        inputs.at(0).simulate("blur");

        const updatedDataKeys: string[] = Object.keys(callback.mock.calls[0][0]);

        expect(updatedDataKeys[0]).toEqual("padding");
    });

    test("should convert a dash separated key into a camelCased key when the onChange callback is fired", () => {
        const callback: any = jest.fn();
        const data: { [key: string]: string } = {
            padding: "10px",
        };
        const rendered: any = mount(
            <CSSPropertyEditor data={data} onChange={callback} />
        );
        const inputs: any = rendered.find("input");

        inputs.at(0).simulate("focus");
        inputs.at(0).simulate("change", { target: { value: "padding-top" } });
        inputs.at(0).simulate("blur");

        const updatedDataKeys: string[] = Object.keys(callback.mock.calls[0][0]);

        expect(updatedDataKeys[0]).toEqual("paddingTop");
    });

    test("should not throw an error of a property value is undefined", () => {
        const data: { [key: string]: string } = {
            padding: void 0,
        };
        expect(() => {
            shallow(<CSSPropertyEditor data={data} />);
        }).not.toThrow();
    });

    test("should remove the active row with empty key on input blur", () => {
        const data: { [key: string]: string } = {
            padding: "10px",
            margin: "30px",
        };
        const emptyKey: string = "";
        const rendered: any = mount(<CSSPropertyEditor data={data} />);
        let inputs: any = rendered.find("input");
        expect(inputs).toHaveLength(4);
        inputs.at(0).simulate("focus");
        inputs.at(0).simulate("change", { target: { value: emptyKey } });
        inputs.at(0).simulate("blur");

        inputs = rendered.find("input");
        expect(inputs).toHaveLength(2);
    });

    test("should fire the onChange callback to add new key values when the enter key is pressed", () => {
        const data: { [key: string]: string } = {
            padding: "10px",
            margin: "30px",
        };
        const callback: any = jest.fn();
        const newKey: string = "padding-top";

        const rendered: any = mount(
            <CSSPropertyEditor data={data} onChange={callback} />
        );

        const inputs: any = rendered.find("input");
        expect(inputs).toHaveLength(4);
        inputs.at(0).simulate("focus");
        inputs.at(0).simulate("change", { target: { value: newKey } });
        inputs.at(0).simulate("keydown", { keyCode: keyCodeEnter });

        const updatedDataKeys: string[] = Object.keys(callback.mock.calls[0][0]);
        expect(updatedDataKeys[0]).toEqual("paddingTop");
    });
});
