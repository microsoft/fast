import {
    fastCard,
    fillColor,
    NeutralFillCard,
    NeutralForeground,
    SwatchRGB,
} from "@microsoft/fast-components";
import { DesignSystem, DI, Registration } from "@microsoft/fast-foundation";

DI.getOrCreateDOMContainer(document.getElementById("root")!).register(
    Registration.instance(NeutralFillCard, (element: HTMLElement) => {
        return SwatchRGB.create(1, 0, 0);
    })
);

DI.getOrCreateDOMContainer().register(
    Registration.instance(NeutralForeground, (target: HTMLElement) => {
        return SwatchRGB.create(0, 0, 1);
    })
);

DesignSystem.getOrCreate().register(fastCard());
