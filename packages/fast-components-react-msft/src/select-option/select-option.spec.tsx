import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTSelectOption from "./select-option";
import {
    SelectOption,
    SelectOptionHandledProps,
    SelectOptionUnhandledProps,
} from "./index";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("select option", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTSelectOption as any).name}`).toBe(
            MSFTSelectOption.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTSelectOption value="test" id="test" />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: SelectOptionUnhandledProps = {
            "aria-hidden": true,
        };

        const rendered: any = mount(
            <SelectOption {...unhandledProps} value="test" id="test" />
        );

        expect(rendered.find("div").prop("aria-hidden")).toEqual(true);
    });

    test("should not throw if glyph prop is not provided", () => {
        expect(() => {
            shallow(<SelectOption value="test" id="test" glyph={null} />);
        }).not.toThrow();
    });

    test("should create glyph element passed in", () => {
        const props: SelectOptionHandledProps = {
            value: "test",
            id: "test",
            glyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
        };

        const rendered: any = mount(<SelectOption {...props} />);

        expect(rendered.contains(<div>X</div>)).toEqual(true);
    });
});
