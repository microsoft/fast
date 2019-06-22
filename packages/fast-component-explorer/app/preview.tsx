import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import style from "./explorer.style";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ViewerContent } from "@microsoft/fast-tooling-react";
import { getChildrenOptions } from "./utilities/views";

class Preview extends Foundation<{}, {}, {}> {
    public render(): React.ReactNode {
        return <ViewerContent components={getChildrenOptions()} />;
    }
}

export default manageJss(style)(Preview);
