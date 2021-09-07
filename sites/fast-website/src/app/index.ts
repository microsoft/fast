import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents, baseLayerLuminance } from "@microsoft/fast-components";
import "./css/style.css";

DesignSystem.getOrCreate().register(Object.values(allComponents).map(x => x()));

baseLayerLuminance.setValueFor(document.body, 0.09);

export * from "./components";
