import { useState } from "react";
import { isNumber } from "lodash-es";
import { useTimeout } from "./use-timeout";

export enum TransitionStates {
    inactive, // The initial state of the component before an transition changes
    active, // The completed state after transition changes
    activating, // The middle state going from inactive -> active
    deactivating, // The middle state going from active -> inactive
}

export function getTransitionState(prev: boolean, next: boolean): TransitionStates {
    return prev && next
        ? TransitionStates.active
        : !prev && !next
        ? TransitionStates.inactive
        : next && !prev
        ? TransitionStates.activating
        : TransitionStates.deactivating;
}

export function useTransitionState(
    active: boolean,
    duration: number | [number, number]
): TransitionStates {
    const [activeState, setactiveState]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState<boolean>(active);
    const transitionState: TransitionStates = getTransitionState(activeState, active);

    const _duration: number = isNumber(duration)
        ? duration
        : transitionState === TransitionStates.activating || TransitionStates.inactive
        ? duration[0]
        : duration[1];

    useTimeout(
        () => {
            if (active !== activeState) {
                setactiveState(active);
            }
        },
        _duration,
        [active, activeState]
    );

    return transitionState;
}

export interface UseTransitionStateProps {
    /**
     * Indicate if the entity being tracked should be active or not.
     */
    active: boolean;

    /**
     * The duration of the transition. This will determine for how long the intermittent states
     * will persist. When two values are provided, the first will be used for inactive -> active
     * and the second will be used for active -> inactive
     */
    duration: number | [number, number];

    /**
     * Callback to receive the current transition state
     */
    children: (state: TransitionStates) => React.ReactNode;
}

export function UseTransitionState(props: UseTransitionStateProps): React.ReactNode {
    const { active, duration, children }: UseTransitionStateProps = props;

    return children(useTransitionState(active, duration));
}
