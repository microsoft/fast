import { Constructable, CSSDirective } from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";

export interface StyleModuleEvaluateParameters {
    baseSelector: string;
    interactivitySelector: string;
    nonInteractivitySelector: string;
}

export type StyleModuleEvaluate = (params: StyleModuleEvaluateParameters) => CSSDirective;

interface StyleModuleRegistration {
    id: string;
    // hostCompoundSelector: string | string[] | null;
    childSelector: string | null;
    evaluate: StyleModuleEvaluate;
}

const styleModuleRefreshToken = DesignToken.create<string>({
    name: "style-module-refresh",
    cssCustomPropertyName: null,
}).withDefault("");

const styleModules = new Map<Constructable, Array<StyleModuleRegistration>>();

function createStyleModule<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name, cssCustomPropertyName: null });
}

// TODO: I was in the middle of an update here to support more complex or compound selectors.
// The idea is that there's some way to provide an array of selectors, and some way to indicate where
// states need to be applied. Or potentially other extensibility features. States are just the obvious one.
export function registerStyleModule(
    component: Constructable,
    id: string,
    // hostCompoundSelector: string | string[] | null,
    childSelector: string = ":host",
    module: StyleModuleEvaluate
): void {
    // console.log("registerStyleModule", component.name, baseSelector, module.name);

    const registrations = styleModules.get(component) || [];
    // console.log("  registrations", registrations);

    registrations.push({
        id,
        // hostCompoundSelector,
        childSelector,
        evaluate: module,
    });
    // console.log("  registrations", registrations);
    styleModules.set(component, registrations);
}

export function getStyleModules(component: Constructable) {
    return styleModules.get(component);
}

export function deleteStyleModulesForComponent(component: Constructable) {
    styleModules.delete(component);
}

export function deleteStyleModule(component: Constructable, id: string) {
    const modules = styleModules.get(component);
    if (modules) {
        const newModules = modules?.filter(module => module.id !== id);
        styleModules.set(component, newModules);
    }
}

export function deleteAllStyleModules() {
    styleModules.clear();
}

export function triggerStyleModuleRefresh() {
    styleModuleRefreshToken.withDefault("");
}
