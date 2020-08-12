import { FASTDesignSystemProvider } from "../design-system-provider";
import FlyoutTemplate from "./fixtures/flyout.html";
import FlyoutTemplate2 from "./fixtures/flyout2.html";
import FlyoutTemplate3 from "./fixtures/flyout3.html";
import { FASTFlyout } from ".";

// Prevent tree-shaking
FASTFlyout;
FASTDesignSystemProvider;

export default {
    title: "Flyout",
};

export const Flyout = () => FlyoutTemplate;
export const Flyout2 = () => FlyoutTemplate2;
export const Flyout3 = () => FlyoutTemplate3;
