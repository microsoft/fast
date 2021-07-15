import React from "react";
import { CSSRef } from "./control.css-ref";
/**
 * The property control for syntaxes that refer to other
 * CSS properties, for a list refer to:
 * https://github.com/mdn/data/blob/master/css/properties.json
 */
export function renderPropertyControl(config) {
    switch (config.property) {
        default:
            return (
                <CSSRef
                    mapsToProperty={config.property}
                    syntax={config.syntax}
                    onChange={config.handleChange}
                    value={config.value}
                    dictionaryId={config.dictionaryId}
                    dataLocation={config.dataLocation}
                />
            );
    }
}
