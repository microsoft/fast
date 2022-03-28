import {
    allComponents as fastComponents,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { fastToolingColorPicker } from "../app/components/color-picker";
import { App } from "./app";
import { appComponents } from "./custom-elements";
import { registerCyberpunk } from "./style-cyberpunk";
import { registerMinecraftStyle } from "./style-minecraft";

import "./base.css";

registerMinecraftStyle();
// registerCyberpunk();

provideFASTDesignSystem()
    .register(fastComponents)
    .withPrefix("fast-tooling")
    .register(fastToolingColorPicker())
    .withPrefix("app")
    .register(appComponents);

App;
