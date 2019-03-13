[@microsoft/fast-animation](../README.md) > ["animateTo/index"](../modules/_animateto_index_.md) > [default](../classes/_animateto_index_.default.md)

# Class: default

## Hierarchy

 [Animate](_animate_index_.animate.md)

**↳ default**

## Index

### Constructors

* [constructor](_animateto_index_.default.md#constructor)

### Properties

* [mode](_animateto_index_.default.md#mode)
* [onCancel](_animateto_index_.default.md#oncancel)
* [options](_animateto_index_.default.md#options)

### Accessors

* [keyframeEffect](_animateto_index_.default.md#keyframeeffect)
* [keyframes](_animateto_index_.default.md#keyframes)
* [onFinish](_animateto_index_.default.md#onfinish)

### Methods

* [addKeyframes](_animateto_index_.default.md#addkeyframes)
* [cancel](_animateto_index_.default.md#cancel)
* [finish](_animateto_index_.default.md#finish)
* [pause](_animateto_index_.default.md#pause)
* [play](_animateto_index_.default.md#play)
* [reverse](_animateto_index_.default.md#reverse)

### Object literals

* [effectTiming](_animateto_index_.default.md#effecttiming)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new default**(element: *`HTMLElement`*, options?: *[AnimateConfig](../interfaces/_animate_index_.animateconfig.md)*, effectTiming?: *`EffectTiming`*): [default](_animateto_index_.default.md)

*Inherited from [Animate](_animate_index_.animate.md).[constructor](_animate_index_.animate.md#constructor)*

*Defined in [animate/index.ts:162](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L162)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| element | `HTMLElement` |
| `Optional` options | [AnimateConfig](../interfaces/_animate_index_.animateconfig.md) |
| `Optional` effectTiming | `EffectTiming` |

**Returns:** [default](_animateto_index_.default.md)

___

## Properties

<a id="mode"></a>

### `<Protected>` mode

**● mode**: *[AnimationMode](../enums/_animate_index_.animationmode.md)* =  AnimationMode.animateTo

*Overrides [Animate](_animate_index_.animate.md).[mode](_animate_index_.animate.md#mode)*

*Defined in [animateTo/index.ts:4](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animateTo/index.ts#L4)*

___
<a id="oncancel"></a>

###  onCancel

**● onCancel**: *`function`*

*Inherited from [Animate](_animate_index_.animate.md).[onCancel](_animate_index_.animate.md#oncancel)*

*Defined in [animate/index.ts:125](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L125)*

Callback to call when the animation is canceled

#### Type declaration
▸(): `void`

**Returns:** `void`

___
<a id="options"></a>

###  options

**● options**: *[AnimateConfig](../interfaces/_animate_index_.animateconfig.md)*

*Inherited from [Animate](_animate_index_.animate.md).[options](_animate_index_.animate.md#options)*

*Defined in [animate/index.ts:111](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L111)*

Stores animation options

___

## Accessors

<a id="keyframeeffect"></a>

###  keyframeEffect

**get keyframeEffect**(): `KeyframeEffect`

*Inherited from [Animate](_animate_index_.animate.md).[keyframeEffect](_animate_index_.animate.md#keyframeeffect)*

*Defined in [animate/index.ts:504](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L504)*

Returns the key frame effect object

**Returns:** `KeyframeEffect`

___
<a id="keyframes"></a>

###  keyframes

**get keyframes**(): `Keyframe`[]

*Inherited from [Animate](_animate_index_.animate.md).[keyframes](_animate_index_.animate.md#keyframes)*

*Defined in [animate/index.ts:493](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L493)*

Returns the animation's keyframes

**Returns:** `Keyframe`[]

___
<a id="onfinish"></a>

###  onFinish

**get onFinish**(): `function`

**set onFinish**(callback: *`function`*): `void`

*Inherited from [Animate](_animate_index_.animate.md).[onFinish](_animate_index_.animate.md#onfinish)*

*Defined in [animate/index.ts:152](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L152)*

**Returns:** `function`

*Inherited from [Animate](_animate_index_.animate.md).[onFinish](_animate_index_.animate.md#onfinish)*

*Defined in [animate/index.ts:156](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L156)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___

## Methods

<a id="addkeyframes"></a>

###  addKeyframes

▸ **addKeyframes**(keyframes: *`Array`<`Partial`<`Keyframe`>>*): `void`

*Inherited from [Animate](_animate_index_.animate.md).[addKeyframes](_animate_index_.animate.md#addkeyframes)*

*Defined in [animate/index.ts:231](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L231)*

adds a set of keyframes to set of animation keyframes the animation should execute

**Parameters:**

| Name | Type |
| ------ | ------ |
| keyframes | `Array`<`Partial`<`Keyframe`>> |

**Returns:** `void`

___
<a id="cancel"></a>

###  cancel

▸ **cancel**(): `void`

*Inherited from [Animate](_animate_index_.animate.md).[cancel](_animate_index_.animate.md#cancel)*

*Defined in [animate/index.ts:215](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L215)*

cancels the animation

**Returns:** `void`

___
<a id="finish"></a>

###  finish

▸ **finish**(): `void`

*Inherited from [Animate](_animate_index_.animate.md).[finish](_animate_index_.animate.md#finish)*

*Defined in [animate/index.ts:207](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L207)*

finishes the animation

**Returns:** `void`

___
<a id="pause"></a>

###  pause

▸ **pause**(): `void`

*Inherited from [Animate](_animate_index_.animate.md).[pause](_animate_index_.animate.md#pause)*

*Defined in [animate/index.ts:199](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L199)*

pauses the animation

**Returns:** `void`

___
<a id="play"></a>

###  play

▸ **play**(): `void`

*Inherited from [Animate](_animate_index_.animate.md).[play](_animate_index_.animate.md#play)*

*Defined in [animate/index.ts:191](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L191)*

plays the animation

**Returns:** `void`

___
<a id="reverse"></a>

###  reverse

▸ **reverse**(): `void`

*Inherited from [Animate](_animate_index_.animate.md).[reverse](_animate_index_.animate.md#reverse)*

*Defined in [animate/index.ts:223](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L223)*

reverses an animation

**Returns:** `void`

___

## Object literals

<a id="effecttiming"></a>

###  effectTiming

**effectTiming**: *`object`*

*Inherited from [Animate](_animate_index_.animate.md).[effectTiming](_animate_index_.animate.md#effecttiming)*

*Defined in [animate/index.ts:116](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L116)*

Stores animation timing functions

<a id="effecttiming.duration"></a>

####  duration

**● duration**: *`number`* = 500

*Defined in [animate/index.ts:119](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L119)*

___
<a id="effecttiming.fill"></a>

####  fill

**● fill**: *"forwards"* = "forwards"

*Defined in [animate/index.ts:117](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L117)*

___
<a id="effecttiming.iterations"></a>

####  iterations

**● iterations**: *`number`* = 1

*Defined in [animate/index.ts:118](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L118)*

___

___

