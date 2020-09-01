import { html, repeat } from "@microsoft/fast-element";
import { ContentPlacementContainer } from "./content-placement-container";
import { SiteContentPlacement } from "../content-placement";

const template = html<SiteContentPlacement>`
    ${(x, c) => c.parent.selectTemplate()}
`;

export const ContentPlacementContainerTemplate = html<ContentPlacementContainer>`
    ${repeat(x => x.selectData(), template)}
`;
