import {
    allComponents as fastComponents,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { fastToolingColorPicker } from "../app/components/color-picker";
import { App } from "./app";
import { appComponents } from "./custom-elements";

import "./base.css";

provideFASTDesignSystem()
    .register(fastComponents)
    .withPrefix("fast-tooling")
    .register(fastToolingColorPicker())
    .withPrefix("app")
    .register(appComponents);

App;
