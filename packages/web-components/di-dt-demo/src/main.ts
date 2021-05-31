import {
    baseLayerLuminance,
    fastButton,
    fillColor,
    NeutralFillCard,
    neutralFillCard,
    neutralPalette,
    PaletteRGB,
    StandardLuminance,
    SwatchRGB,
} from "@microsoft/fast-components";
import { elements } from "@microsoft/fast-element";
import { DesignSystem, DesignToken, DI, Registration } from "@microsoft/fast-foundation";
import { DemoCard, demoCardDefinition } from "./components/demo-card";

const root = document.getElementById("root")!;
const firstDemoCard = document.querySelector("fluent-demo-card") as DemoCard;

DesignSystem.getOrCreate()
    .withPrefix("fluent")
    .register(fastButton(), demoCardDefinition());
