[@microsoft/fast-layouts-react](../README.md) > ["utilities/breakpoint-tracker"](../modules/_utilities_breakpoint_tracker_.md) > [BreakpointTracker](../classes/_utilities_breakpoint_tracker_.breakpointtracker.md)

# Class: BreakpointTracker

## Hierarchy

**BreakpointTracker**

## Index

### Constructors

* [constructor](_utilities_breakpoint_tracker_.breakpointtracker.md#constructor)

### Properties

* [breakpoint](_utilities_breakpoint_tracker_.breakpointtracker.md#breakpoint)
* [breakpointConfig](_utilities_breakpoint_tracker_.breakpointtracker.md#breakpointconfig)
* [openRequestAnimationFrame](_utilities_breakpoint_tracker_.breakpointtracker.md#openrequestanimationframe)
* [subscriptions](_utilities_breakpoint_tracker_.breakpointtracker.md#subscriptions)

### Methods

* [notifySubscribers](_utilities_breakpoint_tracker_.breakpointtracker.md#notifysubscribers)
* [requestFrame](_utilities_breakpoint_tracker_.breakpointtracker.md#requestframe)
* [subscribe](_utilities_breakpoint_tracker_.breakpointtracker.md#subscribe)
* [unsubscribe](_utilities_breakpoint_tracker_.breakpointtracker.md#unsubscribe)
* [update](_utilities_breakpoint_tracker_.breakpointtracker.md#update)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BreakpointTracker**(): [BreakpointTracker](_utilities_breakpoint_tracker_.breakpointtracker.md)

*Defined in [utilities/breakpoint-tracker.ts:31](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L31)*

Constructor for the BreakpointTracker component.

**Returns:** [BreakpointTracker](_utilities_breakpoint_tracker_.breakpointtracker.md)

___

## Properties

<a id="breakpoint"></a>

### `<Private>` breakpoint

**● breakpoint**: *`number`*

*Defined in [utilities/breakpoint-tracker.ts:16](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L16)*

The current breakpoint.

___
<a id="breakpointconfig"></a>

### `<Private>` breakpointConfig

**● breakpointConfig**: *[Breakpoints](../modules/_utilities_breakpoints_.md#breakpoints)* =  defaultBreakpoints

*Defined in [utilities/breakpoint-tracker.ts:21](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L21)*

The current breakpoint.

___
<a id="openrequestanimationframe"></a>

### `<Private>` openRequestAnimationFrame

**● openRequestAnimationFrame**: *`boolean`*

*Defined in [utilities/breakpoint-tracker.ts:26](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L26)*

Track if we have an open animation frame request

___
<a id="subscriptions"></a>

### `<Private>` subscriptions

**● subscriptions**: *[BreakpointTrackerCallback](../modules/_utilities_breakpoint_tracker_.md#breakpointtrackercallback)[]*

*Defined in [utilities/breakpoint-tracker.ts:31](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L31)*

___

## Methods

<a id="notifysubscribers"></a>

###  notifySubscribers

▸ **notifySubscribers**(breakpoint: *[Breakpoint](../modules/_utilities_breakpoints_.md#breakpoint)*): `void`

*Defined in [utilities/breakpoint-tracker.ts:93](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L93)*

Call all subscribed callbacks

**Parameters:**

| Name | Type |
| ------ | ------ |
| breakpoint | [Breakpoint](../modules/_utilities_breakpoints_.md#breakpoint) |

**Returns:** `void`

___
<a id="requestframe"></a>

### `<Private>` requestFrame

▸ **requestFrame**(): `void`

*Defined in [utilities/breakpoint-tracker.ts:102](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L102)*

Request's an animation frame if there are currently no open animation frame requests

**Returns:** `void`

___
<a id="subscribe"></a>

###  subscribe

▸ **subscribe**(callback: *[BreakpointTrackerCallback](../modules/_utilities_breakpoint_tracker_.md#breakpointtrackercallback)*, breakpointConfig?: *[Breakpoints](../modules/_utilities_breakpoints_.md#breakpoints)*): `void`

*Defined in [utilities/breakpoint-tracker.ts:50](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L50)*

Subscribes a callback to be called when breakpoints change

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | [BreakpointTrackerCallback](../modules/_utilities_breakpoint_tracker_.md#breakpointtrackercallback) |
| `Optional` breakpointConfig | [Breakpoints](../modules/_utilities_breakpoints_.md#breakpoints) |

**Returns:** `void`

___
<a id="unsubscribe"></a>

###  unsubscribe

▸ **unsubscribe**(callback: *[BreakpointTrackerCallback](../modules/_utilities_breakpoint_tracker_.md#breakpointtrackercallback)*): `void`

*Defined in [utilities/breakpoint-tracker.ts:66](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L66)*

Unsubscribes a callback from the breakpoint tracker

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | [BreakpointTrackerCallback](../modules/_utilities_breakpoint_tracker_.md#breakpointtrackercallback) |

**Returns:** `void`

___
<a id="update"></a>

###  update

▸ **update**(): `void`

*Defined in [utilities/breakpoint-tracker.ts:75](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-layouts-react/src/utilities/breakpoint-tracker.ts#L75)*

Notifies subscribes if a breakpoint threshold has been crossed

**Returns:** `void`

___

