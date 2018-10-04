import * as React from "react";
import { cleanLowerOrderComponentProps, manageJss } from "./manage-jss";
import { IJSSManagerProps, JSSManager } from "./jss-manager";
import { jss, stylesheetRegistry } from "./jss";
import { ComponentStyles, ComponentStyleSheetResolver } from "@microsoft/fast-jss-manager";
import * as ShallowRenderer from "react-test-renderer/shallow";
import { configure, mount, ReactWrapper, render, shallow } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

class SimpleComponent extends React.Component<any, any> {
    public render(): boolean {
        return true;
    }
}

describe("manageJss", (): void => {
    test("should return a  function", (): void => {
         expect(typeof manageJss()).toBe("function");
    });

    test("should return a function that returns react stateless component", (): void => {
        const hoc: React.SFC<{}> = manageJss()(SimpleComponent);

        expect(typeof hoc).toEqual("function");

        // Should expect a single prop argument
        expect(hoc.length).toBe(1);
    });
});

describe("cleanLowerOrderComponentProps", (): void => {
    test("should filter out jssStyleSheet and managedClasses", (): void => {
        const props: any = {
            managedClasses: {},
            jssStyleSheet: {},
            foobar: "success"
        };

        const result: any = cleanLowerOrderComponentProps(props);
        expect(result.jssStyleSheet).toBe(undefined);
        expect(result.foobar).toBe("success");
    });
});
