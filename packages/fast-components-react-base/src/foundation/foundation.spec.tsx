/* tslint:disable:max-classes-per-file */
/* tslint:disable:no-string-literal */
import * as React from "react";
import Foundation, {HandledProps, ReferenceResolver} from "./foundation";
import * as ReactTestUtils from "react-dom/test-utils";
import {has,  merge} from "lodash-es";

class GetRefTestComponent extends Foundation<undefined, undefined, undefined> {
    public render(): JSX.Element {
        return <div ref={this.setRef("foobar")} />;
    }
}

describe("setRef", () => {
    let getRefTestComponent: any;

    beforeEach(() => {
        getRefTestComponent = new ReactTestUtils.renderIntoDocument(<GetRefTestComponent />);
    });

    test("should not throw if all parameters are null", () => {
        expect(() => { getRefTestComponent.setRef(null); }).not.toThrow();
        expect(() => { getRefTestComponent.setRef(null, null); }).not.toThrow();
    });

    test("should return undefined is a reference resolves to an object", () => {
        getRefTestComponent.setRef("foo.bar");
        expect(typeof getRefTestComponent.setRef("foo")).toBe("undefined");
    });

    test("should return undefined is a reference resolves to an array", () => {
        getRefTestComponent.setRef("foo[0]");
        expect(typeof getRefTestComponent.setRef("foo")).toBe("undefined");
    });

    test("should return undefined if all parameters are null", () => {
        expect(typeof getRefTestComponent.setRef(null)).toBe("undefined");
        expect(typeof getRefTestComponent.setRef(null, null)).toBe("undefined");
    });

    test("should return a function when a string is passed", () => {
        expect(typeof getRefTestComponent.setRef("string")).toBe("function");
    });

    test("should return a function when a number is passed", () => {
        expect(typeof getRefTestComponent.setRef(0)).toBe("function");
    });

    test("should return a function when a string and number are passed", () => {
        expect(typeof getRefTestComponent.setRef("string", 0)).toBe("function");
    });

    test("should return undefined if all parameters are null", () => {
        expect(typeof getRefTestComponent.setRef(null)).toBe("undefined");
        expect(typeof getRefTestComponent.setRef(null, null)).toBe("undefined");
    });

    test("should return a function when a string is passed", () => {
        expect(typeof getRefTestComponent.setRef("string")).toBe("function");
    });

    test("should return a function when a number is passed", () => {
        expect(typeof getRefTestComponent.setRef(0)).toBe("function");
    });

    test("should return a function when a string and number are passed", () => {
        expect(typeof getRefTestComponent.setRef("string", 0)).toBe("function");
    });

    test("should return a function when a number and boolean are passed", () => {
        expect(typeof getRefTestComponent.setRef(0, true)).toBe("function");
    });

    test("should return a function when a string and boolean are passed", () => {
        expect(typeof getRefTestComponent.setRef("string", true)).toBe("function");
    });

    test("should store the returned method under the path determined by args", () => {
        const stringCallback: ReferenceResolver = getRefTestComponent.setRef("string");
        const numberCallback: ReferenceResolver = getRefTestComponent.setRef(0);
        const stringAndNumberCallback: ReferenceResolver = getRefTestComponent.setRef("stringAndNumber", 0);

        expect(stringCallback).toBe(getRefTestComponent.referenceResolverStore.string);
        expect(numberCallback).toBe(getRefTestComponent.referenceResolverStore[0]);
        expect(stringAndNumberCallback).toBe(getRefTestComponent.referenceResolverStore.stringAndNumber[0]);
    });

    test("should not factor booleans into the referenceResolvers object structure", () => {
        const stringCallback: ReferenceResolver = getRefTestComponent.setRef("string", true);
        const numberCallback: ReferenceResolver = getRefTestComponent.setRef(0, true);
        const stringAndNumberCallback: ReferenceResolver = getRefTestComponent.setRef("stringAndNumber", 0, true);
        const stringAndNumberCallback1: ReferenceResolver = getRefTestComponent.setRef("stringAndNumber[1]", true);

        expect(stringCallback).toBe(getRefTestComponent.referenceResolverStore.string);
        expect(numberCallback).toBe(getRefTestComponent.referenceResolverStore[0]);
        expect(stringAndNumberCallback).toBe(getRefTestComponent.referenceResolverStore.stringAndNumber[0]);
        expect(stringAndNumberCallback1).toBe(getRefTestComponent.referenceResolverStore.stringAndNumber[1]);
    });
});

describe("getRef", () => {
    let getRefTestComponent: any;

    beforeEach(() => {
        getRefTestComponent = new ReactTestUtils.renderIntoDocument(<GetRefTestComponent />);
    });

    test("should not throw if all parameters are null", () => {
        expect(() => { getRefTestComponent.getRef(null); }).not.toThrow();
        expect(() => { getRefTestComponent.getRef(null, null); }).not.toThrow();
    });

    test("should return undefined if all parameters are null", () => {
        expect(typeof getRefTestComponent.getRef(null)).toBe("undefined");
        expect(typeof getRefTestComponent.getRef(null, null)).toBe("undefined");
    });

    test("should return the value mapping to the structure of params", () => {
        getRefTestComponent.referenceStore = {
            string: true,
            0: true,
            stringAndNumber: [true]
        };

        expect(getRefTestComponent.getRef("string")).toBe(true);
        expect(getRefTestComponent.getRef(0)).toBe(true);
        expect(getRefTestComponent.getRef("stringAndNumber", 0)).toBe(true);
        expect(getRefTestComponent.getRef("stringAndNumber[0]")).toBe(true);
    });
});

