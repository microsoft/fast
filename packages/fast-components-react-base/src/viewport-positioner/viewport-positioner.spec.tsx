import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import ViewportPositioner, {
    ViewportPositionerClassNameContract,
    ViewportPositionerHandledProps,
    ViewportPositionerProps,
    ViewportPositionerUnhandledProps,
} from "./viewport-positioner";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: ViewportPositionerClassNameContract = {
    viewportPositioner: "viewportPositioner",
    viewportPositioner__left: "viewportPositioner__left",
    viewportPositioner__centerLeft: "viewportPositioner__centerLeft",
    viewportPositioner__right: "viewportPositioner__right",
    viewportPositioner__centerRight: "viewportPositioner__centerRight",
    viewportPositioner__top: "viewportPositioner__top",
    viewportPositioner__middleTop: "viewportPositioner",
    viewportPositioner__bottom: "viewportPositioner__bottom",
    viewportPositioner__middleBottom: "viewportPositioner__middleBottom",
};

describe("viewport positioner", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(ViewportPositioner as any).name}`).toBe(
            ViewportPositioner.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ViewportPositioner />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ViewportPositionerUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<ViewportPositioner {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });
});
