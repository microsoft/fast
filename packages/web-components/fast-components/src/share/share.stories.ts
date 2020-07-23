import { FASTDesignSystemProvider } from "../design-system-provider";
import DefaultExamples from "./fixtures/base.html";
import NoTabExamples from "./fixtures/no-tab-info.html";
import { FASTShareGroup } from "./share-group";
import { FASTShareLink } from "./share-link";
import { FASTShare } from ".";

// Prevent tree-shaking
FASTShare;
FASTShareGroup;
FASTShareLink;
FASTDesignSystemProvider;

export default {
    title: "Share",
};

export const Default = () => DefaultExamples;
export const NoTabInfo = () => NoTabExamples;
