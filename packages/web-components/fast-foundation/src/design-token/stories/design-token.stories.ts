import { FASTElement, html } from "@microsoft/fast-element";
import { uniqueElementName } from "@microsoft/fast-element/testing";
import type { Meta, Story } from "../../__test__/helpers.js";
import { CSSDesignToken, DesignToken as FASTDesignToken } from "../fast-design-token.js";

export default {
    title: "DesignToken",
} as Meta;

export const DesignToken: Story = () => {
    const name = uniqueElementName();

    // The objects required for unit-testing
    // DesignToken. These get installed on the
    // globalThis during story connection, and
    // removed during disconnection
    const requiredTestObject = {
        DesignToken: FASTDesignToken,
        CSSDesignToken,
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
    }.define({
        name,
        template: html`
            <h1>Nothing to see here, folks.</h1>
            <p>
                This page is an entrypoint for DesignToken unit tests and should only be
                used for programmatic purposes
            </p>
        `,
    }));

    return document.createElement(name);
};
