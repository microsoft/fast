import { Button } from "./button";
import { Card } from "./card";
import {
    controlCornerRadius,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
} from "./design-tokens";
import { Menu } from "./menu";
import {
    borderRadius,
    deleteAllStyleModules,
    interactionColor,
    interactionState,
    registerStyleModule,
} from "./style-module";
import { attributeValue } from "./style-module/attribute-value";
import {
    elevationShadowCardActive,
    elevationShadowCardFocus,
    elevationShadowCardHover,
    elevationShadowCardRest,
    elevationShadowFlyout,
} from "./styles";

export function registerFastStyle() {
    deleteAllStyleModules();

    registerStyleModule(
        Button /* Component type to target */,
        "corner-radius" /* Only an ID, useful for lookup and modification, but maybe not necessary */,
        ":host .control" /* selector, ideally pointer to a part and state */,
        borderRadius(controlCornerRadius) /* Function to evaluate */
    );

    registerStyleModule(
        Button,
        "background",
        ":host .control",
        interactionColor(
            "background",
            neutralFillRest,
            neutralFillHover,
            neutralFillActive,
            neutralFillFocus
        )
    );

    registerStyleModule(
        Button,
        "color",
        ":host .control",
        interactionColor(
            "color",
            neutralForegroundRest,
            neutralForegroundHover,
            neutralForegroundActive,
            neutralForegroundFocus
        )
    );

    registerStyleModule(
        Card,
        "elevation",
        ":host",
        interactionState(
            "box-shadow",
            elevationShadowCardRest,
            elevationShadowCardHover,
            elevationShadowCardActive,
            elevationShadowCardFocus,
            "focus-within"
        )
    );

    registerStyleModule(
        Menu,
        "elevation",
        ":host",
        attributeValue("box-shadow", elevationShadowFlyout)
    );
}

registerFastStyle();
