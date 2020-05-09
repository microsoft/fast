import { MSFTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/radio.html";
import { MSFTRadio } from "./";

// Prevent tree-shaking
MSFTRadio;
MSFTDesignSystemProvider;

export default {
    title: "Radio",
};

export const Radio = () => Examples;
