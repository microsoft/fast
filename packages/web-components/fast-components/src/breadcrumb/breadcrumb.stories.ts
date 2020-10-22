import { FASTDesignSystemProvider } from "../design-system-provider";
import BreadcrumbTemplate from "./fixtures/base.html";
import { FASTBreadcrumb } from ".";
import { FASTBreadcrumbItem } from "../breadcrumb-item";

// Prevent tree-shaking
FASTBreadcrumb;
FASTBreadcrumbItem;
FASTDesignSystemProvider;

export default {
    title: "Breadcrumb",
};

export const Breadcrumb = () => BreadcrumbTemplate;
