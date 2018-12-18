import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import FormItemSectionLink, { FormItemSectionLinkProps } from "./form-item.section-link";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const formItemSectionLinkProps: FormItemSectionLinkProps = {
    key: "1",
    index: 1,
    dataLocation: "",
    schemaLocation: "",
    data: "",
    required: false,
    label: "",
    onChange: jest.fn(),
    onUpdateSection: jest.fn(),
};

describe("NumberField", () => {
    test("should not throw", () => {
        expect(() => {
            shallow(<FormItemSectionLink {...formItemSectionLinkProps} />);
        }).not.toThrow();
    });
    test("should generate an HTML anchor element", () => {
        const rendered: any = mount(
            <FormItemSectionLink {...formItemSectionLinkProps} />
        );

        expect(rendered.find("a")).toHaveLength(1);
    });
    test("should fire an `onSectionUpdate` callback with the anchor is clicked", () => {
        const handleSectionUpdate: any = jest.fn();
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                onUpdateSection={handleSectionUpdate}
            />
        );

        rendered
            .find("a")
            .at(0)
            .simulate("click");

        expect(handleSectionUpdate).toHaveBeenCalled();
        expect(handleSectionUpdate.mock.calls[0][0]).toEqual("");
        expect(handleSectionUpdate.mock.calls[0][1]).toEqual("");

        const handleSectionUpdateWithTestLocations: any = jest.fn();
        const renderedWithTestLocations: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                onUpdateSection={handleSectionUpdateWithTestLocations}
                schemaLocation={"properties.test"}
                dataLocation={"test"}
            />
        );

        renderedWithTestLocations
            .find("a")
            .at(0)
            .simulate("click");

        expect(handleSectionUpdateWithTestLocations).toHaveBeenCalled();
        expect(handleSectionUpdateWithTestLocations.mock.calls[0][0]).toEqual(
            "properties.test"
        );
        expect(handleSectionUpdateWithTestLocations.mock.calls[0][1]).toEqual("test");
    });
    test("should remove the data if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                data={10}
                onChange={handleChange}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1]).toEqual(undefined);
    });
    test("should add the previous data that was removed if the soft remove is triggered", () => {
        const handleChange: any = jest.fn();
        const data: number = 10;
        const rendered: any = mount(
            <FormItemSectionLink
                {...formItemSectionLinkProps}
                data={data}
                onChange={handleChange}
            />
        );

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        rendered.setProps({ data: handleChange.mock.calls[0][1] });

        rendered
            .find("input")
            .at(0)
            .simulate("change");

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][1]).toBe(data);
    });
});
