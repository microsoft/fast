[@microsoft/fast-animation](../README.md) > ["animate/index"](../modules/_animate_index_.md) > [Animate](../classes/_animate_index_.animate.md)

# Class: Animate

## Hierarchy

**Animate**

↳  [default](_animateto_index_.default.md)

↳  [default](_animatefrom_index_.default.md)

## Index

### Constructors

* [constructor](_animate_index_.animate.md#constructor)

### Properties

* [_keyframes](_animate_index_.animate.md#_keyframes)
* [_onFinish](_animate_index_.animate.md#_onfinish)
* [animation](_animate_index_.animate.md#animation)
* [animationTarget](_animate_index_.animate.md#animationtarget)
* [mode](_animate_index_.animate.md#mode)
* [onCancel](_animate_index_.animate.md#oncancel)
* [options](_animate_index_.animate.md#options)

### Accessors

* [keyframeEffect](_animate_index_.animate.md#keyframeeffect)
* [keyframes](_animate_index_.animate.md#keyframes)
* [onFinish](_animate_index_.animate.md#onfinish)

### Methods

* [addKeyframes](_animate_index_.animate.md#addkeyframes)
* [cancel](_animate_index_.animate.md#cancel)
* [consolidateKeyframes](_animate_index_.animate.md#consolidatekeyframes)
* [createAnimationObject](_animate_index_.animate.md#createanimationobject)
* [ensureAnimationObjectExists](_animate_index_.animate.md#ensureanimationobjectexists)
* [finish](_animate_index_.animate.md#finish)
* [formatTransformFunction](_animate_index_.animate.md#formattransformfunction)
* [getInitialKeyframeValues](_animate_index_.animate.md#getinitialkeyframevalues)
* [getOptionKeyframeValues](_animate_index_.animate.md#getoptionkeyframevalues)
* [getOptionKeyframes](_animate_index_.animate.md#getoptionkeyframes)
* [getPropertiesToAnimate](_animate_index_.animate.md#getpropertiestoanimate)
* [normalizeInitialValue](_animate_index_.animate.md#normalizeinitialvalue)
* [pause](_animate_index_.animate.md#pause)
* [pixelify](_animate_index_.animate.md#pixelify)
* [play](_animate_index_.animate.md#play)
* [reverse](_animate_index_.animate.md#reverse)
* [sortOffsets](_animate_index_.animate.md#sortoffsets)

### Object literals

* [effectTiming](_animate_index_.animate.md#effecttiming)
* [propertyMap](_animate_index_.animate.md#propertymap)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Animate**(element: *`HTMLElement`*, options?: *[AnimateConfig](../interfaces/_animate_index_.animateconfig.md)*, effectTiming?: *`EffectTiming`*): [Animate](_animate_index_.animate.md)

*Defined in [animate/index.ts:162](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L162)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| element | `HTMLElement` |
| `Optional` options | [AnimateConfig](../interfaces/_animate_index_.animateconfig.md) |
| `Optional` effectTiming | `EffectTiming` |

**Returns:** [Animate](_animate_index_.animate.md)

___

## Properties

<a id="_keyframes"></a>

### `<Private>` _keyframes

**● _keyframes**: *`Keyframe`[][]* =  []

*Defined in [animate/index.ts:150](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L150)*

Stores animation keyframe sets and is accessed by a getter

___
<a id="_onfinish"></a>

### `<Private>` _onFinish

**● _onFinish**: *`function`*

*Defined in [animate/index.ts:145](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L145)*

Callback to call when the animation finishes playing

#### Type declaration
▸(): `void`

**Returns:** `void`

___
<a id="animation"></a>

### `<Private>` animation

**● animation**: *`Animation`*

*Defined in [animate/index.ts:140](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L140)*

Stores the WAAPI object for manipulation by our API

___
<a id="animationtarget"></a>

### `<Private>` animationTarget

**● animationTarget**: *`HTMLElement`*

*Defined in [animate/index.ts:135](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L135)*

Stores the HTML element to be animated

___
<a id="mode"></a>

### `<Protected>` mode

**● mode**: *[AnimationMode](../enums/_animate_index_.animationmode.md)*

*Defined in [animate/index.ts:130](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L130)*

Tracks if the animation should animate toward an elements natural position or away from it

___
<a id="oncancel"></a>

###  onCancel

**● onCancel**: *`function`*

*Defined in [animate/index.ts:125](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L125)*

Callback to call when the animation is canceled

#### Type declaration
▸(): `void`

**Returns:** `void`

___
<a id="options"></a>

###  options

**● options**: *[AnimateConfig](../interfaces/_animate_index_.animateconfig.md)*

*Defined in [animate/index.ts:111](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L111)*

Stores animation options

___

## Accessors

<a id="keyframeeffect"></a>

###  keyframeEffect

**get keyframeEffect**(): `KeyframeEffect`

*Defined in [animate/index.ts:504](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L504)*

Returns the key frame effect object

**Returns:** `KeyframeEffect`

___
<a id="keyframes"></a>

###  keyframes

**get keyframes**(): `Keyframe`[]

*Defined in [animate/index.ts:493](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L493)*

Returns the animation's keyframes

**Returns:** `Keyframe`[]

___
<a id="onfinish"></a>

###  onFinish

**get onFinish**(): `function`

**set onFinish**(callback: *`function`*): `void`

*Defined in [animate/index.ts:152](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L152)*

**Returns:** `function`

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

*Defined in [animate/index.ts:215](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L215)*

cancels the animation

**Returns:** `void`

___
<a id="consolidatekeyframes"></a>

### `<Private>` consolidateKeyframes

▸ **consolidateKeyframes**(keyframeSets: *`Keyframe`[][]*): `Keyframe`[]

*Defined in [animate/index.ts:463](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L463)*

Consolidates all keyframe arrays into a single keyframe array

**Parameters:**

| Name | Type |
| ------ | ------ |
| keyframeSets | `Keyframe`[][] |

**Returns:** `Keyframe`[]

___
<a id="createanimationobject"></a>

### `<Private>` createAnimationObject

▸ **createAnimationObject**(): `void`

*Defined in [animate/index.ts:246](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L246)*

Creates the animation object

**Returns:** `void`

___
<a id="ensureanimationobjectexists"></a>

### `<Private>` ensureAnimationObjectExists

▸ **ensureAnimationObjectExists**(): `void`

*Defined in [animate/index.ts:238](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L238)*

Ensure animation object

**Returns:** `void`

___
<a id="finish"></a>

###  finish

▸ **finish**(): `void`

*Defined in [animate/index.ts:207](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L207)*

finishes the animation

**Returns:** `void`

___
<a id="formattransformfunction"></a>

### `<Private>` formatTransformFunction

▸ **formatTransformFunction**(functionType: *`string`*, value: *`string` \| `number` \| `number`[]*): `string`

*Defined in [animate/index.ts:349](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L349)*

Formats a config option into a transform function

**Parameters:**

| Name | Type |
| ------ | ------ |
| functionType | `string` |
| value | `string` \| `number` \| `number`[] |

**Returns:** `string`

___
<a id="getinitialkeyframevalues"></a>

### `<Private>` getInitialKeyframeValues

▸ **getInitialKeyframeValues**(): `Keyframe`

*Defined in [animate/index.ts:322](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L322)*

Returns the initial values for all properties being animated

**Returns:** `Keyframe`

___
<a id="getoptionkeyframevalues"></a>

### `<Private>` getOptionKeyframeValues

▸ **getOptionKeyframeValues**(): `Keyframe`

*Defined in [animate/index.ts:392](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L392)*

Returns keyframe values based on option configuration

**Returns:** `Keyframe`

___
<a id="getoptionkeyframes"></a>

### `<Private>` getOptionKeyframes

▸ **getOptionKeyframes**(): `Keyframe`[]

*Defined in [animate/index.ts:431](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L431)*

Gets all keyframes configured by options

**Returns:** `Keyframe`[]

___
<a id="getpropertiestoanimate"></a>

### `<Private>` getPropertiesToAnimate

▸ **getPropertiesToAnimate**(): `string`[]

*Defined in [animate/index.ts:261](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L261)*

Returns a list of properties that will be animated based options

**Returns:** `string`[]

___
<a id="normalizeinitialvalue"></a>

### `<Private>` normalizeInitialValue

▸ **normalizeInitialValue**(property: *`string`*, value: *`string`*): `string`

*Defined in [animate/index.ts:280](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L280)*

Current implmentations of web animations seem to have trouble animating both scale and opacity from a starting value of 0. This method detects when those values are 0 and alters them slightly to known-working starting values

**Parameters:**

| Name | Type |
| ------ | ------ |
| property | `string` |
| value | `string` |

**Returns:** `string`

___
<a id="pause"></a>

###  pause

▸ **pause**(): `void`

*Defined in [animate/index.ts:199](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L199)*

pauses the animation

**Returns:** `void`

___
<a id="pixelify"></a>

### `<Private>` pixelify

▸ **pixelify**(num: *`number`*): `string`

*Defined in [animate/index.ts:385](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L385)*

Converts a number to a pixel string

**Parameters:**

| Name | Type |
| ------ | ------ |
| num | `number` |

**Returns:** `string`

___
<a id="play"></a>

###  play

▸ **play**(): `void`

*Defined in [animate/index.ts:191](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L191)*

plays the animation

**Returns:** `void`

___
<a id="reverse"></a>

###  reverse

▸ **reverse**(): `void`

*Defined in [animate/index.ts:223](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L223)*

reverses an animation

**Returns:** `void`

___
<a id="sortoffsets"></a>

### `<Private>` sortOffsets

▸ **sortOffsets**(offsets: *`string`[]*): `string`[]

*Defined in [animate/index.ts:443](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L443)*

Sorts an array of offset keys in ascending order

**Parameters:**

| Name | Type |
| ------ | ------ |
| offsets | `string`[] |

**Returns:** `string`[]

___

## Object literals

<a id="effecttiming"></a>

###  effectTiming

**effectTiming**: *`object`*

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
<a id="propertymap"></a>

### `<Static>``<Private>` propertyMap

**propertyMap**: *`object`*

*Defined in [animate/index.ts:99](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L99)*

A mapping between animation options and the css property names they apply to

<a id="propertymap.bottom"></a>

####  bottom

**● bottom**: *`string`[]* =  ["bottom"]

*Defined in [animate/index.ts:104](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L104)*

___
<a id="propertymap.left"></a>

####  left

**● left**: *`string`[]* =  ["left"]

*Defined in [animate/index.ts:103](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L103)*

___
<a id="propertymap.opacity"></a>

####  opacity

**● opacity**: *`string`[]* =  ["opacity"]

*Defined in [animate/index.ts:100](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L100)*

___
<a id="propertymap.right"></a>

####  right

**● right**: *`string`[]* =  ["right"]

*Defined in [animate/index.ts:105](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L105)*

___
<a id="propertymap.top"></a>

####  top

**● top**: *`string`[]* =  ["top"]

*Defined in [animate/index.ts:102](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L102)*

___
<a id="propertymap.transform"></a>

####  transform

**● transform**: *`string`[]* =  ["x", "y", "rotate", "scale"]

*Defined in [animate/index.ts:101](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-animation/lib/animate/index.ts#L101)*

___

___

