import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import Progress, { ProgressClassNameContract, ProgressType } from "./";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: ProgressClassNameContract = {
    progress: "progess",
};

describe("progress", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((Progress as any).name).toBe(Progress.displayName);
    });

    test("should have correct element attribute role 'progressbar'", () => {
        const rendered: ShallowWrapper = shallow(<Progress />);
        expect(rendered.first().prop("role")).toBe("progressbar");
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Progress />);
        }).not.toThrow();
    });

    test("should use the default max value unless the maxValue has been passed", () => {
        const progessWithMaxValue: any = mount(
            <Progress managedClasses={managedClasses} maxValue={50} />
        );
        const progressWithoutMaxValue: any = mount(
            <Progress managedClasses={managedClasses} />
        );

        expect(progessWithMaxValue.find("[aria-valuemax]").props()["aria-valuemax"]).toBe(
            50
        );
        expect(
            progressWithoutMaxValue.find("[aria-valuemax]").props()["aria-valuemax"]
        ).toBe(100);
    });

    test("should use the default min value unless the minValue has been passed", () => {
        const progessWithMinValue: any = mount(
            <Progress managedClasses={managedClasses} minValue={50} />
        );
        const progressWithoutMinValue: any = mount(
            <Progress managedClasses={managedClasses} />
        );

        expect(progessWithMinValue.find("[aria-valuemin]").props()["aria-valuemin"]).toBe(
            50
        );
        expect(
            progressWithoutMinValue.find("[aria-valuemin]").props()["aria-valuemin"]
        ).toBe(0);
    });

    test("should have the role progressbar", () => {
        const progess: any = mount(<Progress managedClasses={managedClasses} />);

        expect(progess.find('[role="progressbar"]')).toHaveLength(1);
    });

    test("should render a child if one is passed as a child with the appropriate slot prop", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses}>
                <div id="testDivIndeterminate" slot={ProgressType.indeterminate}>
                    indeterminate
                </div>
            </Progress>
        );

        expect(progess.find("#testDivIndeterminate")).not.toBe(undefined);
    });

    test("should not render Indeterminate slot when value prop is passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses} value={50}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>
                    indeterminate
                </div>
            </Progress>
        );

        expect(progess.find("div.progressIndeterminate").length).toBe(0);
    });

    test("should render Determinate slot when value prop is passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses} value={50}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>
                    indeterminate
                </div>
            </Progress>
        );

        expect(progess.find("div.progressDeterminate").length).toBe(3);
    });

    test("should not render Determinate slot when value prop is not passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>
                    indeterminate
                </div>
            </Progress>
        );

        expect(progess.find("div.progressDeterminate").length).toBe(0);
    });

    test("should render Indeterminate slot when value prop is not passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>
                    determinate
                </div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>
                    indeterminate
                </div>
            </Progress>
        );

        expect(progess.find("div.progressIndeterminate").length).toBe(1);
    });
});
