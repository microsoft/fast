import { HorizontalOverflowProps } from "./horizontal-overflow.props";
import { ButtonDirection } from "./horizontal-overflow";

export type EaseInOutQuad = (currentTime: number, startValue: number, changeInValue: number, duration: number) => number;
export type AnimateScroll = () => void;

export function getItems(props: HorizontalOverflowProps): React.ReactNode[] {
    const children: React.ReactNode[] = Array.isArray(props.children)
        ? props.children
        : props.children
        ? [props.children]
        : [];

    return children.filter((child: JSX.Element) => {
        return child.props && child.props.slot !== ButtonDirection.previous && child.props.slot !== ButtonDirection.next;
    });
}

/**
 * Inspired by the github gist contribution: https://gist.github.com/andjosh/6764939
 */
export function scrollLeft(element: HTMLDivElement, left: number, duration: number): void {
    const start: number = element.scrollLeft;
    const change: number = left - start;
    const startDate: number = +new Date();

    const easeInOutQuad: EaseInOutQuad = function(
        currentTime: number,
        startValue: number,
        changeInValue: number
    ): number {
        currentTime /= duration / 2;

        if (currentTime < 1) {
            return changeInValue / 2 * currentTime * currentTime + startValue;
        }

        currentTime--;

        return -changeInValue / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
    };

    const animateScroll: AnimateScroll = function(): void {
        const currentDate: number = +new Date();
        const currentTime: number = currentDate - startDate;
        element.scrollLeft = easeInOutQuad(currentTime, start, change, duration);

        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        } else {
            element.scrollLeft = left;
        }
    };

    animateScroll();
}
