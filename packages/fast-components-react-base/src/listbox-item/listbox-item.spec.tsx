import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import ListboxItem, {
    ListboxItemHandledProps,
    ListboxItemProps,
    ListboxItemUnhandledProps,
} from "./listbox-item";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { noop } from "lodash-es";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("listbox item", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((ListboxItem as any).name).toBe(ListboxItem.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ListboxItem />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ListboxItemUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<ListboxItem {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should apply a default role of 'option'", (): void => {
        const rendered: any = shallow(<ListboxItem />);

        expect(rendered.first().prop("role")).toEqual("option");
    });

    test("should apply aria-disabled when disabled", (): void => {
        const rendered: any = shallow(<ListboxItem disabled={true} />);

        expect(rendered.first().prop("aria-disabled")).toEqual(true);
    });

    test("should call a registered callback after a click event", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(<ListboxItem onInvoke={onInvoke} />);

        rendered.simulate("click");

        expect(onInvoke).toHaveBeenCalledTimes(1);
    });

    test("should not call a registered callback after a click event because it is disabled", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(
            <ListboxItem onInvoke={onInvoke} disabled={true} />
        );

        rendered.simulate("click");

        expect(onInvoke).toHaveBeenCalledTimes(0);
    });

    test("should call a registered callback after spacebar is pressed", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(<ListboxItem onInvoke={onInvoke} />);

        rendered.simulate("keydown", { keyCode: KeyCodes.space, preventDefault: noop });

        expect(onInvoke).toHaveBeenCalledTimes(1);
    });

    test("should call a registered callback after enter key is pressed", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(<ListboxItem onInvoke={onInvoke} />);

        rendered.simulate("keydown", { keyCode: KeyCodes.enter, preventDefault: noop });

        expect(onInvoke).toHaveBeenCalledTimes(1);
    });

    test("should not call a registered callback after enter key is pressed because it is disabled", (): void => {
        const onInvoke: any = jest.fn();
        const rendered: any = shallow(
            <ListboxItem onInvoke={onInvoke} disabled={true} />
        );

        rendered.simulate("keydown", { keyCode: KeyCodes.enter, preventDefault: noop });

        expect(onInvoke).toHaveBeenCalledTimes(0);
    });

    // parametrized listbox-item class name tests
    [
        {
            name: "should correctly assign className from input props",
            listboxItemHandledProps: {} as ListboxItemHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled and root class name is empty",
            listboxItemHandledProps: {
                disabled: true,
            } as ListboxItemHandledProps,
            className: "",
            expectedClassName: null,
        },
        {
            name: "should correctly assign className when is disabled",
            listboxItemHandledProps: {
                disabled: true,
            } as ListboxItemHandledProps,
            className: "class-name",
            expectedClassName: "class-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name not present) and managed class given",
            listboxItemHandledProps: {
                disabled: true,
                managedClasses: {
                    listboxItem: "listbox-item-class",
                },
            } as ListboxItemHandledProps,
            className: "",
            expectedClassName: "listbox-item-class",
        },
        {
            name:
                "should correctly assign className when is disabled (name present) and managed class given",
            listboxItemHandledProps: {
                disabled: true,
                managedClasses: {
                    listboxItem: "listbox-item-class",
                    listboxItem__disabled: "disabled",
                },
            } as ListboxItemHandledProps,
            className: "",
            expectedClassName: "listbox-item-class disabled",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed and root class name present",
            listboxItemHandledProps: {
                disabled: true,
                managedClasses: {
                    listboxItem: "listbox-item-name",
                    listboxItem__disabled: "disabled",
                },
            } as ListboxItemHandledProps,
            className: "root-name",
            expectedClassName: "listbox-item-name disabled root-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed, root class name present, role not",
            listboxItemHandledProps: {
                disabled: true,
                role: "option",
                value: "test value",
                id: "itemId",
                managedClasses: {
                    listboxItem: "listbox-item-name",
                    listboxItem__disabled: "disabled",
                },
            } as ListboxItemHandledProps,
            className: "root-name",
            expectedClassName: "listbox-item-name disabled root-name",
        },
        {
            name:
                "should correctly assign className when is disabled (name present), managed, root class name present, role not",
            listboxItemHandledProps: {
                disabled: true,
                role: "option",
                value: "test value",
                id: "itemId",
                managedClasses: {
                    listboxItem: "listbox-item-name",
                },
            } as ListboxItemHandledProps,
            className: "root-name",
            expectedClassName: "listbox-item-name root-name",
        },
    ].forEach(({ name, listboxItemHandledProps, className, expectedClassName }: any) => {
        test(name, () => {
            const props: ListboxItemProps = { ...listboxItemHandledProps };

            const rendered: any = shallow(
                <ListboxItem {...props} className={className} />
            );

            expect(rendered.prop("className")).toEqual(expectedClassName);
        });
    });
});
