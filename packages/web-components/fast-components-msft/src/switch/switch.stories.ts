import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/switch.html";
import { MSFTSwitch } from ".";

// Prevent tree-shaking
MSFTSwitch;
MSFTDesignSystemProvider;

export default {
    title: "Switch",
};

export const Switch = () => Examples;
