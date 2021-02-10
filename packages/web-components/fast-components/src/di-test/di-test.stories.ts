import { FASTDesignSystemProvider } from "../design-system-provider";
import DITestTemplate from "./fixtures/di-test.html";
import { DITestElementDefinition } from "./";
import { DesignSystem, Registration } from "@microsoft/fast-foundation";
import { DI } from "@microsoft/fast-foundation";
import { Observable } from "@microsoft/fast-element";
import {
    DesignTokensImpl,
    SimpleDesignTokenImpl,
    DesignToken,
    SimpleDesignToken,
} from "./design-tokens";
import { DesignUnit } from "./my-design-system";

// Prevent tree-shaking
FASTDesignSystemProvider;

// ===========
// New DI work
// ===========
const designSystem = new DesignSystem();
const designTokens = new DesignTokensImpl(document.body);

designTokens.set(DesignUnit, new SimpleDesignTokenImpl(12));

// Register the custom element definition
designSystem.register(DITestElementDefinition(/* apply any necessary overrides */));

// Apply the DesignSystem to the document.body (or some other element). This
// will define the custom elements and register any registrations.
designSystem.applyTo(document.body);

export default {
    title: "DITest",
};

export const DITestExample = () => DITestTemplate;
