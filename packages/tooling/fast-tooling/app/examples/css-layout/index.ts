import { fastSwitch } from "@microsoft/fast-components";
import { DesignSystem } from "@microsoft/fast-foundation";
import { fastToolingCSSLayout } from "../../../src/web-components/css-layout";

DesignSystem.getOrCreate()
    .withPrefix("fast-tooling")
    .register(fastSwitch(), fastToolingCSSLayout());
