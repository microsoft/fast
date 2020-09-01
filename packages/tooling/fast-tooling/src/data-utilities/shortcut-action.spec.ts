import { ShortcutAction } from "./shortcut-action";

describe("ShortcutAction", () => {
    test("should not throw", () => {
        expect(() => {
            new ShortcutAction({
                id: "foo",
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
            id: "foo",
            name: "Foo",
            keys: [],
            action,
        });
        if (shortcutAction.matches({ metaKey: true } as KeyboardEvent)) {
            shortcutAction.invoke();
        }

        expect(action).not.toHaveBeenCalled();
    });
    test("should run an action if supplied actions match registered actions", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [],
            action,
        });
        if (shortcutAction.matches({} as KeyboardEvent)) {
            shortcutAction.invoke();
        }

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should not run an action if modifier keys do not match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [
                {
                    metaKey: true,
                },
            ],
            action,
        });
        if (
            shortcutAction.matches({
                shiftKey: true,
            } as KeyboardEvent)
        ) {
            shortcutAction.invoke();
        }

        expect(action).not.toHaveBeenCalled();
    });
    test("should run an action if meta modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [
                {
                    metaKey: true,
                },
            ],
            action,
        });
        if (
            shortcutAction.matches({
                metaKey: true,
            } as KeyboardEvent)
        ) {
            shortcutAction.invoke();
        }

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should run an action if shift modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [
                {
                    shiftKey: true,
                },
            ],
            action,
        });
        if (
            shortcutAction.matches({
                shiftKey: true,
            } as KeyboardEvent)
        ) {
            shortcutAction.invoke();
        }

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should run an action if ctrl modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [
                {
                    ctrlKey: true,
                },
            ],
            action,
        });
        if (
            shortcutAction.matches({
                ctrlKey: true,
            } as KeyboardEvent)
        ) {
            shortcutAction.invoke();
        }

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should run an action if alt modifier keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [
                {
                    altKey: true,
                },
            ],
            action,
        });
        if (
            shortcutAction.matches({
                altKey: true,
            } as KeyboardEvent)
        ) {
            shortcutAction.invoke();
        }

        expect(action).toHaveBeenCalledTimes(1);
    });
    test("should not run an action if specific keys do not match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [
                {
                    value: "f",
                },
            ],
            action,
        });
        if (
            shortcutAction.matches({
                key: "b",
            } as KeyboardEvent)
        ) {
            shortcutAction.invoke();
        }

        expect(action).not.toHaveBeenCalled();
    });
    test("should run an action if specific keys match", () => {
        const action = jest.fn();
        const shortcutAction = new ShortcutAction({
            id: "foo",
            name: "Foo",
            keys: [
                {
                    value: "a",
                },
            ],
            action,
        });
        if (
            shortcutAction.matches({
                key: "a",
            } as KeyboardEvent)
        ) {
            shortcutAction.invoke();
        }

        expect(action).toHaveBeenCalledTimes(1);
    });
});
