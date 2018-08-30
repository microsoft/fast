import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Progress, {
    IProgressClassNameContract,
    ProgressType
} from "./";
import examples from "./examples.data";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

const managedClasses: IProgressClassNameContract = {
    progress: "progess"
};

describe("horizontal overflow snapshot", (): void => {
    generateSnapshots(examples);
});

describe("progress", (): void => {
    test("should render a child if one is passed as a child with the appropriate slot prop", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses}>
                <div id="testDivIndeterminate" slot={ProgressType.indeterminate}>indeterminate</div>
            </Progress>
        );

        expect(progess.find("#testDivIndeterminate")).not.toBe(undefined);
    });

    test("should not render Indeterminate slot when value prop is passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses} value={50}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>indeterminate</div>
            </Progress>
        );

        expect(progess.find("div.progressIndeterminate").length).toBe(0);
    });

    test("should render Determinate slot when value prop is passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses} value={50}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>indeterminate</div>
            </Progress>
        );

        expect(progess.find("div.progressDeterminate").length).toBe(3);
    });

    test("should not render Determinate slot when value prop is not passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>indeterminate</div>
            </Progress>
        );

        expect(progess.find("div.progressDeterminate").length).toBe(0);
    });

    test("should render Indeterminate slot when value prop is not passed", () => {
        const progess: any = mount(
            <Progress managedClasses={managedClasses}>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressDeterminate" slot={ProgressType.determinate}>determinate</div>
                <div className="progressIndeterminate" slot={ProgressType.indeterminate}>indeterminate</div>
            </Progress>
        );

        expect(progess.find("div.progressIndeterminate").length).toBe(1);
    });
});
