import SheetManager from "./sheet-manager";
import { ComponentStyles } from "@microsoft/fast-jss-manager";

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

    test("should not be able to retrieve a stylesheet after it has been removed", (): void => {
        manager.add(stylesheet, designSystem);
        manager.remove(stylesheet, designSystem);

        expect(manager.get(stylesheet, designSystem)).toBeUndefined();
    });

    test("should remove a sheet when it is only added once and is then updated", (): void => {
        const nextDesignSystem: any = { foregroundColor: "red" };

        manager.add(stylesheet, designSystem);
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
});
