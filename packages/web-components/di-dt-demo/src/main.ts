import { fastButton } from "@microsoft/fast-components";
import { DesignSystem, DesignToken } from "@microsoft/fast-foundation";
import { demoCardDefinition } from "./components/demo-card";

DesignSystem.getOrCreate()
    .withPrefix("fluent")
    .register(fastButton(), demoCardDefinition());
