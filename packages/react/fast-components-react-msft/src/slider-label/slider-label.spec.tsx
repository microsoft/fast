import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { DisplayNamePrefix } from "../utilities";
import MSFTSliderLabel from "./slider-label";
import { SliderLabel, SliderLabelUnhandledProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("slider label", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTSliderLabel as any).name}`).toBe(
            MSFTSliderLabel.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTSliderLabel />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: SliderLabelUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<SliderLabel {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });
});
