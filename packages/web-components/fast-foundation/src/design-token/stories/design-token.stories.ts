import { css, FASTElement, html, Observable, Updates } from "@microsoft/fast-element";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";
import type { Meta, Story } from "../../__test__/helpers.js";
import { CSSDesignToken, DesignToken as FASTDesignToken } from "../fast-design-token.js";

export default {
    title: "Debug/DesignToken",
} as Meta;

export const DesignToken: Story = () => {
    const controllerElementName = uniqueElementName();
    const fixtureElementName = uniqueElementName();

    // Define element that can have token mutated for it
    (class extends FASTElement {}).define({
        name: fixtureElementName,
        template: html`
            <slot></slot>
        `,
    });

    const elementCache = new Set<HTMLElement>();
    // The objects required for unit-testing
    // DesignToken. These get installed on the
    // globalThis during story connection, and
    // removed during disconnection
    const requiredTestObject = {
        DesignToken: FASTDesignToken,
        CSSDesignToken,
        uniqueTokenName() {
            return uniqueElementName() + "token";
        },
        createElement(): FASTElement {
            const element = document.createElement(fixtureElementName) as FASTElement;
            elementCache.add(element);
            return element;
        },
        addElement(parent = document.body) {
            const el = requiredTestObject.createElement();
            el.setAttribute("id", "id" + uniqueElementName());
            parent.appendChild(el);
            return el;
        },
        css,
        threw(fn: () => void): boolean {
            try {
                fn();
                return false;
            } catch (e) {
                return true;
            }
        },
        spy(fn: () => any) {
            let calls: number = 0;
            const callArgs: any = [];
            const f = (...args: any[]) => {
                calls += 1;
                callArgs[calls] = args;
            };
            Object.defineProperties(f, {
                calls: {
                    get() {
                        return calls;
                    },
                },
                calledWith: {
                    value: function (n: number): any {
                        return callArgs[n];
                    },
                },
            });

            return f;
        },
        Updates,
        Observable,
        cleanup() {
            elementCache.forEach(value => {
                value.parentElement?.removeChild(value);
                elementCache.delete(value);
            });
        },
    };

    (class extends FASTElement {
        connectedCallback(): void {
            super.connectedCallback();

            // Set up global variables necessary to execute unit tests
            Object.entries(requiredTestObject).forEach(([key, value]) => {
                Object.defineProperty(globalThis, key, { value, configurable: true });
            });
        }

        disconnectedCallback(): void {
            super.disconnectedCallback();

            // Tear down global variables set up during connectedCallback
            Object.keys(requiredTestObject).forEach(key => {
                delete globalThis[key];
            });
        }
    }).define({
        name: controllerElementName,
        template: html`
            <h1>Nothing to see here, folks.</h1>
            <p>
                This page is an entrypoint for DesignToken unit tests and should only be
                used for programmatic purposes
            </p>
        `,
    });

    return document.createElement(controllerElementName);
};
