import { FASTDesignSystemProvider } from "../design-system-provider";
import DialogTemplate from "./fixtures/dialog.html";
import DialogFastButtonsTemplate from "./fixtures/dialog-fast-buttons.html";
import { FASTDialog } from "./";

// Prevent tree-shaking
FASTDialog;
FASTDesignSystemProvider;

export default {
    title: "Dialog",
};

export const Dialog = () => DialogTemplate;
export const DialogFastButtons = () => DialogFastButtonsTemplate;
