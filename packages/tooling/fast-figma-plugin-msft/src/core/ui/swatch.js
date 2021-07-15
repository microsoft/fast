var __rest =
    (this && this.__rest) ||
    function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (
                    e.indexOf(p[i]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(s, p[i])
                )
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
import {
    applyCornerRadius,
    applyElevation,
} from "@microsoft/fast-components-styles-msft";
import manageJss from "@microsoft/fast-jss-manager-react";
import React from "react";
function Swatch(props) {
    const { managedClasses, color } = props,
        rest = __rest(props, ["managedClasses", "color"]);
    return (
        <span
            title={color}
            className={managedClasses.swatch}
            style={{ background: color }}
            {...rest}
        />
    );
}
export default manageJss({
    swatch: Object.assign(
        Object.assign(
            {
                display: "inline-block",
                width: "16px",
                height: "16px",
                margin: "0 8px 0 0",
            },
            applyCornerRadius()
        ),
        applyElevation(2)
    ),
})(Swatch);
