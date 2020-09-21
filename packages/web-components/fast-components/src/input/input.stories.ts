import { FASTDesignSystemProvider } from "../design-system-provider";
import inputTemplate from "./fixtures/input.html";
import { FastInput } from "./";

// Prevent tree-shaking
FastInput;
FASTDesignSystemProvider;

export default {
    title: "Input",
};

export const input = () => inputTemplate;
