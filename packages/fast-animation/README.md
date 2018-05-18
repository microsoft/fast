# Animation library
An animation library that simplifies interactions and animations using the Web Animation API.

* Provides a convenient abstraction layer over the Web Animation API while still allowing full access to it.
* Simplifies complex animations on anything with any timeframe by sequencing and grouping animation effects for multi-motion loading.

## Peer dependencies
This system uses the emerging Web Animations API that is not supported in all browsers. To provide the broadest support, we recommend you include the web animations polyfill (use the 'next' version). This polyfill can be found [here](https://cdnjs.com/libraries/web-animations).

*Why doesn't the library bundle the polyfill?*  
The polyfill assumes several global variables exist, and in our experience it has caused polymorphic JavaScript to fail to compile with tools like TypeScript and Babel. There are also other advantages to CDN files, so we've chosen to take the web-animations API polyfill as a **peer dependency**.

## Usage
The primary tools for creating animations will be the `AnimateTo` and `AnimateFrom` classes. These classes allow you to apply animations to any HTML Element.

```javascript
var myHtmlElement = document.getElementById('myElement');
var myAnimation = new AnimateTo(myHtmlElement, { x: '30%', scale: 2 }, { duration: 300, delay: 20 });

// Play the animation
myAnimation.play();
```

Sequencing and grouping classes are also provided that can help orchestrate more elaborate animations.

```javascript
var mySequence = new AnimateSequence([
    new AnimateTo(element1, { x: 20 }),
    new AnimateTo(element2, { x: 20 }),
    new AnimateTo(element3, { x: 20 })
]);

// Attach an onFinish callback
mySequence.onFinish = () => {
    window.prompt('Did you like our animations?');
}

// Play all animations, one after another. When completed, ask the user if they liked the animation sequence.
mySequence.play();
```

## Package exports
### Classes: AnimateTo and AnimateFrom
`AnimateTo` and `AnimateFrom` can be used to create numerous complex animations. These classes allow you to specify which properties should be animating as well as information like easing curves, duration, delay, and more.

### Constructor(el: HTMLElement, options?: Options, timing?: EffectTiming)
Both `AnimateTo` and `AnimateFrom` accept one required parameter and two optional parameters.

```javascript
var myAnimation = new AnimateTo(myHtmlElement, { x: 20 }, { duration: 250 });
```

#### Options
The following options are used to construct the animation and configure which properties the animation should change.

- `x`: { `number` | `string` } Adjust the element's horizontal position. This property adjusts the `transform` property.
- `y`: { `number` | `string` } Adjust the element's vertical position. This property adjusts the `transform` property.
- `scale`: { `number` | `[number | number]` } Adjust the scale of the element. If given a number, scale will be applied to both x and y axis's. If given an array of two numbers, x and y will be scaled independently. This property adjusts the `transform` property. 
- `rotate`: { `number` } Adjust the rotation of the object by a number of degrees. This property adjusts the `transform` property.
- `top`: { `string` | `number` } Adjust the `top` property.
- `right`: { `string` | `number` } Adjust the `right` property.
- `bottom`: { `string` | `number` } Adjust the `bottom` property.
- `left`: { `string` | `number` } Adjust the `left` property.
- `transformOrigin`: { `string` } Adjust the origin of any transform effects applied via the animation.
- `transformStyle`: { `string` } Applie the value to the `transfrom-style` property of the element.

#### EffectTiming
The EffectTiming object is passed directly to the WAAPI and should conform to the [AnimationEffectTiming](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEffectTiming).

#### Public methods
The public methods exposed by both classes are `play`, `pause`, `finish`, `cancel`, and `reverse`. For more information on what these methods do, see the corresponding method exposed by the [WAAPI Animation object](https://developer.mozilla.org/en-US/docs/Web/API/Animation).

#### Life cycle hooks
- `onFinish: { () => void }` If provided, `onFinish` will be called when the animation has completed.
- `onCancel: { () => void }` If provided, `onCancel` will be called when (and if) the animation is canceled.

## Classes: AnimateGroup and AnimateSequence
`AnimateGroup` and `AnimateSequence` are both classes that allow you to group and play animations together. Each takes an array of AnimateTo or AnimateFrom objects and provides an API to play, pause, finish, cancel, and reverse the collection of animations. `AnimateGroup` allows you to control all animations simultaneously while `AnimateSequence` allows you to control all animations in sequence.

```javascript
var myAnimationGroup = new AnimateGroup([
    new AnimateTo(element1),
    new AnimateTo(element2)
]);

var myAnimationSequence = new AnimateSequence([
    new AnimateTo(element3),
    new AnimateTo(element4)
]);

// AnimateGroup plays all animations at the same time
myAnimationGroup.play();

// AnimateSequence plays all animations one after another in array order
myAnimationSequence.play();
```
### Constructor(animations: (AnimateTo | AnimateFrom)[])
Both `AnimateGroup` and `AnimateSequence` accept an array of `AnimateTo` and `AnimateFrom` objects.

### Public methods
The public methods exposed by both classes are `play`, `pause`, `finish`, `cancel`, and `reverse`.

#### Life cycle hooks
`onFinish: { () => void }` If provided, `onFinish` will be called when the animation has completed.

## Running the localhost testing environment
- Run `npm run dev-server:react` to view the react examples (localhost:9005).
- Run `npm run build` to compile files to the build folder.
