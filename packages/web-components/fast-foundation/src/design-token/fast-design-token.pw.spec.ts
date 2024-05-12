/* eslint-disable @typescript-eslint/no-empty-function */
import type {
    css as FASTcss,
    FASTElement,
    Observable as FASTObservable,
    Updates as FASTUpdates,
} from "@microsoft/fast-element";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { DesignTokenResolver } from "./core/design-token-node.js";
import type {
    CSSDesignToken as CSSDesignTokenImpl,
    DesignToken as DesignTokenImpl,
    DesignTokenSubscriber,
} from "./fast-design-token.js";

interface Spy extends Function {
    calls: number;
    calledWith(n: number): any;
}

declare const DesignToken: typeof DesignTokenImpl;
declare const CSSDesignToken: typeof CSSDesignTokenImpl;
declare const createElement: () => FASTElement;
declare const addElement: (parent?: Element) => FASTElement;
declare const Updates: typeof FASTUpdates;
declare const css: typeof FASTcss;
declare const threw: (fn: () => void) => boolean;
declare const cleanup: () => void;
declare const Observable: typeof FASTObservable;
declare const spy: <T extends (...args: any[]) => any>(fn: T) => Spy & T;

function* nameGenerator(): Generator<string> {
    let i = 0;

    while (true) {
        yield `token-name-${i}`;
        i++;
    }
}
const gen = nameGenerator();

function uniqueTokenName(): string {
    return gen.next().value;
}

// Test utilities

