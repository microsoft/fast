import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import {
    Container,
    ContainerClassNamesContract,
    ContainerHandledProps,
    ContainerUnhandledProps,
} from "./container";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Container", (): void => {
    const managedClasses: ContainerClassNamesContract = {
        container: "container",
    };

    test("should have a displayName that matches the component name", () => {
        expect(`${(Container as any).name}`).toBe(Container.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Container />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: ContainerUnhandledProps = {
            "aria-hidden": true,
        };

        const props: ContainerHandledProps & ContainerUnhandledProps = {
            ...unhandledProps,
        };

        const rendered: any = mount(
            <Container managedClasses={managedClasses} {...props} />
        );

        expect(rendered.first().prop("aria-hidden")).toEqual(true);
    });
});
