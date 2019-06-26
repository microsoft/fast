import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import style from "./explorer.style";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ViewerContent } from "@microsoft/fast-tooling-react";
import { getChildrenOptions } from "./utilities/views";

/**
 * The preview component exists on a route inside an iframe
 * This allows for an isolated view of any component or components.
 */
class Preview extends Foundation<{}, {}, {}> {
    public render(): React.ReactNode {
        return <ViewerContent components={getChildrenOptions()} />;
    }
}

export default manageJss(style)(Preview);
