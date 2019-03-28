import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTParagraph, {
    ParagraphHandledProps,
    ParagraphManagedClasses,
    ParagraphProps,
    ParagraphSize,
    ParagraphUnhandledProps,
} from "./paragraph";
import { Paragraph } from "./index";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("paragraph", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTParagraph as any).name}`).toBe(
            MSFTParagraph.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Paragraph />);
            shallow(<Paragraph size={ParagraphSize._1} />);
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ParagraphHandledProps = {
            size: ParagraphSize._1,
        };

        const unhandledProps: ParagraphUnhandledProps = {
            "aria-hidden": true,
        };

        const props: ParagraphHandledProps & ParagraphUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<Paragraph {...props} />);

        expect(rendered.exists("[aria-hidden]")).toEqual(true);
    });

    test("should render the correct `size` when `size` prop is passed", () => {
        const rendered: any = mount(<Paragraph size={ParagraphSize._2} />);

        expect(rendered.find("p").prop("className")).toContain("paragraph__2");
    });

    test("should render a default `size` of `ParagraphSize._3` if no `size` prop is passed", () => {
        const rendered: any = mount(<MSFTParagraph />);

        expect(rendered.prop("size")).toBe(ParagraphSize._3);
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(<MSFTParagraph>Children</MSFTParagraph>);

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
