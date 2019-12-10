import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import BaseCSSEditor from "./editor";
import { CSSEditor } from "./";
import { CSSEditorClassNameContract } from "./editor.style";
import { CSSColor } from "../css-editor/color";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("CSSEditor", () => {
    const managedClasses: CSSEditorClassNameContract = {
        cssEditor: "cssEditor-class",
    };

    test("should not throw", () => {
        expect(() => {
            shallow(<CSSEditor />);
        }).not.toThrow();
    });
    test("should have a displayName that matches the component name", () => {
        expect((BaseCSSEditor as any).name).toBe(BaseCSSEditor.displayName);
    });
    test("should call a registered callback after a change event", () => {
        const onChange: any = jest.fn();
        const data: any = {
            css: {
                margin: "10px",
                padding: "20px",
                background: "#FFF",
            },
        };
        const rendered: any = mount(
            <BaseCSSEditor
                managedClasses={managedClasses}
                data={data}
                onChange={onChange}
            />
        );

        rendered
            .find(CSSColor.displayName)
            .find("input")
            .at(1)
            .simulate("change", { target: { value: "#FFF" } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toEqual(Object.assign(data, { color: "#FFF" }));
    });
});
