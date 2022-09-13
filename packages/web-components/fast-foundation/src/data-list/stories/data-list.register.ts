import { css } from "@microsoft/fast-element";
import { FASTDataList } from "../data-list.js";
import { dataListTemplate } from "../data-list.template.js";

const styles = css`
    :host {
        height: 100%;
        display: block;
        overflow-y: scroll;
    }
    .container {
        position: relative;
    }
`;

FASTDataList.define({
    name: "fast-data-list",
    styles,
    template: dataListTemplate({
        defaultListItem: "fast-data-list-item",
    }),
});
