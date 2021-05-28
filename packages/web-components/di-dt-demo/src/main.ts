import { fillColor, NeutralForeground, neutralPalette } from "@microsoft/fast-components";
import { DesignSystem, DI, Registration } from "@microsoft/fast-foundation";
import { demoCardDefinition } from "./components/demo-card";

DI.getOrCreateDOMContainer().register(Registration.instance(NeutralForeground, () => {}));

fillColor.withDefault((target: HTMLElement) => neutralPalette.getValueFor(target).get(0));

DesignSystem.getOrCreate().withPrefix("fluent").register(demoCardDefinition());
