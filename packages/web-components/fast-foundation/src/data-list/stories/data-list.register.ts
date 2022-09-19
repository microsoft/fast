import { css } from "@microsoft/fast-element";
import { FASTDataList } from "../data-list.js";
import { dataListTemplate } from "../data-list.template.js";

const styles = css`
    :host {
        height: 100%;
        display: block;
        overflow-y: scroll;
    }
`;

FASTDataList.define({
    name: "fast-data-list",
    styles,
    template: dataListTemplate({
        dataListItem: "fast-data-list-item",
    }),
});
