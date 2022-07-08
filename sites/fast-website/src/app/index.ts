import {
    allComponents,
    baseLayerLuminance,
    provideFASTDesignSystem,
} from "@microsoft/fast-components";
import "./css/style.css";

provideFASTDesignSystem().register(allComponents);

baseLayerLuminance.setValueFor(document.body, 0.09);

export * from "./components";
