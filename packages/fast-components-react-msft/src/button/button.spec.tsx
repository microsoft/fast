import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { ButtonHTMLTags } from "@microsoft/fast-components-react-base";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import MSFTButton, {
    ButtonAppearance,
    ButtonProps,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps,
    IMSFTButtonClassNameContract
} from "./button";
import { Button } from "./index";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("button", (): void => {
    const href: string = "https://www.microsoft.com";

    const beforeSlotExample: JSX.Element = (
        <div
            className={"slotBefore"}
            key={"Slot"}
            slot="before"
        >
            Before slot
        </div>
    );

    const afterSlotExample: JSX.Element = (
        <div
            className={"slotAfter"}
            key={"afterSlot"}
            slot="after"
        >
            After slot
        </div>
    );

    test("should have a displayName that matches the component name", () => {
        expect((MSFTButton as any).name).toBe(MSFTButton.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<MSFTButton />);
                shallow(<MSFTButton appearance={ButtonAppearance.justified} />);
                shallow(<MSFTButton appearance={ButtonAppearance.outline} />);
                shallow(<MSFTButton appearance={ButtonAppearance.lightweight} />);
                shallow(<MSFTButton appearance={ButtonAppearance.primary} />);
            }
        ).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IButtonHandledProps = {
            href
        };

        const unhandledProps: IButtonUnhandledProps = {
            "aria-hidden": true
        };

        const props: IButtonHandledProps & IButtonUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Button {...props}/>
        );

        const button: any = rendered.first().shallow();

        expect(button.prop("aria-hidden")).toEqual(true);
    });

    /* tslint:disable-next-line */
    test("should apply a 'primary' html class when appearance is primary", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.primary
        };

        const rendered: any = shallow(
            <Button {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button__primary;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.primary);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    /* tslint:disable-next-line */
    test("should apply an 'outline' html class when appearance is outline", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.outline
        };

        const rendered: any = shallow(
            <Button {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button__outline;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.outline);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    /* tslint:disable-next-line */
    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.lightweight
        };

        const rendered: any = shallow(
            <Button {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button__lightweight;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.lightweight);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    /* tslint:disable-next-line */
    test("should apply a 'justified' html class when appearance is justified", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.justified
        };

        const rendered: any = shallow(
            <Button {...props}/>
        );

        const button: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = button.instance().props.managedClasses.button__justified;

        expect(button.instance().props.appearance).toEqual(ButtonAppearance.justified);
        // Generated managedClass should be passed to className
        expect(button.prop("className")).toBe(expectedClassName);
    });

    test("should set a custom class name when passed", () => {
        const customClassNameString: string = "customClassName";
        const rendered: any = shallow(
            <Button className={customClassNameString} />
        );

        const button: any = rendered.first().shallow();

        expect(button.prop("className")).toEqual(customClassNameString);
    });

    test("should set a custom class name and 'justified' class name when appearance is justified and a custom class is passed", () => {
        const customClassNameString: string = "customClassName";
        const rendered: any = shallow(
            <Button appearance={ButtonAppearance.justified} className={customClassNameString} />
        );

        const button: any = rendered.first().shallow();
        const expectedClassName: string = `${button.instance().props.managedClasses.button__justified} ${customClassNameString}`;

        expect(button.prop("className")).toEqual(expectedClassName);
    });

    /* tslint:disable-next-line */
    test("should add a child element with the slot prop set to 'before' into the before slot location", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.lightweight,
            href: "#",
            children: ["foo", beforeSlotExample]
        };

        const rendered: any = mount(
            <Button {...props} />
        );

        expect(rendered.instance().props.children[1].props.slot).toBe("before");
        expect(rendered.find("div.slotBefore").length).toBe(1);
    });

    /* tslint:disable-next-line */
    test("should add a child element with the slot prop set to 'after' into the after slot location", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.lightweight,
            href: "#",
            children: ["foo", afterSlotExample]
        };

        const rendered: any = mount(
            <Button {...props} />
        );

        expect(rendered.instance().props.children[1].props.slot).toBe("after");
        expect(rendered.find("div.slotAfter").length).toBe(1);
    });
});
