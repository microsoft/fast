import BreadcrumbTemplate from "./fixtures/base.html";

export default {
    title: "Components/Breadcrumb",
};

export const Breadcrumb = (): string => BreadcrumbTemplate;

const example = `
</* @echo namespace */-breadcrumb>
  </* @echo namespace */-breadcrumb-item href="#"> Breadcrumb item 1 <//* @echo namespace */-breadcrumb-item>
  </* @echo namespace */-breadcrumb-item href="#"> Breadcrumb item 2 <//* @echo namespace */-breadcrumb-item>
  </* @echo namespace */-breadcrumb-item>Breadcrumb item 3<//* @echo namespace */-breadcrumb-item>
<//* @echo namespace */-breadcrumb>
`;

Breadcrumb.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
