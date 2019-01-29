import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import ListboxItem, { ListboxItemUnhandledProps } from "./listbox-item";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("listbox item", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((ListboxItem as any).name).toBe(ListboxItem.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ListboxItem />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ListboxItemUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<ListboxItem {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });
});
