import { ShortcutAction } from "./shortcut-action";

describe("ShortcutAction", () => {
    test("should not throw", () => {
        expect(() => {
            new ShortcutAction({
                name: "Foo",
                keys: [],
                action: () => {
                    return;
                },
            });
        }).not.toThrow();
    });
    test("should not run an action if supplied action lengths do not match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [],
            action,
        });
        shortcutAction.runAction([{ metaKey: true }]);

        expect(action).not.toHaveBeenCalled();
    });
    test("should run an action if supplied actions match registered actions", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [],
            action,
        });
        shortcutAction.runAction([]);

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should not run an action if modifier keys do not match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [
                {
                    metaKey: true,
                },
            ],
            action,
        });
        shortcutAction.runAction([
            {
                shiftKey: true,
            },
        ]);

        expect(action).not.toHaveBeenCalled();
    });
    test("should run an action if meta modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [
                {
                    metaKey: true,
                },
            ],
            action,
        });
        shortcutAction.runAction([
            {
                metaKey: true,
            },
        ]);

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should run an action if shift modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [
                {
                    shiftKey: true,
                },
            ],
            action,
        });
        shortcutAction.runAction([
            {
                shiftKey: true,
            },
        ]);

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should run an action if ctrl modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [
                {
                    ctrlKey: true,
                },
            ],
            action,
        });
        shortcutAction.runAction([
            {
                ctrlKey: true,
            },
        ]);

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should run an action if alt modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [
                {
                    altKey: true,
                },
            ],
            action,
        });
        shortcutAction.runAction([
            {
                altKey: true,
            },
        ]);

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should not run an action if specific keys do not match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [
                {
                    value: "f",
                },
            ],
            action,
        });
        shortcutAction.runAction([
            {
                value: "b",
            },
        ]);

        expect(action).not.toHaveBeenCalled();
    });
    test("should run an action if specific keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            name: "Foo",
            keys: [
                {
                    value: "a",
                },
            ],
            action,
        });
        shortcutAction.runAction([
            {
                value: "a",
            },
        ]);

        expect(action).toHaveBeenCalledTimes(1);
    });
});
