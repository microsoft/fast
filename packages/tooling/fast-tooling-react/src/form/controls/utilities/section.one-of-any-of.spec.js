import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import SectionOneOfAnyOf from "./section.one-of-any-of";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
const sectionOneOfAnyOfProps = {
    label: "Label",
    activeIndex: 0,
    onUpdate: null,
};
describe("SectionOneOfAnyOf", () => {
    test("should not throw", () => {
        expect(() => {
            mount(<SectionOneOfAnyOf {...sectionOneOfAnyOfProps} />);
        }).not.toThrow();
    });
    test("should render the label in a label HTML element", () => {
        const rendered = mount(<SectionOneOfAnyOf {...sectionOneOfAnyOfProps} />);
        const label = rendered.find("label");
        expect(label).toHaveLength(1);
        expect(label.text()).toEqual("Label");
    });
    test("should trigger the onUpdate callback if the select onChange has been called", () => {
        const callback = jest.fn();
        const rendered = mount(
            <SectionOneOfAnyOf {...sectionOneOfAnyOfProps} onUpdate={callback} />
        );
        const select = rendered.find("select");
        select.simulate("change", { target: { value: "50" } });
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0]).toEqual(50);
    });
    test("should show an unselected option if the contents are undefined", () => {
        const callback = jest.fn();
        const rendered = mount(
            <SectionOneOfAnyOf
                {...sectionOneOfAnyOfProps}
                activeIndex={-1}
                onUpdate={callback}
            />
        );
        const select = rendered.find("select");
        expect(select.value).toEqual(undefined);
    });
});
