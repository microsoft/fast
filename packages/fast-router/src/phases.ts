import { RecognizedRoute } from "./recognizer.js";
import { Router } from "./router.js";

/**
 * @beta
 */
export type NavigationPhaseName = "navigate" | "leave" | "construct" | "enter" | "commit";

/**
 * @beta
 */
export type NavigationPhaseHook<TSettings = any> = (
    phase: NavigationPhase<TSettings>
) => Promise<any> | any;

/**
 * @beta
 */
export type NavigationCommitPhaseHook<TSettings = any> = (
    phase: NavigationCommitPhase<TSettings>
) => Promise<any> | any;

/**
 * @beta
 */
export type NavigationPhaseFollowupAction = () => Promise<any> | any;

/**
 * @beta
 */
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

/**
 * @beta
 */
export interface NavigationCommitPhase<TSettings = any>
    extends Omit<NavigationPhase<TSettings>, "cancel" | "canceled" | "onCancel"> {
    setTitle(title: string): void;
}
