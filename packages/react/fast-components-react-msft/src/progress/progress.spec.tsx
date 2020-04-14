import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { DisplayNamePrefix } from "../utilities";
import MSFTProgress, { ProgressClassNameContract } from "./progress";
import { ProgressSize } from "./progress.props";
import { ProgressHandledProps, ProgressProps, ProgressUnhandledProps } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: ProgressClassNameContract = {
    progress: "progress-class",
    progress__circular: "progress__circular-class",
    progress__paused: "progress__paused-class",
    progress_circularSVG__control: "progress_circularSVG__control-class",
    progress_circularSVG__container: "progress_circularSVG__container-class",
    progress_circularSVG__page: "progress_circularSVG__page-class",
    progress_valueIndicator: "progress_valueIndicator-class",
    progress_valueIndicator__indeterminate:
        "progress_valueIndicator__indeterminate-class",
    progress_indicator: "progress_indicator-class",
    progress_indicator__determinate: "progress_indicator__determinate-class",
    progress_dot: "progress_dot-class",
    progress_dot__1: "progress_dot__1-class",
    progress_dot__2: "progress_dot__2-class",
};

describe("progress", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTProgress as any).name}`).toBe(
            MSFTProgress.displayName
        );
    });

    test("should accept unhandledProps", (): void => {
        const handledProps: ProgressHandledProps = {
            circular: true,
        };

        const unhandledProps: ProgressUnhandledProps = {
            "aria-hidden": true,
        };

        const props: ProgressProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<MSFTProgress {...props} />);

        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTProgress />);
        }).not.toThrow();
    });

    test("should use circular class names when circular prop is set to true", () => {
        const rendered: any = mount(
            <MSFTProgress managedClasses={managedClasses} circular={true} />
        );

        expect(rendered.exists("div.progress__circular-class")).toBe(true);
    });

    test("should use paused class names when paused prop is set to true", () => {
        const rendered: any = mount(
            <MSFTProgress managedClasses={managedClasses} paused={true} />
        );

        expect(rendered.exists("div.progress__paused-class")).toBe(true);
    });

    test("should use not use interdeterminate class names when value prop is set", () => {
        const rendered: any = shallow(
            <MSFTProgress managedClasses={managedClasses} circular={true} value={75} />
        );

        expect(
            rendered.exists("circle.progress_valueIndicator__indeterminate-class")
        ).toBe(false);
    });

    test("should render the correct size when `size` prop is control", () => {
        const rendered: any = mount(
            <MSFTProgress
                managedClasses={managedClasses}
                circular={true}
                size={ProgressSize.control}
            />
        );

        expect(rendered.find("svg").prop("className")).toContain("control");
    });

    test("should render the correct size when `size` prop is page", () => {
        const rendered: any = mount(
            <MSFTProgress
                managedClasses={managedClasses}
                circular={true}
                size={ProgressSize.page}
            />
        );

        expect(rendered.find("svg").prop("className")).toContain("page");
    });

    test("should render default size if none is specified", () => {
        const rendered: any = mount(
            <MSFTProgress managedClasses={managedClasses} circular={true} />
        );

        expect(rendered.find("svg").prop("className")).toContain("container");
    });
});
