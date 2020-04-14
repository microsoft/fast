# Carousel

## Style

Use `carousel__slideAnimateNext` and `carousel__slideAnimatePrevious` styles to customize animation or transformation.

## Implementing

Auto-rotation can be enabled by setting the `autoplay` prop to "true" and including an optional `autoplayInterval` (defaults to 6000ms). If the carousel has auto-rotation enabled, the automatic slide rotation should stop when any element in the carousel receives keyboard focus or hover. It does not resume unless the user activates a control to enable rotation. To support this scenario, the carousel treats `autoplay` as a controlled feature of this component. A callback prop of `onFocus` can be passed as an unhandled prop to support disabling `autoplay` when focus enters the carousel. Similarly, `onMouseEnter` and `onMouseLeave` props can be provided to pause and resume auto-rotation on mouse hover and leave respectively. It is the responsibility of those implementing the control to ensure that the auto-rotation stops and starts as expected.
