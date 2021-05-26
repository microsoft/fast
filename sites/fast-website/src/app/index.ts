import { DesignSystem } from "@microsoft/fast-foundation";
import * as components from "@microsoft/fast-components/dist/esm/custom-elements";
import { siteColorSwatch } from "./components";
import "./css/style.css";
DesignSystem.getOrCreate().register(
    ...Object.values(components).map(x => (x as () => void)()),
    siteColorSwatch({ prefix: "site" })
);

export * from "./components";
// export * from "@microsoft/fast-components";

import "./css/style.css";
