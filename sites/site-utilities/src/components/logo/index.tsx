/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import { fastBadge } from "@microsoft/fast-components";
import h from "../../web-components/pragma";
import { LogoProps } from "./logo.props";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
fastBadge;

const backgroundStyle = {
    display: "flex",
    height: "32px",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
};
const headerStyle = {
    fontSize: "var(--type-ramp-base-font-size)",
    fontWeight: 600,
    lineHeight: "var(--type-ramp-base-line-height)",
    color: "#FFFFFF",
};
const imageStyle = { verticalAlign: "middle", height: "32px" };
const spanStyle = { verticalAlign: "middle", margin: "0 10px" };
const style = `
fast-badge {
    --badge-fill-primary: #FFD800;
    --badge-color-primary: #000000;
}`;

export const Logo: React.FC<LogoProps> = ({
    className,
    logo,
    title,
    version,
}: React.PropsWithChildren<LogoProps>): React.ReactElement => {
    return (
        <div className={className} style={backgroundStyle}>
            <style>{style}</style>
            <h1 style={headerStyle}>
                <img src={logo} style={imageStyle} />
                <span style={spanStyle}>{title}</span>
            </h1>
            {version ? (
                <fast-badge fill="primary" color="primary">
                    {version}
                </fast-badge>
            ) : null}
        </div>
    );
};

export * from "./logo.props";
