import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { CSSPropertyEditor } from "./";
import { KeyCodes } from "@microsoft/fast-web-utilities";

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
    test("should show two inputs", () => {
        const rendered: any = mount(<CSSPropertyEditor />);

        expect(rendered.find("input")).toHaveLength(2);
    });
    test("should fire the onChange callback when the value input has been tabbed away from and there is data available", () => {
        const callback: any = jest.fn();
        const key: string = "padding";
        const value: string = "10px";
        const rendered: any = mount(<CSSPropertyEditor onChange={callback} />);

        expect(callback).toBeCalledTimes(0);

        const inputs: any = rendered.find("input");
        inputs.at(0).simulate("change", { target: { value: key } });
        inputs.at(1).simulate("change", { target: { value } });
        inputs.at(1).simulate("keydown", { keyCode: KeyCodes.tab });

        expect(callback).toBeCalledTimes(1);
        expect(callback.mock.calls[0][0]).toEqual({ [key]: value });
    });
    test("should focus the key input when the containing div has been clicked", () => {
        const rendered: any = mount(<CSSPropertyEditor />);

        rendered
            .find("div")
            .at(0)
            .simulate("click");

        expect(
            rendered
                .find("input")
                .at(0)
                .getDOMNode()
        ).toEqual(document.activeElement);
    });
    test("should focus the key input when the value input has been tabbed and both the key and value contain non-empty strings", () => {
        const key: string = "padding";
        const value: string = "10px";
        const rendered: any = mount(<CSSPropertyEditor />);

        const inputs: any = rendered.find("input");
        inputs.at(0).simulate("change", { target: { value: key } });
        inputs.at(1).simulate("change", { target: { value } });
        inputs.at(1).simulate("keydown", { keyCode: KeyCodes.tab });

        expect(
            rendered
                .find("input")
                .at(0)
                .getDOMNode()
        ).toEqual(document.activeElement);
    });
    test("should show data key/value pairs as inputs using the key and value as input values", () => {
        const data: { [key: string]: string } = {
            padding: "10px",
            margin: "30px",
        };
        const rendered: any = mount(<CSSPropertyEditor data={data} />);
        const inputs: any = rendered.find("input");
        const dataKeys: string[] = Object.keys(data);

        expect(inputs).toHaveLength(6);
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

        inputs.at(0).simulate("change", { target: { value: "padding-top" } });

        const updatedDataKeys: string[] = Object.keys(callback.mock.calls[0][0]);

        expect(dataKeys[0]).not.toEqual(updatedDataKeys[0]);
        expect(dataKeys[1]).toEqual(updatedDataKeys[1]);
    });
    test("should contain a ':' and a ';'", () => {
        const rendered: any = mount(<CSSPropertyEditor />);

        expect(rendered.text()).toEqual(":;");
    });
});
