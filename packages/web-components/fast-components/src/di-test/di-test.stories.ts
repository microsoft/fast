import { FASTDesignSystemProvider } from "../design-system-provider";
import DITestTemplate from "./fixtures/di-test.html";
import { DITestElementDefinition } from "./";
import { DesignSystem } from "@microsoft/fast-foundation";

// Prevent tree-shaking
FASTDesignSystemProvider;

// ===========
// New DI work
// ===========

// Define design system
const designSystem = new DesignSystem();

// Register the custom element definition
designSystem.register(DITestElementDefinition(/* apply any necessary overrides */));

// Apply the DesignSystem to the document.body (or some other element). This
// will define the custom elements and register any registrations.
designSystem.applyTo(document.body);

export default {
    title: "DITest",
};

export const DITestExample = () => DITestTemplate;
