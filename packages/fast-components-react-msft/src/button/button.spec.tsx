import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ButtonHTMLTags } from "@microsoft/fast-components-react-base";
import {
    ButtonProps,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps
} from "./button";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("button snapshots", (): void => {
    generateSnapshots(examples);
});

describe("button", (): void => {
    const Component: React.ComponentClass<IButtonHandledProps> = examples.component;

    const href: string = "https://www.microsoft.com";

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IButtonHandledProps = {
            href
        };

        const unhandledProps: IButtonUnhandledProps = {
            "aria-hidden": true
        };

        const props: IButtonHandledProps & IButtonUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        const button: any = rendered.first().shallow();

        expect(button.prop("aria-hidden")).toEqual(true);
    });
});
