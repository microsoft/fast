import * as React from "react";
import Foundation from "./Foundation";
import * as ReactTestUtils from "react-dom/test-utils";
// import { merge, has } from "lodash-es";

// Todo: [Task #2756] Tests are failing so they have been ignored in the config found in package.json.
// Remove this comment and testPathIgnorePatterns when fixed
describe("setRef", () => {
    let getRefTestComponent;
    class GetRefTestComponent extends Foundation<undefined, undefined> {
        public render() { return <div ref={this.setRef("foobar")} />; }
    }

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
        const stringCallback = getRefTestComponent.setRef("string");
        const numberCallback = getRefTestComponent.setRef(0);
        const stringAndNumberCallback = getRefTestComponent.setRef("stringAndNumber", 0);

        expect(stringCallback).toBe(getRefTestComponent.referenceResolvers.string);
        expect(numberCallback).toBe(getRefTestComponent.referenceResolvers[0]);
        expect(stringAndNumberCallback).toBe(getRefTestComponent.referenceResolvers.stringAndNumber[0]);
    });

    test("should not factor booleans into the referenceResolvers object structure", () => {
        const stringCallback = getRefTestComponent.setRef("string", true);
        const numberCallback = getRefTestComponent.setRef(0, true);
        const stringAndNumberCallback = getRefTestComponent.setRef("stringAndNumber", 0, true);
        const stringAndNumberCallback1 = getRefTestComponent.setRef("stringAndNumber[1]", true);

        expect(stringCallback).toBe(getRefTestComponent.referenceResolvers.string);
        expect(numberCallback).toBe(getRefTestComponent.referenceResolvers[0]);
        expect(stringAndNumberCallback).toBe(getRefTestComponent.referenceResolvers.stringAndNumber[0]);
        expect(stringAndNumberCallback1).toBe(getRefTestComponent.referenceResolvers.stringAndNumber[1]);
    });
});

describe("getRef", () => {
    let getRefTestComponent;
    class GetRefTestComponent extends Foundation<undefined, undefined> {
        public render() { return <div ref={this.setRef("foobar")} />; }
    }

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
//
// describe("unhandledProps", () => {
//     let unhandledPropsTestComponentClean;
//     let unhandledPropsTestComponentDirty;
//     const cleanProps = {
//         boolean: true,
//         string: "string",
//         array: ["array"],
//         object: {},
//         number: 1,
//         undefined: void(0),
//         null: null
//     };
//
//     const dirtyProps = {
//         booleanDirty: true,
//         stringDirty: "string",
//         arrayDirty: ["array"],
//         objectDirty: {},
//         numberDirty: 1,
//         undefinedDirty: void(0),
//         nullDirty: null
//     };
//
//     interface IUnhandledPropsTestComponentProps {
//         boolean: boolean;
//         string: string;
//         array: string[];
//         object: any;
//         number: number;
//         undefined: undefined;
//         null: null;
//     }
//
//     class UnhandledPropsTestComponent extends BaseComponent<IUnhandledPropsTestComponentProps, undefined> {
//         public static defaultProps = {
//             boolean: true,
//             string: "string",
//             array: ["array"],
//             object: {},
//             number: 1,
//             undefined: void(0),
//             null: null
//         };
//
//         render() {
//             return <h1>hello world</h1>;
//         }
//     }
//
//     beforeEach(() => {
//         unhandledPropsTestComponentClean = new ReactTestUtils.renderIntoDocument(<UnhandledPropsTestComponent {...cleanProps}/>);
//         unhandledPropsTestComponentDirty = new ReactTestUtils.renderIntoDocument(
//             <UnhandledPropsTestComponent {...merge(cleanProps, dirtyProps)}/>
//         );
//     });
//
//     test("should return an object", () => {
//         expect(typeof unhandledPropsTestComponentClean.unhandledProps()).toBe("object");
//         expect(unhandledPropsTestComponentClean.unhandledProps()).not.toBe(null);
//     });
//     test("return object should contain all property keys passed to props that is not also referenced by defaultProps", () => {
//         const unhandledProps = unhandledPropsTestComponentDirty.unhandledProps();
//
//         expect(has(unhandledProps, "booleanDirty")).toBe(true);
//         expect(has(unhandledProps, "stringDirty")).toBe(true);
//         expect(has(unhandledProps, "arrayDirty")).toBe(true);
//         expect(has(unhandledProps, "objectDirty")).toBe(true);
//         expect(has(unhandledProps, "numberDirty")).toBe(true);
//         expect(has(unhandledProps, "undefinedDirty")).toBe(true);
//         expect(has(unhandledProps, "nullDirty")).toBe(true);
//     });
//     test("return object should not contain any property keys contained in defaultProps", () => {
//         const unhandledProps = unhandledPropsTestComponentClean.unhandledProps();
//
//         expect(has(unhandledProps, "boolean")).toBe(false);
//         expect(has(unhandledProps, "string")).toBe(false);
//         expect(has(unhandledProps, "array")).toBe(false);
//         expect(has(unhandledProps, "object")).toBe(false);
//         expect(has(unhandledProps, "number")).toBe(false);
//         expect(has(unhandledProps, "undefined")).toBe(false);
//         expect(has(unhandledProps, "null")).toBe(false);
//     });
// });
//
// describe("generateClassNames", () => {
//     let applyClassNameWithEmptyComponentClasses;
//     let applyClassNameWithProps;
//     let applyClassNameWithComponentClasses;
//
//     class ApplyClassNameComponent extends BaseComponent<any, any> {
//         render() { return <div>Hello World</div>; }
//     }
//
//     beforeEach(() => {
//         applyClassNameWithEmptyComponentClasses = new ReactTestUtils.renderIntoDocument(<ApplyClassNameComponent />);
//         applyClassNameWithProps = new ReactTestUtils.renderIntoDocument(<ApplyClassNameComponent foo="bar" />);
//         applyClassNameWithComponentClasses = new ReactTestUtils.renderIntoDocument(
//             <ApplyClassNameComponent className="custom-class-name"/>
//         );
//     });
//
//     test("should return null if props are undefined and componentClasses is not a string", () => {
//         expect(applyClassNameWithEmptyComponentClasses.generateClassNames()).toBe(null);
//     });
//
//     test("should return null if componentClasses are not a string and no className prop is passed", () => {
//         expect(applyClassNameWithProps.generateClassNames()).toBe(null);
//     });
//
//     test("should return componentClasses if componentClasses is a string and no props are passed", () => {
//         expect(applyClassNameWithEmptyComponentClasses.generateClassNames("component-classes")).toBe("component-classes");
//     });
//
//     test("should return componentClasses if componentClasses is a string and no className prop is passed", () => {
//         expect(applyClassNameWithProps.generateClassNames("component-classes")).toBe("component-classes");
//     });
//
//     test("should combine component classes and className props if both are passed", () => {
//         expect(applyClassNameWithComponentClasses.generateClassNames("component-classes")).toBe("component-classes custom-class-name");
//         expect(applyClassNameWithComponentClasses.generateClassNames(" component-classes")).toBe("component-classes custom-class-name");
//         expect(applyClassNameWithComponentClasses.generateClassNames(" component-classes ")).toBe("component-classes custom-class-name");
//         expect(
//             applyClassNameWithComponentClasses.generateClassNames(" component-classes       ")
//         ).toBe("component-classes custom-class-name");
//         expect(
//             new ReactTestUtils.renderIntoDocument(
//                 <ApplyClassNameComponent className="   custom-class-name   "/>
//             ).generateClassNames(" component-classes     ")
//         ).toBe("component-classes custom-class-name");
//     });
// });
