---
id: fast-animation
title: FAST Animation
sidebar_label: Fast Animation
---

# FAST Animation

Fast Animation is a library for simplifying the creation of animations and interactions using the Web Animation API.

![JavaScript](https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&logo=JavaScript) &nbsp; ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge) &nbsp; ![TypeScript](https://img.shields.io/badge/WAAPI-Supported-purple.svg?style=for-the-badge)

## Benefits

* Provides an abstraction layer over the [Web Animation API][WAAPI] while still allowing full access to its functionality.
* Simplifies complex animations on elements.
* Provides mechanisms for sequencing and grouping animation effects between elements.

## Usage

### Installation

```bash
npm i @microsoft/fast-animation
```

### Getting started

The primary tools for creating animations are the `AnimateTo` and `AnimateFrom` classes. These classes allow you to apply animations to HTML elements:

```javascript
var myHtmlElement = document.getElementById("myElement");
var myAnimation = new AnimateTo(myHtmlElement, { x: "30%", scale: 2 }, { duration: 300, delay: 20 });

// Play the animation.
myAnimation.play();
```

Sequencing and grouping classes are provided to help orchestrate more elaborate animations:

```javascript
var mySequence = new AnimateSequence([
    new AnimateTo(element1, { x: 20 }),
    new AnimateTo(element2, { x: 20 }),
    new AnimateTo(element3, { x: 20 })
]);

// Attach an onFinish callback.
mySequence.onFinish = () => {
    window.prompt("Did you like our animations?");
}

// Play all animations, one after another. When completed, ask the user if they liked the animation sequence.
mySequence.play();
```

### Package exports

#### AnimateTo | AnimateFrom

The`AnimateTo` and `AnimateFrom` classes can be used to create a variety of complex animations. These classes allow you to specify which properties should be animating as well as information like easing curves, duration, delay, and more.

##### Constructor

```js
constructor(el: HTMLElement, options?: Options, timing?: EffectTiming)
```

Both `AnimateTo` and `AnimateFrom` accept one required parameter and two optional parameters:

```javascript
var myAnimation = new AnimateTo(myHtmlElement, { x: 20 }, { duration: 250 });
```

##### Options

The following options are used to construct the animation and configure which properties the animation should change:

* `x: { number | string }` adjusts the element's horizontal position. This property adjusts the `transform` property.
* `y: { number | string }` adjusts the element's vertical position. This property adjusts the `transform` property.
* `scale: { number[] | number }` adjusts the scale of the element. If given a number, scale applies to both x and y-axes. If given an array of two numbers, x and y scale independently. This property adjusts the `transform` property.
* `rotate: { number }` adjusts the rotation of the object by a number of degrees. This property adjusts the `transform` property.
* `top: { string | number }` adjusts the `top` property.
* `right: { string | number }` adjusts the `right` property.
* `bottom: { string | number }` adjusts the `bottom` property.
* `left: { string | number }` adjusts the `left` property.
* `transformOrigin: { string }` adjusts the origin of any transform effects applied via the animation.
* `transformStyle: { string }` applies the value to the `transfrom-style` property of the element.

##### Effect timing

The `EffectTiming` object is passed directly to the WAAPI and should conform to the [AnimationEffectTiming][AET].

##### Public methods

The public methods exposed by the `AnimateTo` and ``AnimateFrom`` classes are `play`, `pause`, `finish`, `cancel`, and `reverse`. For more information on what these methods do, see the corresponding method exposed by the [WAAPI Animation object][WAAPI:AO].

###### Life cycle hooks

* If `onFinish: () => void` is provided, `onFinish` is called when the animation has completed.
* If `onCancel: () => void` is provided, `onCancel` is called when (and if) the animation is canceled.

#### AnimateGroup | AnimateSequence

The `AnimateGroup` and `AnimateSequence` classes are both classes that allow you to group and play animations together. Each takes an array of AnimateTo or AnimateFrom objects and provides an API to `play`, `pause`, `finish`, `cancel`, and `reverse` the collection of animations. `AnimateGroup` allows you to control all animations simultaneously while `AnimateSequence` allows you to control all animations in a sequence:

```javascript
var myAnimationGroup = new AnimateGroup([
    new AnimateTo(element1),
    new AnimateTo(element2)
]);

var myAnimationSequence = new AnimateSequence([
    new AnimateTo(element3),
    new AnimateTo(element4)
]);

// AnimateGroup plays all animations at the same time.
myAnimationGroup.play();

// AnimateSequence plays all animations one after another in array order.
myAnimationSequence.play();
```

##### Constructor

Both `AnimateGroup` and `AnimateSequence` accept an array of `AnimateTo` and `AnimateFrom` objects:

```js
constructor(AnimateTo[] | AnimateFrom[])
```

##### Public methods

The public methods exposed by the ``AnimateGroup`` and ``AnimateSequence`` classes are `play`, `pause`, `finish`, `cancel`, and `reverse`.

###### Life cycle hooks

If `onFinish: () => void` is provided, `onFinish` is called when the animation has completed.

### Testing

* Run `npm run dev-server:react` to view the React examples (localhost:9005).
* Run `npm run test` to run unit-tests.

## Dependencies

This system uses the emerging Web Animations API that is not supported in all browsers. To provide the broadest support, we recommend you include the web animations polyfill (use the 'next' version). 

The polyfill assumes several global variables exist, and in our experience, it has caused polymorphic JavaScript to fail to compile with tools like TypeScript and Babel. There are also other advantages to CDN files, so we've chosen to take the Web Animations API polyfill as a peer dependency.

Find the polyfill and documentation [here][PF:WAAPI].

## Additional resources

[MDN Web Animations API documentation][WAAPI]

[Can I Use: Web Animations API][CIU:WAAPI]

[WAAPI]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

[CIU:WAAPI]: https://caniuse.com/#feat=web-animation

[PF:WAAPI]: https://cdnjs.com/libraries/web-animations

[AET]: https://developer.mozilla.org/en-US/docs/Web/API/AnimationEffectTiming

[WAAPI:AO]: https://developer.mozilla.org/en-US/docs/Web/API/Animation