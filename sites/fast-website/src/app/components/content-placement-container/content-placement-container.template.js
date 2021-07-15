import { html, repeat } from "@microsoft/fast-element";
const template = html`
    ${(x, c) => c.parent.selectTemplate()}
`;
export const ContentPlacementContainerTemplate = html`
    ${repeat(x => x.selectData(), template)}
`;
