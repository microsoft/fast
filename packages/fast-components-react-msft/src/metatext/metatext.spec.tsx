import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTMetatext, {
    IMetatextHandledProps,
    IMetatextManagedClasses,
    IMetatextUnhandledProps,
    MetatextProps,
    MetatextTag
} from "./metatext";
import { Metatext } from "./index";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("metatext snapshots", (): void => {
    generateSnapshots(examples);
});

describe("metatext", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTMetatext as any).name).toBe(MSFTMetatext.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<MSFTMetatext />);
            }
        ).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IMetatextHandledProps = {
            tag: MetatextTag.p
        };

        const unhandledProps: IMetatextUnhandledProps = {
            "aria-hidden": true
        };

        const props: IMetatextHandledProps & IMetatextUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Metatext {...props} />
        );

        const paragraph: any = rendered.first().shallow();

        expect(paragraph.prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Metatext tag={MetatextTag.p} />
        );
        const paragraph: any = rendered.first().shallow();

        expect(paragraph.instance().props.tag).toEqual(MetatextTag.p);
    });
});
