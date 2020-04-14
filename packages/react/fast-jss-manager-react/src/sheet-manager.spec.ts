import { ComponentStyles } from "@microsoft/fast-jss-manager";
import SheetManager from "./sheet-manager";

describe("The SheetManager", (): void => {
    const stylesheet: ComponentStyles<any, any> = {
        button: {
            color: "blue",
        },
    };

    const designSystem: any = {
        foreground: "blue",
    };

    const manager: SheetManager = new SheetManager();

    beforeEach(() => {
        manager.clean();
    });

    test("should be able to retrieve a stylesheet after it has been added", (): void => {
        manager.add(stylesheet, designSystem);

        expect(manager.get(stylesheet, designSystem)).not.toBeUndefined();
    });

    test("should count the number of times a stylesheet has been added", (): void => {
        manager.add(stylesheet, designSystem);

        expect(manager.count(stylesheet, designSystem)).toBe(1);

        manager.add(stylesheet, designSystem);

        expect(manager.count(stylesheet, designSystem)).toBe(2);
    });

    test("should return -1 from count if no instances exist", () => {
        expect(manager.count(stylesheet, designSystem)).toBe(-1);
    });

    test("should not be able to retrieve a stylesheet after it has been removed", (): void => {
        manager.add(stylesheet, designSystem);
        manager.remove(stylesheet, designSystem);

        expect(manager.get(stylesheet, designSystem)).toBeUndefined();
    });

    test("should not throw if updated with data that has not been previously added", () => {
        expect(() => {
            manager.update(stylesheet, designSystem, {});
        }).not.toThrow();
    });

    test("should remove a sheet when it has been updated with a different design system", (): void => {
        const nextDesignSystem: any = { foregroundColor: "red" };

        manager.add(stylesheet, designSystem);
        manager.update(stylesheet, designSystem, nextDesignSystem);

        expect(manager.get(stylesheet, designSystem)).toBeUndefined();
    });

    test("should add a sheet after it has been updated with a different design system", (): void => {
        const nextDesignSystem: any = { foregroundColor: "red" };

        manager.add(stylesheet, designSystem);
        manager.add(stylesheet, designSystem);
        manager.update(stylesheet, designSystem, nextDesignSystem);

        expect(manager.get(stylesheet, designSystem)).toBeDefined();
    });

    test("should remove a sheet when it has been updated as many times as it has been added", (): void => {
        const nextDesignSystem: any = { foregroundColor: "red" };

        manager.add(stylesheet, designSystem);
        manager.add(stylesheet, designSystem);

        manager.update(stylesheet, designSystem, nextDesignSystem);
        manager.update(stylesheet, designSystem, nextDesignSystem);

        expect(manager.get(stylesheet, designSystem)).toBeUndefined();
    });

    test("should not remove a sheet on update when it has been added multiple times", (): void => {
        const nextDesignSystem: any = { foregroundColor: "red" };

        manager.add(stylesheet, designSystem);
        manager.add(stylesheet, designSystem);

        manager.update(stylesheet, designSystem, nextDesignSystem);

        expect(manager.get(stylesheet, designSystem)).not.toBeUndefined();
    });

    test("should notify a subscriber when a sheet is added", () => {
        const subscriber = jest.fn();
        manager.subscribe(subscriber);

        manager.add(stylesheet, designSystem);

        const arg = subscriber.mock.calls[0][0];

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(arg.type).toBe("add");
        expect(arg.sheet).toBe(manager.get(stylesheet, designSystem));
    });

    test("should not re-notify when the same sheet/design-system pair is added", () => {
        const subscriber = jest.fn();
        manager.subscribe(subscriber);
        manager.add(stylesheet, designSystem);
        manager.add(stylesheet, designSystem);

        const arg = subscriber.mock.calls[0][0];

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(arg.type).toBe("add");
        expect(arg.sheet).toBe(manager.get(stylesheet, designSystem));
    });

    test("should notify a subscriber when a sheet is removed", () => {
        const subscriber = jest.fn();
        manager.add(stylesheet, designSystem);
        const sheet = manager.get(stylesheet, designSystem);
        manager.subscribe(subscriber);

        manager.remove(stylesheet, designSystem);
        const arg = subscriber.mock.calls[0][0];

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(arg.type).toBe("remove");
        expect(arg.sheet).toBe(sheet);
    });

    test("should only notify subscribers of removal when the last instance of the sheet is removed", () => {
        const subscriber = jest.fn();
        manager.add(stylesheet, designSystem);
        manager.add(stylesheet, designSystem);
        const sheet = manager.get(stylesheet, designSystem);
        manager.subscribe(subscriber);

        manager.remove(stylesheet, designSystem);
        expect(subscriber).toHaveBeenCalledTimes(0);

        manager.remove(stylesheet, designSystem);
        const arg = subscriber.mock.calls[0][0];

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(arg.type).toBe("remove");
        expect(arg.sheet).toBe(sheet);
    });

    test("should notify a subscriber when a sheet is updated", () => {
        const subscriber = jest.fn();
        manager.add(stylesheet, designSystem);
        const sheet = manager.get(stylesheet, designSystem);
        manager.subscribe(subscriber);

        manager.update(stylesheet, designSystem, {});
        const arg = subscriber.mock.calls[0][0];

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(arg.type).toBe("update");
        expect(arg.sheet).toBe(sheet);
    });

    test("should notify multiple subscribers", () => {
        const A = jest.fn();
        const B = jest.fn();
        const designSystemUpdate = {};
        manager.subscribe(A);
        manager.subscribe(B);

        manager.add(stylesheet, designSystem);

        expect(A).toHaveBeenCalledTimes(1);
        expect(B).toHaveBeenCalledTimes(1);

        manager.update(stylesheet, designSystem, designSystemUpdate);

        expect(A).toHaveBeenCalledTimes(2);
        expect(B).toHaveBeenCalledTimes(2);

        manager.remove(stylesheet, designSystemUpdate);

        expect(A).toHaveBeenCalledTimes(3);
        expect(B).toHaveBeenCalledTimes(3);
    });

    test("should not notify a subscriber after it has been unsubscribed", () => {
        const subscriber = jest.fn();
        manager.subscribe(subscriber);
        manager.unsubscribe(subscriber);

        manager.add(stylesheet, designSystem);

        expect(subscriber).toHaveBeenCalledTimes(0);
    });

    test("subscribe should return a function that unsubscribes the subscriber", () => {
        const subscriber = jest.fn();
        const unsubscribe = manager.subscribe(subscriber);

        unsubscribe();

        manager.add(stylesheet, designSystem);

        expect(subscriber).toHaveBeenCalledTimes(0);
    });
});
