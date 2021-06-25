import {
    designUnit,
    fastButton,
    fillColor,
    neutralPalette,
    SwatchRGB,
} from "@microsoft/fast-components";
import { css, ElementStyles } from "@microsoft/fast-element";
import {
    DesignSystem,
    DesignToken,
    DI,
    ElementDefinitionContext,
    FoundationElementDefinition,
    OverrideFoundationElementDefinition,
    Registration,
} from "@microsoft/fast-foundation";
import {
    DemoCard,
    demoCardDefinition,
    DemoCardDefinitionOptions,
} from "./components/demo-card";
import { demoCardStyles } from "./components/demo-card/styles";

const root = document.getElementById("root")!;
const firstDemoCard = document.querySelector("fluent-demo-card") as DemoCard;

DesignSystem.getOrCreate()
    .withPrefix("fluent")
    .register(fastButton(), demoCardDefinition());
