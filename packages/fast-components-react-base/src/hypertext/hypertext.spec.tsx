import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Hypertext, {
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
    const managedClasses: IHypertextClassNameContract = {
        hypertext: "hypertext-class"
    };

    test("should have a displayName that matches the component name", () => {
        expect((Hypertext as any).name).toBe(Hypertext.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<Hypertext />);
            }
        ).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IHypertextHandledProps & IHypertextManagedClasses = {
            managedClasses
        };

        const unhandledProps: IHypertextUnhandledProps = {
            "aria-hidden": true
        };

        const props: HypertextProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Hypertext {...props} />
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
            <Hypertext managedClasses={managedClasses}>
                Children
            </Hypertext>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