describe("unhandledProps", () => {
    interface IHandledProps {
        boolean: boolean;
        string: string;
        array: string[];
        object: any;
        number: number;
        undefined: undefined;
        null: null;
    }

    interface IUnhandledProps {
        booleanDirty?: boolean;
        stringDirty?: string;
        arrayDirty?: string[];
        objectDirty?: any;
        numberDirty?: number;
        undefinedDirty?: void;
        nullDirty?: null;
    }

    const cleanProps: IHandledProps = {
        boolean: true,
        string: "string",
        array: ["array"],
        object: {},
        number: 1,
        undefined: void(0),
        null: null
    };

    const dirtyProps: IUnhandledProps = {
        booleanDirty: true,
        stringDirty: "string",
        arrayDirty: ["array"],
        objectDirty: {},
        numberDirty: 1,
        undefinedDirty: void(0),
        nullDirty: null
    };

    class UnhandledPropsTestComponent extends Foundation<IHandledProps, IUnhandledProps, undefined> {
        public handledProps: HandledProps<IHandledProps> = {
            boolean: void 0,
            string: void 0,
            array: void 0,
            object: void 0,
            number: void 0,
            undefined: void 0,
            null: void 0
        };

        public render(): JSX.Element {
            return <h1>hello world</h1>;
        }
    }

    let unhandledPropsTestComponentClean: UnhandledPropsTestComponent;
    let unhandledPropsTestComponentDirty: UnhandledPropsTestComponent;

    beforeEach(() => {
        unhandledPropsTestComponentClean = new ReactTestUtils.renderIntoDocument(<UnhandledPropsTestComponent {...cleanProps}/>);
        unhandledPropsTestComponentDirty = new ReactTestUtils.renderIntoDocument(
            <UnhandledPropsTestComponent {...merge(cleanProps, dirtyProps)}/>
        );
    });

    test("should return an object", () => {
        expect(typeof unhandledPropsTestComponentClean["unhandledProps"]()).toBe("object");
        expect(unhandledPropsTestComponentClean["unhandledProps"]()).not.toBe(null);
    });

    test("return object should contain all property keys passed to props that is not enumerated on handledProps", () => {
        const unhandledProps: IUnhandledProps = unhandledPropsTestComponentDirty["unhandledProps"]();

        expect(has(unhandledProps, "booleanDirty")).toBe(true);
        expect(has(unhandledProps, "stringDirty")).toBe(true);
        expect(has(unhandledProps, "arrayDirty")).toBe(true);
        expect(has(unhandledProps, "objectDirty")).toBe(true);
        expect(has(unhandledProps, "numberDirty")).toBe(true);
        expect(has(unhandledProps, "undefinedDirty")).toBe(true);
        expect(has(unhandledProps, "nullDirty")).toBe(true);
    });

    test("return object should not contain any property keys contained on handledProps", () => {
        const unhandledProps: IUnhandledProps = unhandledPropsTestComponentClean["unhandledProps"]();

        expect(has(unhandledProps, "boolean")).toBe(false);
        expect(has(unhandledProps, "string")).toBe(false);
        expect(has(unhandledProps, "array")).toBe(false);
        expect(has(unhandledProps, "object")).toBe(false);
        expect(has(unhandledProps, "number")).toBe(false);
        expect(has(unhandledProps, "undefined")).toBe(false);
        expect(has(unhandledProps, "null")).toBe(false);
    });
});

describe("generateClassNames", () => {
    class ApplyClassNameComponent extends Foundation<any, any, any> {
        public render(): JSX.Element {
            return <div>Hello World</div>;
        }
    }

    let applyClassNameWithEmptyComponentClasses: ApplyClassNameComponent;
    let applyClassNameWithProps: ApplyClassNameComponent;
    let applyClassNameWithComponentClasses: ApplyClassNameComponent;

    beforeEach((): void => {
        applyClassNameWithEmptyComponentClasses = new ReactTestUtils.renderIntoDocument(<ApplyClassNameComponent />);
        applyClassNameWithProps = new ReactTestUtils.renderIntoDocument(<ApplyClassNameComponent foo="bar" />);
        applyClassNameWithComponentClasses = new ReactTestUtils.renderIntoDocument(
            <ApplyClassNameComponent className="custom-class-name"/>
        );
    });

    test("should return null if props are undefined and componentClasses is not a string", () => {
        expect(applyClassNameWithEmptyComponentClasses["generateClassNames"]()).toBe(null);
    });

    test("should return null if componentClasses are not a string and no className prop is passed", () => {
        expect(applyClassNameWithProps["generateClassNames"]()).toBe(null);
    });

    test("should return componentClasses if componentClasses is a string and no props are passed", () => {
        expect(applyClassNameWithEmptyComponentClasses["generateClassNames"]("component-classes")).toBe("component-classes");
    });

    test("should return componentClasses if componentClasses is a string and no className prop is passed", () => {
        expect(applyClassNameWithProps["generateClassNames"]("component-classes")).toBe("component-classes");
    });

    test("should combine component classes and className props if both are passed", () => {
        expect(applyClassNameWithComponentClasses["generateClassNames"]("component-classes")).toBe("component-classes custom-class-name");
        expect(applyClassNameWithComponentClasses["generateClassNames"](" component-classes")).toBe("component-classes custom-class-name");
        expect(applyClassNameWithComponentClasses["generateClassNames"](" component-classes ")).toBe("component-classes custom-class-name");
        expect(
            applyClassNameWithComponentClasses["generateClassNames"](" component-classes       ")
        ).toBe("component-classes custom-class-name");
        expect(
            new ReactTestUtils.renderIntoDocument(
                <ApplyClassNameComponent className="   custom-class-name   "/>
            )["generateClassNames"](" component-classes     ")
        ).toBe("component-classes custom-class-name");
    });
});