test.describe("A DesignToken", () => {
    let page: Page;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        root = page.locator("#root");

        await page.goto(fixtureURL("debug-designtoken--design-token"));
        await page.evaluate(() => DesignToken.registerDefaultStyleTarget());
    });
    test.afterAll(async () => {
        await page.evaluate(() => DesignToken.registerDefaultStyleTarget());
        await page.close();
    });

    test.afterEach(async () => {
        await page.evaluate(() => cleanup());
    });

    test("should support declared types", async () => {
        await page.evaluate((name: string) => {
            const number = DesignToken.create<number>(name);
            const nil = DesignToken.create<null>(name);
            const bool = DesignToken.create<boolean>(name);
            const arr = DesignToken.create<number[]>(name);
            const obj = DesignToken.create<{}>(name);
            class Foo {}
            const _class = DesignToken.create<Foo>(name);
            const sym = DesignToken.create<symbol>(name);
        }, uniqueTokenName());
    });

    test.describe("should have a create method", () => {
        test("that creates a CSSDesignToken when invoked with a string value", async () => {
            const result = await page.evaluate(
                (name: string) => DesignToken.create(name) instanceof CSSDesignToken,
                uniqueTokenName()
            );

            expect(result).toBe(true);
        });
        test("that creates a CSSDesignToken when invoked with a CSSDesignTokenConfiguration", async () => {
            const result = await page.evaluate(
                (name: string) =>
                    DesignToken.create({
                        name: name,
                        cssCustomPropertyName: "css",
                    }) instanceof CSSDesignToken,
                uniqueTokenName()
            );
            expect(result).toBe(true);
        });
        test("that creates a DesignToken when invoked with a DesignTokenConfiguration", async () => {
            const result = await page.evaluate(
                (name: string) => DesignToken.create({ name }) instanceof CSSDesignToken,
                uniqueTokenName()
            );

            expect(result).toBe(false);
        });
    });

    test.describe("that is not a CSSDesignToken", () => {
        test("should not have a cssCustomProperty property", async () => {
            const result = await page.evaluate((name: string) => {
                return "cssCustomProperty" in DesignToken.create<number>({ name });
            }, uniqueTokenName());

            expect(result).toEqual(false);
        });
        test("should not have a cssVar property", async () => {
            const result = await page.evaluate((name: string) => {
                return "cssVar" in DesignToken.create<number>({ name });
            }, uniqueTokenName());
            expect(result).toEqual(false);
        });
    });
    test.describe("getting and setting a simple value", () => {
        test("should throw if the token value has never been set on the element or its ancestors", async () => {
            const result = await page.evaluate((name: string) => {
                const target = addElement();
                const token = DesignToken.create<number>(name);
                return threw(() => token.getValueFor(target));
            }, uniqueTokenName());

            expect(result).toBe(true);
        });

        test("should return the value set for the element if one has been set", async () => {
            const result = await page.evaluate((name: string) => {
                const target = addElement();
                const token = DesignToken.create<number>(name);
                token.setValueFor(target, 12);
                return token.getValueFor(target);
            }, uniqueTokenName());

            expect(result).toEqual(12);
        });

        test("should return the value set for an ancestor if a value has not been set for the target", async () => {
            const result = await page.evaluate((name: string) => {
                const ancestor = addElement();
                const target = addElement(ancestor);
                const token = DesignToken.create<number>(name);
                token.setValueFor(ancestor, 12);
                return token.getValueFor(target);
            }, uniqueTokenName());

            expect(result).toEqual(12);
        });

        test("sound return the nearest ancestor's value after an intermediary value is set where no value was set prior", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const name = uniqueTokenName();
                    const grandParent = addElement();
                    const parent = addElement(grandParent);
                    const target = addElement(parent);
                    const token = DesignToken.create<number>(name);
                    token.setValueFor(grandParent, 12);

                    results.push(token.getValueFor(grandParent));

                    token.setValueFor(parent, 14);
                    results.push(token.getValueFor(target));
                    return results;
                })
            ).toEqual([12, 14]);
        });

        test("should return the new ancestor's value after being re-parented", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const token = DesignToken.create<number>(uniqueTokenName());
                    const parentA = addElement();
                    const parentB = addElement();
                    const target = addElement(parentA);

                    token.setValueFor(parentA, 12);
                    token.setValueFor(parentB, 14);

                    results.push(token.getValueFor(target));

                    parentA.removeChild(target);
                    parentB.appendChild(target);

                    results.push(token.getValueFor(target));
                    return results;
                })
            ).toEqual([12, 14]);
        });

        test("should persist explicitly set value even if it matches the inherited value", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const ancestor = addElement();
                    const target = addElement(ancestor);
                    const token = DesignToken.create<number>(uniqueTokenName());
                    token.setValueFor(ancestor, 12);
                    token.setValueFor(target, 12);

                    results.push(token.getValueFor(target));

                    token.setValueFor(ancestor, 14);

                    await Updates.next();

                    results.push(token.getValueFor(target));
                    return results;
                })
            ).toEqual([12, 12]);
        });

        test("should support getting and setting falsey values", async () => {
            expect(
                await page.evaluate(() => {
                    const target = addElement();

                    return [false, null, 0, "", NaN]
                        .map(value => {
                            const token = DesignToken.create<typeof value>(
                                uniqueTokenName()
                            );
                            token.setValueFor(target, value);

                            if (typeof value === "number" && isNaN(value)) {
                                return (
                                    isNaN(token.getValueFor(target) as number) === true
                                );
                            } else {
                                return token.getValueFor(target) === value;
                            }
                        })
                        .every(x => x === true);
                })
            ).toBe(true);
        });

        test.describe("that is a CSSDesignToken", () => {
            test("should set the CSS custom property for the element", async () => {
                expect(
                    await page.evaluate(async () => {
                        const target = addElement();
                        const token = DesignToken.create<number>(uniqueTokenName());
                        token.setValueFor(target, 12);
                        await Updates.next();
                        return window
                            .getComputedStyle(target)
                            .getPropertyValue(token.cssCustomProperty);
                    })
                ).toBe("12");
            });
            test("should be a CSSDirective", async () => {
                expect(
                    await page.evaluate(async () => {
                        const token = DesignToken.create<number>(
                            uniqueTokenName()
                        ).withDefault(12);
                        const sheet = css`
                            :host {
                                --property: ${token};
                            }
                        `;
                        const element = addElement();
                        element.$fastController.addStyles(sheet);

                        await Updates.next();
                        return window
                            .getComputedStyle(element)
                            .getPropertyValue("--property")
                            .trim();
                    })
                ).toBe("12");
            });

            test("should inherit CSS custom property from ancestor", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const ancestor = addElement();
                        const target = addElement(ancestor);
                        const token = DesignToken.create<number>(uniqueTokenName());
                        token.setValueFor(ancestor, 12);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(token.cssCustomProperty)
                        );
                        token.setValueFor(ancestor, 14);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(token.cssCustomProperty)
                        );
                        return results;
                    })
                ).toEqual(["12", "14"]);
            });

            test("should set CSS custom property for element if value stops matching inherited value", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const ancestor = addElement();
                        const target = addElement(ancestor);
                        const token = DesignToken.create<number>(uniqueTokenName());
                        token.setValueFor(ancestor, 12);
                        token.setValueFor(target, 12);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(token.cssCustomProperty)
                        );
                        token.setValueFor(ancestor, 14);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(token.cssCustomProperty)
                        );
                        return results;
                    })
                ).toEqual(["12", "12"]);
            });
        });
        test.describe("that is not a CSSDesignToken", () => {
            test("should not set a CSS custom property for the element", async () => {
                expect(
                    await page.evaluate(() => {
                        const name = uniqueTokenName();
                        const target = addElement();
                        const token = DesignToken.create<number>({ name });
                        token.setValueFor(target, 12);
                        return window
                            .getComputedStyle(target)
                            .getPropertyValue(`--${name}`);
                    })
                ).toBe("");
            });
        });
    });

    test.describe("getting and setting derived values", () => {
        test("should get the return value of a derived value", async () => {
            const name = uniqueTokenName();
            expect(
                await page.evaluate((name: string) => {
                    const target = addElement();
                    const token = DesignToken.create<number>(name);
                    token.setValueFor(target, () => 12);

                    return token.getValueFor(target);
                }, name)
            ).toBe(12);
        });
        test("should get an updated value when observable properties used in a derived property are changed", async () => {
            const name = uniqueTokenName();
            expect(
                await page.evaluate(async (name: string) => {
                    const target = addElement();
                    const token = DesignToken.create<number>(name);
                    const results = [];
                    const dependencies: { value: number } = {} as { value: number };
                    Observable.defineProperty(dependencies, "value");
                    dependencies.value = 6;

                    token.setValueFor(target, () => dependencies.value * 2);
                    results.push(token.getValueFor(target));

                    dependencies.value = 7;
                    await Updates.next();

                    results.push(token.getValueFor(target));
                    return results;
                }, name)
            ).toEqual([12, 14]);
        });

        test("should get an updated value when other design tokens used in a derived property are changed", async () => {
            expect(
                await page.evaluate(async () => {
                    const target = addElement();
                    const results = [];
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    tokenA.setValueFor(target, 6);
                    tokenB.setValueFor(target, resolve => resolve(tokenA) * 2);

                    results.push(tokenB.getValueFor(target));
                    tokenA.setValueFor(target, 7);
                    await Updates.next();

                    results.push(tokenB.getValueFor(target));
                    return results;
                })
            ).toEqual([12, 14]);
        });
        test("should use the closest value of a dependent token when getting a token for a target", async () => {
            expect(
                await page.evaluate(async () => {
                    const ancestor = addElement();
                    const parent = addElement(ancestor);
                    const target = addElement(parent);
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    tokenA.setValueFor(ancestor, 7);
                    tokenA.setValueFor(parent, 6);
                    tokenB.setValueFor(ancestor, resolve => resolve(tokenA) * 2);

                    return tokenB.getValueFor(target);
                })
            ).toBe(12);
        });

        test("should update value of a dependent token when getting a token for a target", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const ancestor = addElement();
                    const parent = addElement(ancestor);
                    const target = addElement(parent);
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    tokenA.setValueFor(ancestor, 7);
                    tokenA.setValueFor(parent, 6);
                    tokenB.setValueFor(ancestor, resolve => resolve(tokenA) * 2);

                    results.push(tokenB.getValueFor(target));

                    tokenA.setValueFor(parent, 7);
                    await Updates.next();

                    results.push(tokenB.getValueFor(target));
                    return results;
                })
            ).toEqual([12, 14]);
        });

        test("should get an updated value when a used design token is set for a node closer to the target", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const ancestor = addElement();
                    const parent = addElement(ancestor);
                    const target = addElement(parent);
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    tokenA.setValueFor(ancestor, 6);
                    tokenB.setValueFor(ancestor, resolve => resolve(tokenA) * 2);

                    results.push(tokenB.getValueFor(target));

                    tokenA.setValueFor(target, 7);
                    results.push(tokenB.getValueFor(target));

                    return results;
                })
            ).toEqual([12, 14]);
        });

        test.describe("that is a CSSDesignToken", () => {
            test("should set a CSS custom property equal to the resolved value of a derived token value", async () => {
                expect(
                    await page.evaluate(async () => {
                        const target = addElement();
                        const token = DesignToken.create<number>(uniqueTokenName());

                        token.setValueFor(target, target => 12);

                        await Updates.next();
                        return window
                            .getComputedStyle(target)
                            .getPropertyValue(token.cssCustomProperty);
                    })
                ).toBe("12");
            });
            test("should set a CSS custom property equal to the resolved value of a derived token value with a dependent token", async () => {
                expect(
                    await page.evaluate(async () => {
                        const target = addElement();
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const tokenB = DesignToken.create<number>(uniqueTokenName());

                        tokenA.setValueFor(target, 6);
                        tokenB.setValueFor(target, resolve => resolve(tokenA) * 2);

                        await Updates.next();

                        return window
                            .getComputedStyle(target)
                            .getPropertyValue(tokenB.cssCustomProperty);
                    })
                ).toBe("12");
            });

            test("should update a CSS custom property to the resolved value of a derived token value with a dependent token when the dependent token changes", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const target = addElement();
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const tokenB = DesignToken.create<number>(uniqueTokenName());

                        tokenA.setValueFor(target, 6);
                        tokenB.setValueFor(target, resolve => resolve(tokenA) * 2);

                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );

                        tokenA.setValueFor(target, 7);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );

                        return results;
                    })
                ).toEqual(["12", "14"]);
            });

            test("should set a CSS custom property equal to the resolved value for an element of a derived token value with a dependent token", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const parent = addElement();
                        const target = addElement(parent);
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const tokenB = DesignToken.create<number>(uniqueTokenName());

                        tokenA.setValueFor(parent, 6);
                        tokenB.setValueFor(parent, resolve => resolve(tokenA) * 2);
                        tokenA.setValueFor(target, 7);

                        await Updates.next();

                        results.push(
                            window
                                .getComputedStyle(parent)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );
                        return results;
                    })
                ).toEqual(["12", "14"]);
            });

            test("should set a CSS custom property equal to the resolved value for an element in a shadow DOM of a derived token value with a dependent token", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const parent = addElement();
                        const child = addElement(parent);
                        const target = createElement();
                        child.shadowRoot!.appendChild(target);
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const tokenB = DesignToken.create<number>(uniqueTokenName());

                        tokenA.setValueFor(parent, 6);
                        tokenB.setValueFor(parent, resolve => resolve(tokenA) * 2);
                        tokenA.setValueFor(target, 7);

                        await Updates.next();

                        results.push(
                            window
                                .getComputedStyle(parent)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );
                        return results;
                    })
                ).toEqual(["12", "14"]);
            });

            test("should set a CSS custom property equal to the resolved value for both elements for which a dependent token is set when setting a derived token value", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const parent = addElement();
                        const target = addElement(parent);
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const tokenB = DesignToken.create<number>(uniqueTokenName());

                        tokenA.setValueFor(parent, 6);
                        tokenA.setValueFor(target, 7);
                        tokenB.setValueFor(parent, resolve => resolve(tokenA) * 2);

                        await Updates.next();

                        results.push(
                            window
                                .getComputedStyle(parent)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );
                        return results;
                    })
                ).toEqual(["12", "14"]);
            });

            test("should revert a CSS custom property back to a previous value when the Design Token value is reverted", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const token = DesignToken.create<number>(uniqueTokenName());
                        const target = addElement();

                        token.setValueFor(target, 12);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(token.cssCustomProperty)
                        );

                        token.setValueFor(target, 14);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(token.cssCustomProperty)
                        );

                        token.setValueFor(target, 12);
                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(token.cssCustomProperty)
                        );

                        return results;
                    })
                ).toEqual(["12", "14", "12"]);
            });
        });

        test.describe("that is not a CSSDesignToken", () => {
            test("should not emit a CSS custom property", async () => {
                expect(
                    await page.evaluate(() => {
                        const target = addElement();
                        const token = DesignToken.create<number>({
                            name: uniqueTokenName(),
                        });

                        token.setValueFor(target, () => 12);

                        return window
                            .getComputedStyle(target)
                            .getPropertyValue(`--${token.name}`);
                    })
                ).toBe("");
            });
        });

        test("should support getting and setting falsey values", async () => {
            expect(
                await page.evaluate(() => {
                    const target = addElement();
                    return [false, null, 0, "", NaN]
                        .map(value => {
                            const token = DesignToken.create<typeof value>(
                                uniqueTokenName()
                            );
                            token.setValueFor(target, () => value as any);

                            if (typeof value === "number" && isNaN(value)) {
                                return (
                                    isNaN(token.getValueFor(target) as number) === true
                                );
                            } else {
                                return token.getValueFor(target) === value;
                            }
                        })
                        .every(x => x === true);
                })
            ).toBe(true);
        });
    });

    test.describe("getting and setting a token value", () => {
        test("should retrieve the value of the token it was set to", async () => {
            expect(
                await page.evaluate(() => {
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());
                    const target = addElement();

                    tokenA.setValueFor(target, 12);
                    tokenB.setValueFor(target, tokenA);

                    return tokenB.getValueFor(target);
                })
            ).toBe(12);
        });

        test("should update the value of the token it was set to when the token's value changes", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());
                    const target = addElement();

                    tokenA.setValueFor(target, 12);
                    tokenB.setValueFor(target, tokenA);

                    results.push(tokenB.getValueFor(target));

                    tokenA.setValueFor(target, 14);

                    results.push(tokenB.getValueFor(target));
                    return results;
                })
            ).toEqual([12, 14]);
        });
        test("should update the derived value of the token when a dependency of the derived value changes", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());
                    const tokenC = DesignToken.create<number>(uniqueTokenName());
                    const target = addElement();

                    tokenA.setValueFor(target, 6);
                    tokenB.setValueFor(target, resolve => resolve(tokenA) * 2);
                    tokenC.setValueFor(target, tokenB);

                    results.push(tokenC.getValueFor(target));

                    tokenA.setValueFor(target, 7);

                    results.push(tokenC.getValueFor(target));

                    return results;
                })
            ).toEqual([12, 14]);
        });

        test.describe("that is a CSSDesignToken", () => {
            test("should emit a CSS custom property", async () => {
                expect(
                    await page.evaluate(async () => {
                        const tokenA = DesignToken.create<number>("token-a");
                        const tokenB = DesignToken.create<number>("token-b");
                        const target = addElement();

                        tokenA.setValueFor(target, 12);
                        tokenB.setValueFor(target, tokenA);

                        await Updates.next();
                        return window
                            .getComputedStyle(target)
                            .getPropertyValue(tokenB.cssCustomProperty);
                    })
                );
            });
            test("should update the emitted CSS custom property when the token's value changes", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const tokenB = DesignToken.create<number>(uniqueTokenName());
                        const target = addElement();

                        tokenA.setValueFor(target, 12);
                        tokenB.setValueFor(target, tokenA);

                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );

                        tokenA.setValueFor(target, 14);

                        await Updates.next();

                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenB.cssCustomProperty)
                        );

                        return results;
                    })
                ).toEqual(["12", "14"]);
            });
            test("should update the emitted CSS custom property of a token assigned a derived value when the token dependency changes", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const tokenB = DesignToken.create<number>(uniqueTokenName());
                        const tokenC = DesignToken.create<number>(uniqueTokenName());
                        const target = addElement();

                        tokenA.setValueFor(target, 6);
                        tokenB.setValueFor(target, resolve => resolve(tokenA) * 2);
                        tokenC.setValueFor(target, tokenB);

                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenC.cssCustomProperty)
                        );

                        tokenA.setValueFor(target, 7);

                        await Updates.next();
                        results.push(
                            window
                                .getComputedStyle(target)
                                .getPropertyValue(tokenC.cssCustomProperty)
                        );

                        return results;
                    })
                ).toEqual(["12", "14"]);
            });

            test("should support accessing the token being assigned from the derived value, resolving to a parent value", async () => {
                expect(
                    await page.evaluate(async () => {
                        const results = [];
                        const tokenA = DesignToken.create<number>(uniqueTokenName());
                        const parent = addElement();
                        const child = addElement(parent);
                        const recipe = (resolve: DesignTokenResolver) =>
                            resolve(tokenA) * 2;
                        tokenA.setValueFor(parent, 12);
                        tokenA.setValueFor(child, recipe);

                        results.push(tokenA.getValueFor(parent));
                        results.push(tokenA.getValueFor(child));

                        return results;
                    })
                ).toEqual([12, 24]);
            });
        });
        test("should update the CSS custom property of a derived token with a dependency that is a derived token that depends on a third token", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());
                    const tokenC = DesignToken.create<number>(uniqueTokenName());
                    const grandparent = addElement();
                    const parent = addElement(grandparent);
                    const child = addElement(parent);

                    tokenA.setValueFor(grandparent, 3);
                    tokenB.setValueFor(grandparent, resolve => resolve(tokenA) * 2);
                    tokenC.setValueFor(grandparent, resolve => resolve(tokenB) * 2);

                    await Updates.next();

                    results.push(tokenC.getValueFor(child));
                    results.push(
                        window
                            .getComputedStyle(child)
                            .getPropertyValue(tokenC.cssCustomProperty)
                    );

                    tokenA.setValueFor(child, 4);

                    await Updates.next();
                    results.push(tokenC.getValueFor(child));
                    results.push(
                        window
                            .getComputedStyle(child)
                            .getPropertyValue(tokenC.cssCustomProperty)
                    );

                    return results;
                })
            ).toEqual([12, "12", 16, "16"]);
        });
    });
    test.describe("deleting simple values", () => {
        test("should throw when deleted and no parent token value is set", async () => {
            expect(
                await page.evaluate(() => {
                    const results = [];
                    const target = addElement();
                    const token = DesignToken.create<number>(uniqueTokenName());

                    token.setValueFor(target, 12);

                    results.push(token.getValueFor(target));

                    token.deleteValueFor(target);

                    results.push(threw(() => token.getValueFor(target)));
                    return results;
                })
            ).toEqual([12, true]);
        });
        test("should allow getting a value that was set upstream", async () => {
            expect(
                await page.evaluate(() => {
                    const results = [];
                    const parent = addElement();
                    const target = addElement(parent);
                    const token = DesignToken.create<number>(uniqueTokenName());

                    token.setValueFor(parent, 12);
                    token.setValueFor(target, 14);

                    results.push(token.getValueFor(target));

                    token.deleteValueFor(target);

                    results.push(token.getValueFor(target));
                    return results;
                })
            ).toEqual([14, 12]);
        });
    });
    test.describe("deleting derived values", () => {
        test("should throw when deleted and no parent token value is set", async () => {
            expect(
                await page.evaluate(() => {
                    const results = [];
                    const target = addElement();
                    const token = DesignToken.create<number>(uniqueTokenName());

                    token.setValueFor(target, () => 12);

                    results.push(token.getValueFor(target));

                    token.deleteValueFor(target);

                    results.push(threw(() => token.getValueFor(target)));
                    return results;
                })
            ).toEqual([12, true]);
        });
        test("should allow getting a value that was set upstream", async () => {
            expect(
                await page.evaluate(() => {
                    const results = [];
                    const parent = addElement();
                    const target = addElement(parent);
                    const token = DesignToken.create<number>(uniqueTokenName());

                    token.setValueFor(parent, () => 12);
                    token.setValueFor(target, () => 14);

                    results.push(token.getValueFor(target));

                    token.deleteValueFor(target);

                    results.push(token.getValueFor(target));
                    return results;
                })
            ).toEqual([14, 12]);
        });

        test("should cause dependent tokens to re-evaluate", async () => {
            expect(
                await page.evaluate(() => {
                    const results = [];
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());
                    const parent = addElement();
                    const target = addElement(parent);

                    tokenA.setValueFor(parent, 7);
                    tokenA.setValueFor(target, 6);
                    tokenB.setValueFor(target, resolve => resolve(tokenA) * 2);

                    results.push(tokenB.getValueFor(target));

                    tokenA.deleteValueFor(target);

                    results.push(tokenB.getValueFor(target));
                    return results;
                })
            ).toEqual([12, 14]);
        });
    });
    test.describe("when used as a CSSDirective", () => {
        test("should set a CSS custom property for the element when the token is set for the element", async () => {
            expect(
                await page.evaluate(async () => {
                    const target = addElement();
                    const token = DesignToken.create<number>(uniqueTokenName());
                    token.setValueFor(target, 12);
                    const styles = css`
                        :host {
                            width: calc(${token} * 1px);
                        }
                    `;
                    target.$fastController.addStyles(styles);

                    await Updates.next();
                    return window.getComputedStyle(target).getPropertyValue("width");
                })
            ).toBe("12px");
        });
        test("should set a CSS custom property for the element when the token is set for an ancestor element", async () => {
            expect(
                await page.evaluate(async () => {
                    const parent = addElement();
                    const target = addElement(parent);
                    const token = DesignToken.create<number>(uniqueTokenName());
                    token.setValueFor(parent, 12);
                    const styles = css`
                        :host {
                            width: calc(${token} * 1px);
                        }
                    `;
                    target.$fastController.addStyles(styles);

                    await Updates.next();
                    return window.getComputedStyle(target).getPropertyValue("width");
                })
            ).toBe("12px");
        });
    });

    test.describe("with a default value set", () => {
        test("should return the default value if no value is set for a target", async () => {
            expect(
                await page.evaluate(() => {
                    const target = addElement();
                    const token = DesignToken.create<number>(uniqueTokenName());
                    token.withDefault(2);
                    return token.getValueFor(target);
                })
            ).toBe(2);
        });
        test("should return the default value for a descendent if no value is set for a target", async () => {
            expect(
                await page.evaluate(() => {
                    const parent = addElement();
                    const target = addElement(parent);
                    const token = DesignToken.create<number>(uniqueTokenName());
                    token.withDefault(2);

                    return token.getValueFor(target);
                })
            ).toBe(2);
        });
        test("should return the value set and not the default if value is set", async () => {
            expect(
                await page.evaluate(() => {
                    const target = addElement();
                    const token = DesignToken.create<number>(uniqueTokenName());
                    token.withDefault(4);
                    token.setValueFor(target, 2);

                    return token.getValueFor(target);
                })
            ).toBe(2);
        });
        test("should get a new default value if a new default is provided", async () => {
            expect(
                await page.evaluate(() => {
                    const target = addElement();
                    const token = DesignToken.create<number>(uniqueTokenName());
                    token.withDefault(2);
                    token.withDefault(4);

                    return token.getValueFor(target);
                })
            ).toBe(4);
        });
        test("should return the default value if retrieved for an element that has not been connected", async () => {
            expect(
                await page.evaluate(() => {
                    const token = DesignToken.create<number>(
                        uniqueTokenName()
                    ).withDefault(12);
                    const element = createElement();

                    return token.getValueFor(element);
                })
            ).toBe(12);
        });
        test("should set a derived value that uses a token's default value prior to connection", async () => {
            expect(
                await page.evaluate(() => {
                    const dependency = DesignToken.create<number>(
                        uniqueTokenName()
                    ).withDefault(12);
                    const token = DesignToken.create<number>(uniqueTokenName());
                    const element = createElement();

                    return threw(() =>
                        token.setValueFor(element, resolve => resolve(dependency) * 2)
                    );
                })
            ).toBe(false);
        });
        test("should delete a derived value that uses a token's default value prior to connection", async () => {
            expect(
                await page.evaluate(() => {
                    const dependency = DesignToken.create<number>(
                        uniqueTokenName()
                    ).withDefault(12);
                    const token = DesignToken.create<number>(uniqueTokenName());
                    const element = createElement();
                    token.setValueFor(element, resolve => resolve(dependency) * 2);

                    return threw(() => token.deleteValueFor(element));
                })
            ).toBe(false);
        });
    });

    test.describe("with subscribers", () => {
        test("should notify an un-targeted subscriber when the value changes for any element", async () => {
            expect(
                await page.evaluate(() => {
                    const results: any = [];
                    const ancestor = addElement();
                    const parent = addElement(ancestor);
                    const target = addElement(parent);
                    const token = DesignToken.create<number>(uniqueTokenName());
                    const spies = new Map<FASTElement | "default", boolean>([
                        [ancestor, false],
                        [parent, false],
                        [target, false],
                    ]);

                    const subscriber: DesignTokenSubscriber<typeof token> = {
                        handleChange(token, record) {
                            spies.set(record.target, true);
                        },
                    };

                    token.subscribe(subscriber);

                    function storeResults() {
                        results.push([
                            spies.get(ancestor),
                            spies.get(parent),
                            spies.get(target),
                        ]);
                    }

                    token.setValueFor(ancestor, 12);
                    storeResults();

                    token.setValueFor(parent, 14);
                    storeResults();

                    token.setValueFor(target, 16);
                    storeResults();
                    return results;
                })
            ).toEqual([
                [true, false, false],
                [true, true, false],
                [true, true, true],
            ]);
        });
        test("should notify a target-subscriber if the value is changed for the provided target", async () => {
            expect(
                await page.evaluate(() => {
                    const results = [];
                    const parent = addElement();
                    const target = addElement(parent);
                    const token = DesignToken.create<number>(uniqueTokenName());

                    const handleChange = spy(() => {});
                    const subscriber: DesignTokenSubscriber<typeof token> = {
                        handleChange,
                    };

                    token.subscribe(subscriber);

                    token.setValueFor(parent, 12);
                    results.push(handleChange.calls);

                    token.setValueFor(target, 14);
                    results.push(handleChange.calls);
                    return results;
                })
            ).toEqual([1, 2]);
        });

        test("should not notify a subscriber after unsubscribing", async () => {
            expect(
                await page.evaluate(() => {
                    const target = addElement();
                    const token = DesignToken.create<number>(uniqueTokenName());

                    const handleChange = spy(() => {});
                    const subscriber: DesignTokenSubscriber<typeof token> = {
                        handleChange,
                    };

                    token.subscribe(subscriber);
                    token.unsubscribe(subscriber);

                    token.setValueFor(target, 12);
                    return handleChange.calls;
                })
            ).toBe(0);
        });

        test("should infer DesignToken and CSSDesignToken token types on subscription record", async () => {
            await page.evaluate(() => {
                type AssertCSSDesignToken<T> = T extends CSSDesignTokenImpl<any>
                    ? T
                    : never;
                DesignToken.create<number>("css").subscribe({
                    handleChange(token, record) {
                        const test: AssertCSSDesignToken<typeof record.token> =
                            record.token;
                    },
                });

                type AssertDesignToken<T> = T extends CSSDesignTokenImpl<any> ? never : T;

                DesignToken.create<number>({ name: "no-css" }).subscribe({
                    handleChange(token, record) {
                        const test: AssertDesignToken<typeof record.token> = record.token;
                    },
                });
            });
        });

        test("should notify a subscriber when a dependency of a subscribed token changes", async () => {
            expect(
                await page.evaluate(async () => {
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    tokenA.withDefault(6);
                    tokenB.withDefault(resolve => resolve(tokenA) * 2);

                    const handleChange = spy(() => {});
                    const subscriber = {
                        handleChange,
                    };

                    tokenB.subscribe(subscriber);

                    tokenA.withDefault(7);
                    await Updates.next();
                    return handleChange.calls;
                })
            ).toBe(1);
        });

        test("should notify a subscriber when a dependency of a dependency of a subscribed token changes", async () => {
            expect(
                await page.evaluate(async () => {
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());
                    const tokenC = DesignToken.create<number>(uniqueTokenName());

                    tokenA.withDefault(6);
                    tokenB.withDefault(resolve => resolve(tokenA) * 2);
                    tokenC.withDefault(resolve => resolve(tokenB) * 2);

                    const handleChange = spy(() => {});
                    const subscriber = {
                        handleChange,
                    };

                    tokenC.subscribe(subscriber);

                    tokenA.withDefault(7);
                    await Updates.next();
                    return handleChange.calls;
                })
            ).toBe(1);
        });

        test("should notify a subscriber when a dependency changes for an element down the DOM tree", async () => {
            expect(
                await page.evaluate(async () => {
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    const target = addElement();

                    tokenA.withDefault(6);
                    tokenB.withDefault(resolve => resolve(tokenA) * 2);

                    const handleChange = spy(() => {});
                    const subscriber = {
                        handleChange,
                    };

                    tokenB.subscribe(subscriber);

                    tokenA.setValueFor(target, 7);
                    await Updates.next();
                    return handleChange.calls;
                })
            ).toBe(1);
        });
        test("should notify a subscriber when a static-value dependency of subscribed token changes for a parent of the subscription target", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    const parent = addElement();
                    const target = addElement(parent);

                    tokenA.withDefault(6);
                    tokenB.withDefault(resolve => resolve(tokenA) * 2);

                    const handleChange = spy(() => {});
                    const subscriber = {
                        handleChange,
                    };

                    tokenB.subscribe(subscriber /*target*/);

                    tokenA.setValueFor(parent, 7);
                    await Updates.next();
                    results.push(handleChange.calls);
                    results.push(tokenB.getValueFor(target));

                    return results;
                })
            ).toEqual([1, 14]);
        });
        test("should notify a subscriber when a derived-value dependency of subscribed token changes for a parent of the subscription target", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    const parent = addElement();
                    const target = addElement(parent);

                    tokenA.withDefault(() => 6);
                    tokenB.withDefault(resolve => resolve(tokenA) * 2);

                    const handleChange = spy(() => {});
                    const subscriber = {
                        handleChange,
                    };

                    tokenB.subscribe(subscriber /*target*/);

                    tokenA.setValueFor(parent, () => 7);
                    await Updates.next();
                    results.push(handleChange.calls);
                    results.push(tokenB.getValueFor(target));
                    return results;
                })
            ).toEqual([1, 14]);
        });
        test("should notify a subscriber when a dependency of subscribed token changes for a parent of the subscription target", async () => {
            expect(
                await page.evaluate(async () => {
                    const tokenA = DesignToken.create<number>(uniqueTokenName());
                    const tokenB = DesignToken.create<number>(uniqueTokenName());

                    const grandparent = addElement();
                    const parent = addElement(grandparent);
                    const child = addElement(parent);

                    tokenA.withDefault(() => 6);
                    tokenB.withDefault(resolve => resolve(tokenA) * 2);

                    const handleChange = spy(() => {});
                    const subscriber = {
                        handleChange,
                    };

                    tokenB.subscribe(subscriber /*child*/);

                    tokenA.setValueFor(grandparent, () => 7);
                    await Updates.next();
                    return handleChange.calls;
                })
            ).toBe(1);
        });
    });

    test.describe("with root registration", () => {
        test("should not emit CSS custom properties for the default value if a root is not registered", async () => {
            expect(
                await page.evaluate(() => {
                    DesignToken.unregisterDefaultStyleTarget();
                    const token = DesignToken.create<number>(
                        uniqueTokenName()
                    ).withDefault(12);
                    const styles = window.getComputedStyle(document.body);

                    return styles.getPropertyValue(token.cssCustomProperty);
                })
            );
        });

        test("should emit CSS custom properties for the default value when a design token root is registered", async () => {
            expect(
                await page.evaluate(async () => {
                    const token = DesignToken.create<number>(
                        uniqueTokenName()
                    ).withDefault(12);
                    const styles = window.getComputedStyle(document.body);

                    DesignToken.registerDefaultStyleTarget();

                    await Updates.next();

                    return styles.getPropertyValue(token.cssCustomProperty);
                })
            ).toBe("12");
        });

        test("should remove emitted CSS custom properties for a root when the root is deregistered", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [];
                    const token = DesignToken.create<number>(
                        uniqueTokenName()
                    ).withDefault(12);
                    const styles = window.getComputedStyle(document.body);

                    DesignToken.registerDefaultStyleTarget();

                    await Updates.next();

                    results.push(styles.getPropertyValue(token.cssCustomProperty));
                    DesignToken.unregisterDefaultStyleTarget();

                    await Updates.next();

                    results.push(styles.getPropertyValue(token.cssCustomProperty));
                    return results;
                })
            ).toEqual(["12", ""]);
        });

        test("should emit CSS custom properties to an element when the element is provided as a root", async () => {
            expect(
                await page.evaluate(async () => {
                    const token = DesignToken.create<number>(
                        uniqueTokenName()
                    ).withDefault(12);
                    const element = addElement();

                    DesignToken.registerDefaultStyleTarget(element);

                    await Updates.next();
                    const styles = window.getComputedStyle(element);

                    return styles.getPropertyValue(token.cssCustomProperty);
                })
            ).toBe("12");
        });
        test("should emit CSS custom properties to multiple roots", async () => {
            expect(
                await page.evaluate(async () => {
                    const results = [] as any;
                    DesignToken.unregisterDefaultStyleTarget();
                    const token = DesignToken.create<number>(
                        "default-with-multiple-roots"
                    ).withDefault(12);
                    const a = addElement();
                    const b = addElement();

                    DesignToken.registerDefaultStyleTarget(a);
                    await Updates.next();

                    function storeResults() {
                        results.push([
                            window
                                .getComputedStyle(a)
                                .getPropertyValue(token.cssCustomProperty),
                            window
                                .getComputedStyle(b)
                                .getPropertyValue(token.cssCustomProperty),
                            window
                                .getComputedStyle(document.body)
                                .getPropertyValue(token.cssCustomProperty),
                        ]);
                    }

                    storeResults();

                    DesignToken.registerDefaultStyleTarget(b);
                    await Updates.next();
                    storeResults();

                    DesignToken.registerDefaultStyleTarget();
                    await Updates.next();
                    storeResults();

                    return results;
                })
            ).toEqual([
                ["12", "", ""],
                ["12", "12", ""],
                ["12", "12", "12"],
            ]);
        });

        // Flakey and seems to be corrupted by other tests.
        test.skip("should set properties for a PropertyTarget registered as the root", async () => {
            const results = await page.evaluate(async () => {
                const results = [];
                const token = DesignToken.create<number>(uniqueTokenName()).withDefault(
                    12
                );
                const root = {
                    setProperty: spy(() => {}),
                    removeProperty: spy(() => {}),
                };

                DesignToken.registerDefaultStyleTarget(root);

                // expect(root.setProperty).to.have.been.called.with(token.cssCustomProperty, 12)
                results.push(root.setProperty.calledWith(1));

                token.withDefault(14);

                // expect(root.setProperty).to.have.been.called.with(token.cssCustomProperty, 14)
                results.push(root.setProperty.calledWith(2));
                DesignToken.unregisterDefaultStyleTarget(root);

                return results;
            });

            expect(results[0][1]).toEqual(12);
            expect(results[1][1]).toEqual(14);
        });
    });
});
