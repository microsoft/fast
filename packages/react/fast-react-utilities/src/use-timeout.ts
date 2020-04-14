import { useEffect, useRef } from "react";

/**
 * React hook to call set a timeout
 */
export function useTimeout(
    callback: () => void,
    delay: number | null,
    dependencies: any[] = []
): void {
    const savedCallback: React.MutableRefObject<() => any> = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick(): void {
            savedCallback.current();
        }

        if (delay !== null) {
            const id: number = window.setTimeout(tick, delay);
            return (): void => window.clearTimeout(id);
        }
    }, [delay].concat(dependencies));
}

export interface UseTimeoutProps {
    /**
     * The callback to invoke after delay
     */
    callback: () => void;

    /**
     * The number of miliseconds to wait before callback invocation
     */
    delay: number | null;

    /**
     * Dependencies that, when changed, will cause the timeout to be
     * re-registered
     */
    dependencies?: any[];
}

/**
 * Functional component implementing useTimeout for implementation in
 * class components
 */
export function UseTimeout(
    props: React.PropsWithChildren<UseTimeoutProps>
): React.ReactNode {
    const { callback, delay, dependencies }: UseTimeoutProps = props;

    useTimeout(callback, delay, dependencies);

    return props.children;
}
