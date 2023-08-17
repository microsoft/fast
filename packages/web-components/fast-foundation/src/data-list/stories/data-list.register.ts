import { css } from "@microsoft/fast-element";
import { FASTDataList } from "../data-list.js";
import { dataListTemplate } from "../data-list.template.js";

const styles = css`
    :host {
        max-height: 100%;
        display: flex;
        overflow-y: scroll;
        flex-direction: column;
    }

    :host([orientation="horizontal"]) {
        overflow-y: hidden;
        overflow-x: scroll;
        flex-direction: row;
    }
`;

FASTDataList.define({
    name: "fast-data-list",
    template: dataListTemplate({
        dataListItem: "fast-data-list-item",
    }),
    styles,
});
