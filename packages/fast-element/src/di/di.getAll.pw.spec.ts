import { expect, test } from "@playwright/test";

test.describe("Container#.getAll", () => {
    test.describe("good", () => {
        // eslint-disable
        for (const searchAncestors of [true, false])
            for (const regInChild of [true, false])
                for (const regInParent of [true, false]) {
                    // eslint-enable
                    test(`@all(_, ${searchAncestors}) + [child ${regInChild}] + [parent ${regInParent}]`, async ({
                        page,
                    }) => {
                        await page.goto("/");

                        const result = await page.evaluate(
                            async ({ searchAncestors, regInChild, regInParent }) => {
                                // @ts-expect-error Client side module.
                                const { DI, all, Registration } = await import(
                                    "./main.js"
                                );

                                class Foo {
                                    public constructor(public readonly test: string[]) {}
                                }
                                all("test", searchAncestors)(Foo, undefined, 0);

                                const container = DI.createContainer();
                                const child = container.createChild();
                                if (regInParent) {
                                    container.register(
                                        Registration.instance("test", "test1")
                                    );
                                }
                                if (regInChild) {
                                    child.register(
                                        Registration.instance("test", "test0")
                                    );
                                }
                                const expectation: string[] = regInChild ? ["test0"] : [];
                                if (regInParent && (searchAncestors || !regInChild)) {
                                    expectation.push("test1");
                                }
                                return {
                                    actual: child.get(Foo).test,
                                    expected: expectation,
                                };
                            },
                            { searchAncestors, regInChild, regInParent }
                        );

                        expect(result.actual).toEqual(result.expected);
                    });
                }
    });

    test.describe("realistic usage", () => {
        // eslint-disable
        for (const searchAncestors of [true, false])
            for (const regInChild of [true, false])
                for (const regInParent of [true, false]) {
                    // eslint-enable
                    test(`@all(IAttrPattern, ${searchAncestors}) + [child ${regInChild}] + [parent ${regInParent}]`, async ({
                        page,
                    }) => {
                        await page.goto("/");

                        const result = await page.evaluate(
                            async ({ searchAncestors, regInChild, regInParent }) => {
                                // @ts-expect-error Client side module.
                                const { DI, all, Registration } = await import(
                                    "./main.js"
                                );

                                interface IAttrPattern {
                                    id: number;
                                }

                                const IAttrPattern =
                                    DI.createContext<IAttrPattern>("IAttrPattern");

                                class Foo {
                                    public constructor(
                                        public readonly attrPatterns: IAttrPattern[]
                                    ) {}
                                    public patterns(): number[] {
                                        return this.attrPatterns.map(ap => ap.id);
                                    }
                                }
                                all(IAttrPattern, searchAncestors)(Foo, undefined, 0);

                                const container = DI.createContainer();
                                const child = container.createChild();
                                if (regInParent) {
                                    Array.from(
                                        { length: 5 },
                                        (_, idx) =>
                                            class implements IAttrPattern {
                                                public static register(c: any): void {
                                                    Registration.singleton(
                                                        IAttrPattern,
                                                        this
                                                    ).register(c);
                                                }
                                                public id: number = idx;
                                            }
                                    ).forEach(klass => container.register(klass));
                                }
                                if (regInChild) {
                                    Array.from(
                                        { length: 5 },
                                        (_, idx) =>
                                            class implements IAttrPattern {
                                                public static register(c: any): void {
                                                    Registration.singleton(
                                                        IAttrPattern,
                                                        this
                                                    ).register(c);
                                                }
                                                public id: number = idx + 5;
                                            }
                                    ).forEach(klass => child.register(klass));
                                }
                                let parentExpectation: number[] = [];
                                const childExpectation = regInChild
                                    ? [5, 6, 7, 8, 9]
                                    : [];

                                if (regInParent) {
                                    if (searchAncestors || !regInChild) {
                                        childExpectation.push(0, 1, 2, 3, 4);
                                    }
                                    parentExpectation.push(0, 1, 2, 3, 4);
                                }

                                if (regInChild) {
                                    parentExpectation = childExpectation;
                                }

                                return {
                                    childActual: child.get(Foo).patterns(),
                                    childExpected: childExpectation,
                                    parentActual: container.get(Foo).patterns(),
                                    parentExpected: parentExpectation,
                                };
                            },
                            { searchAncestors, regInChild, regInParent }
                        );

                        expect(result.childActual).toEqual(result.childExpected);

                        expect(result.parentActual).toEqual(result.parentExpected);
                    });
                }
    });
});
