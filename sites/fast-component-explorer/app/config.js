import { get, omit } from "lodash-es";
import { createBrowserHistory } from "history";
import {
    fastComponentSchemas,
    nativeElementSchemas,
    textSchema,
} from "@microsoft/site-utilities";
import {
    fastDataGridCellId,
    fastDataGridRowId,
} from "./fast-components/configs/fast-data-grid";
import { fastMenuItemId } from "./fast-components/configs/fast-menu";
import { fastSliderLabelId } from "./fast-components/configs/fast-slider";
import { fastAccordionItemId } from "./fast-components/configs/fast-accordion";
import { fastTabId, fastTabPanelId } from "./fast-components/configs/fast-tabs";
import { fastDesignSystemProviderId } from "./fast-components/configs/fast-design-system-provider";
import { fastTreeItemId } from "./fast-components/configs/fast-tree-view";
import { fastBreadcrumbItemId } from "./fast-components/configs/fast-breadcrumb";
import { fastOptionId } from "./fast-components/configs/fast-select";
const schemaDictionary = Object.assign(
    Object.assign(Object.assign({}, fastComponentSchemas), nativeElementSchemas),
    { [textSchema.id]: textSchema }
);
const history = createBrowserHistory();
/* eslint-disable @typescript-eslint/no-use-before-define */
const menu = generateMenu(
    omit(schemaDictionary, [
        textSchema.id,
        fastAccordionItemId,
        fastDataGridCellId,
        fastDataGridRowId,
        fastMenuItemId,
        fastSliderLabelId,
        fastTabId,
        fastTabPanelId,
        fastTreeItemId,
        fastDesignSystemProviderId,
        fastBreadcrumbItemId,
        fastOptionId,
        ...Object.entries(nativeElementSchemas).map(([, nativeElementSchema]) => {
            return nativeElementSchema.id;
        }),
        "fast-design-system-provider",
    ])
);
/* eslint-enable @typescript-eslint/no-use-before-define */
const initialComponentRoute = get(menu, "[0].location", "");
function generateMenu(componentSchemas) {
    return [
        ...Object.entries(componentSchemas).map(([id]) => {
            return {
                displayName: componentSchemas[id].title,
                location: `/components/${id}`,
            };
        }),
    ];
}
export { history, initialComponentRoute, menu, schemaDictionary };
