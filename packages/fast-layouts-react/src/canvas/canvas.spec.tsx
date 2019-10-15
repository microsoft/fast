import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import {
    Canvas,
    CanvasClassNamesContract,
    CanvasHandledProps,
    CanvasUnhandledProps,
} from "./canvas";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Canvas", (): void => {
    const managedClasses: CanvasClassNamesContract = {
        canvas: "canvas",
    };
    const handledProps: CanvasHandledProps = {
        minWidth: 400,
    };
    test("should have a displayName that matches the component name", () => {
        expect(`${(Canvas as any).name}`).toBe(Canvas.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Canvas {...handledProps} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: CanvasUnhandledProps = {
            "aria-hidden": true,
        };

        const props: CanvasHandledProps & CanvasUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(
            <Canvas managedClasses={managedClasses} {...props} />
        );

        expect(rendered.first().prop("aria-hidden")).toEqual(true);
    });

    test("should set a default minWidth value if no `minWidth` prop is passed", () => {
        const rendered: any = shallow(<Canvas managedClasses={managedClasses} />);

        expect(rendered.prop("style").minWidth).not.toBe(undefined);
        expect(rendered.prop("style").minWidth).toBe("300px");
    });

    test("should set a minWidth value equal to the `minWidth` prop when passed", () => {
        const rendered: any = shallow(
            <Canvas minWidth={450} managedClasses={managedClasses} />
        );

        expect(rendered.prop("style").minWidth).toBe("450px");
    });
});
