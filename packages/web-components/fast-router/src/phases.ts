import { RecognizedRoute } from "./recognizer";
import { Router } from "./router";

export type NavigationPhaseName = "navigate" | "leave" | "construct" | "enter" | "commit";

export type NavigationPhaseHook<TSettings = any> = (
    phase: NavigationPhase<TSettings>
) => Promise<any> | any;

export type NavigationCommitPhaseHook<TSettings = any> = (
    phase: NavigationCommitPhase<TSettings>
) => Promise<any> | any;

export type NavigationPhaseFollowupAction = () => Promise<any> | any;

export interface NavigationPhase<TSettings = any> {
    readonly name: NavigationPhaseName;
    readonly route: RecognizedRoute<TSettings>;
    readonly router: Router<TSettings>;
    readonly canceled: boolean;

    cancel(callback?: NavigationPhaseFollowupAction): void;
    onCancel(callback: NavigationPhaseFollowupAction): void;
    onCommit(callback: NavigationPhaseFollowupAction): void;

    evaluateContributor(
        contributor: any,
        route?: RecognizedRoute<TSettings>,
        router?: Router<TSettings>
    ): Promise<void>;
}

export interface NavigationCommitPhase<TSettings = any>
    extends Omit<NavigationPhase<TSettings>, "cancel" | "canceled" | "onCancel"> {
    setTitle(title: string);
}
