import { FASTDesignSystemProvider } from "../design-system-provider";
import MockUiTemplate from "./fixtures/mock-ui.html";
import { FASTMockUi } from "./";
// import { } from "react-unity-webgl";

// Prevent tree-shaking
FASTMockUi;
FASTDesignSystemProvider;

export default {
    title: "Mock Ui",
};

export const MockUi = () => MockUiTemplate;
