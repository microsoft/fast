import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import BreadcrumbTemplate from "./fixtures/base.html";
import "../breadcrumb-item";
import "./index";
function addItem() {
    const breadcrumbElement = document.getElementById("mybreadcrumb");
    const items =
        breadcrumbElement === null || breadcrumbElement === void 0
            ? void 0
            : breadcrumbElement.querySelectorAll("fast-breadcrumb-item");
    if (items !== undefined) {
        const lastItem = items[items.length - 1];
        const item = document.createElement("fast-breadcrumb-item");
        item.setAttribute("href", "#");
        item.textContent = `Breadcrumb item ${items.length + 1}`;
        if (lastItem.parentNode !== null) {
            lastItem.parentNode.insertBefore(item, lastItem.nextSibling);
        }
    }
}
addons.getChannel().addListener(STORY_RENDERED, name => {
    if (name.toLowerCase() === "breadcrumb--breadcrumb") {
        const button = document.getElementById("add-button");
        button.addEventListener("click", addItem);
    }
});
export default {
    title: "Breadcrumb",
};
export const Breadcrumb = () => BreadcrumbTemplate;
