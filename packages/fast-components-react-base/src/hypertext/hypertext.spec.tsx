import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    HypertextProps,
    IHypertextClassNameContract,
    IHypertextHandledProps,
    IHypertextManagedClasses,
    IHypertextUnhandledProps
} from "./hypertext";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("hypertext snapshot", (): void => {
    generateSnapshots(examples);
});

describe("hypertext", (): void => {
    const Component: React.ComponentClass<IHypertextHandledProps & IHypertextManagedClasses> = examples.component;
    const managedClasses: IHypertextClassNameContract = {
        hypertext: "hypertext-class"
    };

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
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

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
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
