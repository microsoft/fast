import React from "react";
import { manageJss } from "./manage-jss";
import { JSSManager } from "./jss-manager";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

class SimpleComponent extends React.Component<any, any> {
    public static staticValue: string = "staticValue";
    public render(): boolean {
        return true;
    }
}

describe("manageJss", (): void => {
    test("should return a function", (): void => {
        expect(typeof manageJss()).toBe("function");
    });

    test("should return a function that returns an implementation of the JSSManager", (): void => {
        const hoc: React.ComponentClass<{}> = manageJss()(SimpleComponent);

        expect(hoc.prototype instanceof JSSManager).toBe(true);
    });

    test("should return a component class that hoists non-react static values", (): void => {
        const hoc: React.ComponentClass<{}> = manageJss()(SimpleComponent);

        expect((hoc as any).staticValue).toBe(SimpleComponent.staticValue);
    });

    test("should return a renderable react component", (): void => {
        expect(() => {
            const Hoc: React.ComponentClass<{}> = manageJss()(SimpleComponent);
            mount(<Hoc>hello world</Hoc>);
        }).not.toThrow();
    });
});
