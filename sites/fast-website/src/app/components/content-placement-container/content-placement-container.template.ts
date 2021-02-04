import { html, repeat } from "@microsoft/fast-element";
import { SiteContentPlacement } from "../content-placement";
import { ContentPlacementContainer } from "./content-placement-container";

const template = html<SiteContentPlacement>`
    ${(x, c) => c.parent.selectTemplate()}
`;

export const ContentPlacementContainerTemplate = html<ContentPlacementContainer>`
    ${repeat(x => x.selectData(), template)}
`;
