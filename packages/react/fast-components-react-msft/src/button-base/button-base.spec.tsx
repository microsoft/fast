import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { DisplayNamePrefix } from "../utilities";
import ButtonBase from "./button-base";
import {
    ButtonBaseClassNameContract,
    ButtonBaseHandledProps,
    ButtonBaseProps,
    ButtonBaseUnhandledProps,
} from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("button", (): void => {
    const href: string = "https://www.microsoft.com";
    const managedClasases: ButtonBaseClassNameContract = {
        button: "button",
        button_beforeContent: "button_beforeContent",
        button_afterContent: "button_afterContent",
        button__hasBeforeOrAfterAndChildren: "button__hasBeforeOrAfterAndChildren",
    };

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(ButtonBase as any).name}`).toBe(
            ButtonBase.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ButtonBase />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const handledProps: ButtonBaseHandledProps = {
            href,
        };

        const unhandledProps: ButtonBaseUnhandledProps = {
            "aria-hidden": true,
        };

        const props: ButtonBaseProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<ButtonBase {...props} />);

        expect(rendered.find("a").prop("aria-hidden")).toEqual(true);
    });

    test("should set a custom class name when passed", () => {
        const customClassNameString: string = "customClassName";
        const rendered: any = mount(<ButtonBase className={customClassNameString} />);

        expect(rendered.find("button").prop("className")).toContain(
            customClassNameString
        );
    });

    test("should render prop into the before content location if prop exists", () => {
        const props: ButtonBaseHandledProps = {
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

        const rendered: any = mount(<ButtonBase {...props} />);

        expect(rendered.find("svg")).not.toBe(undefined);
        expect(rendered.find("button").childAt(0).type()).toEqual("svg");
    });

    test("should render prop into the after content location if prop exists", () => {
        const props: ButtonBaseHandledProps = {
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

        const rendered: any = mount(<ButtonBase {...props} />);

        expect(rendered.find("svg")).not.toBe(undefined);
        expect(rendered.find("button").childAt(1).type()).toEqual("svg");
    });

    test("should add a `hasBeforeOrAfterAndChildren` className when `beforeContent` prop and children exist", () => {
        const props: ButtonBaseHandledProps = {
            children: "Foo",
            managedClasses: managedClasases,
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

        const rendered: any = mount(<ButtonBase {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            managedClasases.button__hasBeforeOrAfterAndChildren
        );
    });

    test("should add a `hasBeforeOrAfterAndChildren` className when `afterContent` prop and children exist", () => {
        const props: ButtonBaseHandledProps = {
            children: "Foo",
            managedClasses: managedClasases,
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

        const rendered: any = mount(<ButtonBase {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            managedClasases.button__hasBeforeOrAfterAndChildren
        );
    });

    test("should NOT add a `hasBeforeOrAfterAndChildren` className when `beforeContent` prop is passed and no children exist", () => {
        const props: ButtonBaseHandledProps = {
            managedClasses: managedClasases,
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

        const rendered: any = mount(<ButtonBase {...props} />);

        expect(rendered.find("button").prop("className")).not.toContain(
            managedClasases.button__hasBeforeOrAfterAndChildren
        );
    });

    test("should NOT add a `hasBeforeOrAfterAndChildren` className when `afterContent` prop is passed and no children exist", () => {
        const props: ButtonBaseHandledProps = {
            managedClasses: managedClasases,
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

        const rendered: any = mount(<ButtonBase {...props} />);

        expect(rendered.find("button").prop("className")).not.toContain(
            managedClasases.button__hasBeforeOrAfterAndChildren
        );
    });
});
