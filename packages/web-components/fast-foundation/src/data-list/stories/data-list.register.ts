import { css } from "@microsoft/fast-element";
import { FASTDataList } from "../data-list.js";
import { dataListTemplate } from "../data-list.template.js";

const styles = css`
    :host {
        display: block;
    }
`;

FASTDataList.define({
    name: "fast-data-list",
    styles,
    template: dataListTemplate({
        dataListItem: "fast-data-list-item",
    }),
});
