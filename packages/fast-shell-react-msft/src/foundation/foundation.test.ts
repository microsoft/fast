import * as React from "react";
import Foundation from "./foundation";

interface IFoundationTestHandledProps {
    test?: string;
}

interface IFoundationTestUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
class FoundationTest extends Foundation<IFoundationTestHandledProps & IFoundationTestUnhandledProps, undefined> {
    protected handledProps: IFoundationTestHandledProps = {
        test: "test"
    }

    public generateClassNames(value: string = ""): string {
        return super.generateClassNames(value);
    }

    public unhandledProps(): Partial<IFoundationTestUnhandledProps> {
        return super.unhandledProps();
    }
}

const testUndefinedProps = new FoundationTest(undefined);

describe("foundation", (): void => {
    test("should not error on any method when no props are available", (): void => {
        expect((): void => {testUndefinedProps.generateClassNames()}).not.toThrow();
        expect((): void => {testUndefinedProps.unhandledProps()}).not.toThrow();
    })

    test("should return an empty string when generateClassNames is called with no input and no className prop", (): void => {
        expect(testUndefinedProps.generateClassNames()).toBe("")
    });

    test("should accept className props", (): void => {
        const classProp: string = "test";
        const instanceClass: string = "instance-class";
        const test = new FoundationTest({className: classProp});

        expect(test.generateClassNames()).toBe(classProp);
        expect(test.generateClassNames(instanceClass)).toBe(`${instanceClass} ${classProp}`);
    });

    test("should return all unhandled props", (): void => {
        const unhandledProps = {
            id: "id"
        };
        const test = new FoundationTest(Object.assign({test: "foo"}, unhandledProps));

        expect(Object.keys(test.unhandledProps())).toEqual(Object.keys(unhandledProps));

    })
});
