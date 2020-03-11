import { FASTDialog } from "./";
import { FASTDesignSystemProvider } from "../design-system-provider";
import DialogTemplate from "./fixtures/dialog.html";

// Prevent tree-shaking
FASTDialog;
FASTDesignSystemProvider;

export default {
    title: "Dialog",
};

export const Dialog = () => DialogTemplate;
