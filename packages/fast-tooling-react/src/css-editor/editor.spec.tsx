import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import BaseCSSEditor from "./editor";
import { CSSEditor, PositionValue, SpacingType } from "./";
import { SpacingProperty } from "./spacing";
import { CSSEditorClassNameContract } from "./editor.style";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSEditor", () => {
    const managedClasses: CSSEditorClassNameContract = {
        cssEditor: "cssEditor-class",
        cssEditor_form: "cssEditor_form-class",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSEditor />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((BaseCSSEditor as any).name).toBe(BaseCSSEditor.displayName);
    });
    test("should call a registerd callback after a change event", () => {
        const inputSelector: string = `.${managedClasses.cssEditor_form}`;
        const onChange: any = jest.fn();
        const controlled: any = shallow(
            <BaseCSSEditor managedClasses={managedClasses} onChange={onChange} />
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
