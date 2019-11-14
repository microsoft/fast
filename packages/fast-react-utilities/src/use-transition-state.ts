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
