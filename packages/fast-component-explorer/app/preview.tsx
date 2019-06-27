import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import style from "./explorer.style";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ViewerContent } from "@microsoft/fast-tooling-react";
import { childOptions } from "./config";

/**
 * The preview component exists on a route inside an iframe
 * This allows for an isolated view of any component or components.
 */
class Preview extends Foundation<{}, {}, {}> {
    public render(): React.ReactNode {
        return <ViewerContent components={childOptions} />;
    }
}

export default manageJss(style)(Preview);
