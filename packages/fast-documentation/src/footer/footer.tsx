import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { FooterHandledProps, FooterProps, FooterUnhandledProps } from "./footer.props";
import { get } from "lodash-es";
import { Image } from "@microsoft/fast-components-react-msft";

/**
 * Footer images
 */
/* tslint:disable */
const FASTLogo = require("../../images/fast-dna.svg");
const MediumLogo = require("../../images/medium.svg");
const TwitterLogo = require("../../images/twitter.svg");
const FacebookLogo = require("../../images/facebook.svg");
const DribbleLogo = require("../../images/dribble.svg");
/* tslint:enable */

class Footer extends Foundation<FooterHandledProps, FooterUnhandledProps, {}> {
    public static displayName: string = "Footer";

    protected handledProps: HandledProps<FooterHandledProps> = {
        managedClasses: void 0
    };

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <footer {...this.unhandledProps()} className={this.generateClassNames()}>
                <div className={get(this.props.managedClasses, "footer_wrapper", "")}>
                    {this.props.children}
                    <div className={get(this.props.managedClasses, "headerGrid", "")}>
                        <div className={get(this.props.managedClasses, "column", "")}>
                            <div className={get(this.props.managedClasses, "logo", "")}>
                                <Image src={FASTLogo} alt={"FAST-DNA logo"} />
                            </div>
                        </div>
                        <div className={get(this.props.managedClasses, "column", "")}>
                            <div className={get(this.props.managedClasses, "social", "")}>
                                <a href="https://medium.com/fast-dna" target="_blank">
                                    <img src={MediumLogo} alt="Medium logo" />
                                </a>
                                <a href="https://twitter.com/FAST_DNA" target="_blank">
                                    <img src={TwitterLogo} alt="Twitter logo" />
                                </a>
                            </div>
                            <ul className={get(this.props.managedClasses, "ul", "")}>
                                <li>
                                    <a href="https://github.com/microsoft/fast-dna/blob/master/LICENSE">License</a>
                                </li>
                                <li>
                                    <a href="https://privacy.microsoft.com/en-US/privacystatement">
                                        Privacy &amp; Cookies
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx">
                                        Terms of Use
                                    </a>
                                </li>
                                <li>
                                    <span>©2020 Microsoft</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "footer", ""));
    }
}

export default Footer;
export * from "./footer.props";
