import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, ReactWrapper, shallow } from "enzyme";
import { DesignSystemProvider } from "./design-system-provider";
import { Consumer } from "./context";

configure({ adapter: new Adapter() });

describe("DesignSystemProvider", (): void => {
    test("should render children", (): void => {
        const text: string = "aRrAyS sTaRt At OnE";
        const provider: ReactWrapper = mount(
            <DesignSystemProvider designSystem={{}}>
                <p>{text}</p>
            </DesignSystemProvider>
        );

        expect(provider.find("p").text()).toBe(text);
    });

    test("should not throw when not provided props", (): void => {
        expect(() => {
            return shallow(React.createElement(DesignSystemProvider));
        }).not.toThrow();
    });

    test("should provide the design system to a consumer", (): void => {
        function render(value: { success: boolean }): string {
            return value.success.toString();
        }

        const tree: ReactWrapper = mount(
            <DesignSystemProvider designSystem={{ success: true }}>
                <Consumer>{render}</Consumer>
            </DesignSystemProvider>
        );

        expect(tree.text()).toBe(true.toString());
    });

    test("should override nested context values", (): void => {
        function render(value: { success: string }): string {
            return value.success;
        }

        const tree: ReactWrapper = mount(
            <DesignSystemProvider designSystem={{ success: "unsuccessfull" }}>
                <DesignSystemProvider designSystem={{ success: "successful" }}>
                    <Consumer>{render}</Consumer>
                </DesignSystemProvider>
            </DesignSystemProvider>
        );

        expect(tree.text()).toBe("successful");
    });

    test("should allow partial updates to context values", (): void => {
        const renderOne: any = jest.fn();
        const renderTwo: any = jest.fn();
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const tree: ReactWrapper = mount(
            <DesignSystemProvider designSystem={{ a: "a", b: "b" }}>
                <Consumer>{renderOne}</Consumer>
                <DesignSystemProvider designSystem={{ a: "A" }}>
                    <Consumer>{renderTwo}</Consumer>
                </DesignSystemProvider>
            </DesignSystemProvider>
        );

        expect(renderOne.mock.calls).toHaveLength(1);
        expect(renderOne.mock.calls[0][0]).toEqual({ a: "a", b: "b" });
        expect(renderTwo.mock.calls).toHaveLength(1);
        expect(renderTwo.mock.calls[0][0]).toEqual({ a: "A", b: "b" });
    });

    test("should not update the designSystem if its props are unchanged", (): void => {
        const render: any = jest.fn();
        const designSystem: any = { a: "a", b: "b" };

        const tree: ReactWrapper = mount(
            <div>
                <DesignSystemProvider designSystem={designSystem}>
                    <Consumer>{render}</Consumer>
                </DesignSystemProvider>
            </div>
        );

        tree.setProps({ id: "id" });

        expect(render).toHaveBeenCalledTimes(1);
    });
});
