import React from "react";
import {
    Background,
    Badge,
    Heading,
    HeadingSize,
} from "@microsoft/fast-components-react-msft";
import { LogoProps } from "./logo.props";

const backgroundStyle = {
    display: "flex",
    height: "32px",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
};
const imageStyle = { verticalAlign: "middle", height: "32px" };
const spanStyle = { verticalAlign: "middle", margin: "0 10px" };

export const Logo: React.FC<LogoProps> = ({
    backgroundColor,
    logo,
    title,
    version,
}: React.PropsWithChildren<LogoProps>): React.ReactElement => {
    return (
        <Background value={backgroundColor} drawBackground={true} style={backgroundStyle}>
            <Heading size={HeadingSize._6}>
                <img src={logo} style={imageStyle} />
                <span style={spanStyle}>{title}</span>
            </Heading>
            {version ? <Badge>{version}</Badge> : null}
        </Background>
    );
};

export * from "./logo.props";
