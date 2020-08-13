import { FooterTemplate } from "@microsoft/fast-website";
import "@microsoft/fast-website/src/app/css/footer.css";
import "@microsoft/fast-website/src/app/css/logo.css";
import "@microsoft/fast-website/src/app/css/root.css";
import "@microsoft/fast-website/src/app/css/site-wrapper.css";
import React from "react";
import "./styles.module.css";
export { FASTAnchor, SiteNavigation } from "@microsoft/fast-website";

export default function Footer() {
    return (
        <fast-design-system-provider
            class="site-wrapper"
            use-defaults
            dangerouslySetInnerHTML={{ __html: FooterTemplate }}
        ></fast-design-system-provider>
    );
}
