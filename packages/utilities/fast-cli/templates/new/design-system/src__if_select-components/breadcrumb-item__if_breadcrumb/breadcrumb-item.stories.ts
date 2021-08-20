import BreadcrumbItemTemplate from "./fixtures/base.html";
import "./index";

export default {
    title: "Components/Breadcrumb Item",
};

export const BreadcrumbItem = (): string => BreadcrumbItemTemplate;

const example = `
</* @echo namespace */-breadcrumb-item href="#"> Breadcrumb item <//* @echo namespace */-breadcrumb-item>
`;

BreadcrumbItem.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
