import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTProgress, { ProgressClassNameContract } from "./progress";
import { ProgressProps } from "./index";
import { DisplayNamePrefix } from "../utilities";
import { ProgressSize } from "./progress.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: ProgressClassNameContract = {
    progress: "progress-class",
    progressCircular: "progressCircular-class",
    progressCircular__small: "progressCircular__small-class",
    progressCircular__medium: "progressCircular__medium-class",
    progressCircular__large: "progressCircular__large-class",
    progress_valueIndicator: "progress_valueIndicator-class",
    progressCircular_valueIndicator: "progressCircular_valueIndicator-class",
    progressCircular_valueIndicator__indeterminate:
        "progressCircular_valueIndicator__indeterminate-class",
    progress_indicator: "progress_indicator-class",
    progressCircular_indicator: "progressCircular_indicator-class",
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

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTProgress />);
        }).not.toThrow();
    });

    test("should use circular class names when circular prop is set to true", () => {
        const rendered: any = mount(
            <MSFTProgress managedClasses={managedClasses} circular={true} />
        );

        expect(rendered.exists("div.progressCircular-class")).toBe(true);
        expect(rendered.exists("circle.progressCircular_valueIndicator-class")).toBe(
            true
        );
        expect(
            rendered.exists("circle.progressCircular_valueIndicator__indeterminate-class")
        ).toBe(true);
    });

    test("should use not use interdeterminate class names when value prop is set", () => {
        const rendered: any = shallow(
            <MSFTProgress managedClasses={managedClasses} circular={true} value={75} />
        );

        expect(
            rendered.exists("circle.progressCircular_valueIndicator__indeterminate-class")
        ).toBe(false);
    });

    test("should render the correct `size` when `size` prop is small", () => {
        const rendered: any = mount(
            <MSFTProgress
                managedClasses={managedClasses}
                circular={true}
                size={ProgressSize.small}
            />
        );

        expect(rendered.find("svg").prop("className")).toContain("small");
    });

    test("should render the correct `size` when `size` prop is large", () => {
        const rendered: any = mount(
            <MSFTProgress
                managedClasses={managedClasses}
                circular={true}
                size={ProgressSize.large}
            />
        );

        expect(rendered.find("svg").prop("className")).toContain("large");
    });

    test("should render default size if none is specified", () => {
        const rendered: any = mount(
            <MSFTProgress managedClasses={managedClasses} circular={true} />
        );

        expect(rendered.find("svg").prop("className")).toContain("medium");
    });
});
