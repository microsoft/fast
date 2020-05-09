import { MSFTDesignSystemProvider } from "../design-system-provider";
import DialogTemplate from "./fixtures/dialog.html";
import { MSFTDialog } from "./";

// Prevent tree-shaking
MSFTDialog;
MSFTDesignSystemProvider;

export default {
    title: "Dialog",
};

export const Dialog = () => DialogTemplate;
