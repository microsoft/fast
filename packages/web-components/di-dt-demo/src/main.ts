import { fastButton } from "@microsoft/fast-components";
import { DesignSystem } from "@microsoft/fast-foundation";
import { DemoCard, demoCardDefinition } from "./components/demo-card";

const root = document.getElementById("root")!;
const firstDemoCard = document.querySelector("fluent-demo-card") as DemoCard;

DesignSystem.getOrCreate()
    .withPrefix("fluent")
    .register(fastButton(), demoCardDefinition());
