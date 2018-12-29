import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import AlignHorizontal from "./form-item.align-horizontal";
import { FormItemComponentMappingToProperyNamesProps, mappingName } from "./form-item";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const alignHorizontalProps: FormItemComponentMappingToProperyNamesProps = {
    key: "1",
    name: mappingName.alignHorizontal,
    options: ["left", "center", "right"],
    index: 1,
    dataLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
};

describe("AlignHorizontal", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<AlignHorizontal {...alignHorizontalProps} />);
        }).not.toThrow();
    });
    test("should generate HTML input elements", () => {
        const rendered: any = mount(<AlignHorizontal {...alignHorizontalProps} />);

        expect(rendered.find("input")).toHaveLength(4);
    });
    test("should generate an HTML label element", () => {
        const rendered: any = mount(<AlignHorizontal {...alignHorizontalProps} />);

        expect(rendered.find("label")).toHaveLength(1);
    });
    test("should have an `id` attribute on the HTML input elements and a corresponding `for` attribute on the HTML label element", () => {
        const rendered: any = mount(<AlignHorizontal {...alignHorizontalProps} />);
        const label: ShallowWrapper = rendered.find("label");
        const inputs: ShallowWrapper = rendered.find("input");

        expect(label.prop("htmlFor")).toMatch(inputs.at(0).prop("id"));
        expect(label.prop("htmlFor")).toMatch(inputs.at(1).prop("id"));
        expect(label.prop("htmlFor")).toMatch(inputs.at(2).prop("id"));
    });
    test("should fire an `onChange` callback when an input has been changed", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <AlignHorizontal {...alignHorizontalProps} onChange={handleChange} />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual("left");
    });
    test("should be disabled if disabled props is passed", () => {
        const rendered: any = mount(
            <AlignHorizontal {...alignHorizontalProps} disabled={true} />
        );
        const inputs: ShallowWrapper = rendered.find("input");

        expect(inputs).toHaveLength(4);
        expect(inputs.at(0).prop("disabled")).toBeTruthy();
        expect(inputs.at(1).prop("disabled")).toBeTruthy();
        expect(inputs.at(2).prop("disabled")).toBeTruthy();
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <AlignHorizontal
                {...alignHorizontalProps}
                data={"left"}
                onChange={handleChange}
            />
        );

        rendered
            .find("input")
            .at(3)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: string = "left";
        const rendered: any = mount(
            <AlignHorizontal
                {...alignHorizontalProps}
                data={data}
                onChange={handleChange}
            />
        );

        rendered
            .find("input")
            .at(3)
            .simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered
            .find("input")
            .at(3)
            .simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
});
