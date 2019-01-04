import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { ButtonHTMLTags } from "@microsoft/fast-components-react-base";
import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import MSFTButton from "./button";
import {
    Button,
    ButtonAppearance,
    ButtonHandledProps,
    ButtonProps,
    ButtonUnhandledProps,
} from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("button", (): void => {
    const href: string = "https://www.microsoft.com";

    const beforeSlotExample: JSX.Element = (
        <div className={"slotBefore"} key={"Slot"} slot="before">
            Before slot
        </div>
    );

    const afterSlotExample: JSX.Element = (
        <div className={"slotAfter"} key={"afterSlot"} slot="after">
            After slot
        </div>
    );

    test("should have a displayName that matches the component name", () => {
        expect((MSFTButton as any).name).toBe(MSFTButton.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTButton />);
            shallow(<MSFTButton appearance={ButtonAppearance.justified} />);
            shallow(<MSFTButton appearance={ButtonAppearance.outline} />);
            shallow(<MSFTButton appearance={ButtonAppearance.lightweight} />);
            shallow(<MSFTButton appearance={ButtonAppearance.primary} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: ButtonHandledProps = {
            href,
        };

        const unhandledProps: ButtonUnhandledProps = {
            "aria-hidden": true,
        };

        const props: ButtonProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<Button {...props} />);

        expect(rendered.find("a").prop("aria-hidden")).toEqual(true);
    });

    /* tslint:disable-next-line */
    test("should apply a 'primary' html class when appearance is primary", () => {
        const rendered: any = mount(<Button appearance={ButtonAppearance.primary} />);

        expect(rendered.find("button").prop("className")).toContain("button__primary");
    });

    /* tslint:disable-next-line */
    test("should apply an 'outline' html class when appearance is outline", () => {
        const rendered: any = mount(<Button appearance={ButtonAppearance.outline} />);

        expect(rendered.find("button").prop("className")).toContain("button__outline");
    });

    /* tslint:disable-next-line */
    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const rendered: any = mount(<Button appearance={ButtonAppearance.lightweight} />);

        expect(rendered.find("button").prop("className")).toContain(
            "button__lightweight"
        );
    });

    test("should apply a 'justified' html class when appearance is justified", () => {
        const rendered: any = mount(<Button appearance={ButtonAppearance.justified} />);

        expect(rendered.find("button").prop("className")).toContain("button__justified");
    });

    test("should set a custom class name when passed", () => {
        const customClassNameString: string = "customClassName";
        const rendered: any = mount(<Button className={customClassNameString} />);

        expect(rendered.find("button").prop("className")).toContain(
            customClassNameString
        );
    });

    test("should add a child element with the slot prop set to 'before' into the before slot location", () => {
        const props: ButtonHandledProps = {
            appearance: ButtonAppearance.lightweight,
            href: "#",
            children: ["foo", beforeSlotExample],
        };

        const rendered: any = mount(<MSFTButton {...props} />);

        expect(rendered.instance().props.children[1].props.slot).toBe("before");
        expect(rendered.find("div.slotBefore").length).toBe(1);
    });

    test("should render prop into the before content location if prop exist", () => {
        const props: ButtonHandledProps = {
            children: "Foo",
            beforeContent: (classname?: string): React.ReactNode => {
                return (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className={classname}
                    >
                        <path d="M10.3906 9.39844C11.099 9.64323" fill="black" />
                    </svg>
                );
            },
        };

        const rendered: any = mount(<MSFTButton {...props} />);

        expect(rendered.find("svg")).not.toBe(undefined);
        expect(
            rendered
                .find("button")
                .childAt(0)
                .type()
        ).toEqual("svg");
    });

    test("should add a child element with the slot prop set to 'after' into the after slot location", () => {
        const props: ButtonHandledProps = {
            appearance: ButtonAppearance.lightweight,
            href: "#",
            children: ["foo", afterSlotExample],
        };

        const rendered: any = mount(<MSFTButton {...props} />);

        expect(rendered.instance().props.children[1].props.slot).toBe("after");
        expect(rendered.find("div.slotAfter").length).toBe(1);
    });

    test("should render prop into the after content location if prop exist", () => {
        const props: ButtonHandledProps = {
            children: "Foo",
            afterContent: (classname?: string): React.ReactNode => {
                return (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        className={classname}
                    >
                        <path d="M10.3906 9.39844C11.099 9.64323" fill="black" />
                    </svg>
                );
            },
        };

        const rendered: any = mount(<MSFTButton {...props} />);

        expect(rendered.find("svg")).not.toBe(undefined);
        expect(
            rendered
                .find("button")
                .childAt(1)
                .type()
        ).toEqual("svg");
    });
});
