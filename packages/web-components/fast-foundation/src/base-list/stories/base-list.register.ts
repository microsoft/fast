import { css } from "@microsoft/fast-element";
import { FASTBaseList } from "../base-list.js";
import { baseListTemplate } from "../base-list.template.js";

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

FASTBaseList.define({
    name: "fast-base-list",
    styles,
    template: baseListTemplate({
        baseListItem: "fast-base-list-item",
    }),
});
