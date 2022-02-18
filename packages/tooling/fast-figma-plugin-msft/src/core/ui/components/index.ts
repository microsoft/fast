import React from "react";
import { provideReactWrapper } from "@microsoft/fast-react-wrapper";
import { DesignTokenAdd } from "./design-token-add";
import { DesignTokensForm } from "./design-tokens-form";

export * from "./design-token-field";
export * from "./design-tokens-form";
export * from "./drawer";
export * from "./stealth-button";
export * from "./generic-recipe";
export * from "./swatch";
export * from "./corner-radius";

// Temporary React wrappers until complete conversion to web components

export const DesignTokenAddReact = provideReactWrapper(React).wrap(DesignTokenAdd, {
    events: {
        onAdd: "add",
    },
});

export const DesignTokensFormReact = provideReactWrapper(React).wrap(DesignTokensForm, {
    events: {
        onTokenChange: "tokenchange",
        onDetach: "detach",
    },
});
