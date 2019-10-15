import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTSliderLabel from "./slider-label";
import { SliderLabel, SliderLabelHandledProps, SliderLabelUnhandledProps } from "./index";
import { DisplayNamePrefix } from "../utilities";

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
