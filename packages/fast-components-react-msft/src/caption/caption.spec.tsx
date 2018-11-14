import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTCaption, {
    CaptionHandledProps,
    CaptionManagedClasses,
    CaptionSize,
    CaptionTag,
    CaptionUnhandledProps,
} from "./caption";
import { Caption, CaptionProps } from "./index";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("caption", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTCaption as any).name).toBe(MSFTCaption.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTCaption />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: CaptionHandledProps = {
            tag: CaptionTag.p,
            size: CaptionSize._1,
        };

        const unhandledProps: CaptionUnhandledProps = {
            "aria-hidden": true,
        };

        const props: CaptionHandledProps & CaptionUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<Caption {...props} />);

        expect(rendered.find(handledProps.tag).prop("aria-hidden")).toEqual(true);
    });

    test("should render a default `tag` of `CaptionTag.p` if no `tag` prop is passed", () => {
        const rendered: any = mount(<MSFTCaption />);

        expect(rendered.prop("tag")).toEqual(CaptionTag.p);
    });

    test("should render as a `p` element when `CaptionTag.p` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTCaption tag={CaptionTag.p} />);

        expect(rendered.exists(CaptionTag.p)).toBe(true);
    });

    test("should render as a `span` element when `CaptionTag.span` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTCaption tag={CaptionTag.span} />);

        expect(rendered.exists(CaptionTag.span)).toBe(true);
    });

    test("should render as a `caption` element when `CaptionTag.caption` is passed to the `tag` prop", () => {
        // include <table> element to validate DOM nesting and prevent warning during tests
        const rendered: any = mount(
            <table>
                <MSFTCaption tag={CaptionTag.caption} />
            </table>
        );

        expect(rendered.exists(CaptionTag.caption)).toBe(true);
    });

    test("should render as a `figcaption` element when `CaptionTag.figcaption` is passed to the `tag` prop", () => {
        const rendered: any = mount(<MSFTCaption tag={CaptionTag.figcaption} />);

        expect(rendered.exists(CaptionTag.figcaption)).toBe(true);
    });

    test("should render the correct `size` when `size` prop is passed", () => {
        const rendered: any = mount(<Caption size={CaptionSize._2} />);

        expect(rendered.find("p").prop("className")).toContain("caption__2");
    });

    test("should accept and render children", () => {
        const rendered: any = shallow(<MSFTCaption>Children</MSFTCaption>);

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });
});
