import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { IHypertextClassNameContract } from "./hypertext";
import {
    HypertextProps,
    IHypertextHandledProps,
    IHypertextManagedClasses,
    IHypertextUnhandledProps
} from "./hypertext.props";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("hypertext", (): void => {
    generateSnapshots(examples);
});

describe("hypertext unit-tests", (): void => {
    let Component: React.ComponentClass<IHypertextHandledProps & IHypertextManagedClasses>;
    let managedClasses: IHypertextClassNameContract;

    beforeEach(() => {
        Component = examples.component;
        managedClasses = {
            hypertext: "hypertext-class"
        };
    });

    test("should correctly manage unhandledProps", () => {
        const handledProps: IHypertextHandledProps & IHypertextManagedClasses = {
            managedClasses
        };

        const unhandledProps: IHypertextUnhandledProps = {
            "aria-hidden": true
        };

        const props: HypertextProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.props()["aria-hidden"]).not.toBe(undefined);
        expect(rendered.props()["aria-hidden"]).toEqual(true);
    });

    test("should correctly handle children", () => {
        const handledProps: IHypertextHandledProps & IHypertextManagedClasses = {
            managedClasses,
            href: "http://www.microsoft.com"
        };
        const rendered: any = shallow(
            <Component managedClasses={managedClasses}>
                Children
            </Component>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
