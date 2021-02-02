/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import { Background, Heading, HeadingSize } from "@microsoft/fast-components-react-msft";
import { FASTBadge } from "@microsoft/fast-components";
import h from "../../web-components/pragma";
import { LogoProps } from "./logo.props";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
FASTBadge;

const backgroundStyle = {
    display: "flex",
    height: "32px",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
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
        <Background className={className} drawBackground={true} style={backgroundStyle}>
            <style>{style}</style>
            <Heading size={HeadingSize._6}>
                <img src={logo} style={imageStyle} />
                <span style={spanStyle}>{title}</span>
            </Heading>
            {version ? (
                <fast-badge fill="primary" color="primary">
                    {version}
                </fast-badge>
            ) : null}
        </Background>
    );
};

export * from "./logo.props";
