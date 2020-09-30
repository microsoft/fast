import { NavigationAttempt } from "./transaction";

export type NavigationPhase = "tryEnter" | "tryLeave";
export type NavigationContributionCallback<TSettings = any> = (
    attempt: NavigationAttempt<TSettings>
) => Promise<void>;
export type NavigationContributor<TSettings = any> = Partial<
    Record<NavigationPhase, NavigationContributionCallback<TSettings>>
>;
