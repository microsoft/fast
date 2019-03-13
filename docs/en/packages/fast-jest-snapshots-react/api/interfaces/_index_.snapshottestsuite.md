[@microsoft/fast-jest-snapshots-react](../README.md) > ["index"](../modules/_index_.md) > [SnapshotTestSuite](../interfaces/_index_.snapshottestsuite.md)

# Interface: SnapshotTestSuite

An interface describing component example objects used for snapshots and component testing.

## Type parameters
#### T 
## Hierarchy

**SnapshotTestSuite**

## Index

### Properties

* [component](_index_.snapshottestsuite.md#component)
* [data](_index_.snapshottestsuite.md#data)
* [detailData](_index_.snapshottestsuite.md#detaildata)
* [documentation](_index_.snapshottestsuite.md#documentation)
* [name](_index_.snapshottestsuite.md#name)
* [schema](_index_.snapshottestsuite.md#schema)

---

## Properties

<a id="component"></a>

###  component

**● component**: *`React.ComponentType`<`T`>*

*Defined in [index.ts:28](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L28)*

The component constructor

___
<a id="data"></a>

###  data

**● data**: *[SnapshotTestCases](../modules/_index_.md#snapshottestcases)<`T`>*

*Defined in [index.ts:33](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L33)*

An array of prop instances for the component

___
<a id="detaildata"></a>

### `<Optional>` detailData

**● detailData**: *`T`*

*Defined in [index.ts:45](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L45)*

The detail view component data

*__deprecated__*: *   this property is not required for snapshot testing and will be removed

___
<a id="documentation"></a>

### `<Optional>` documentation

**● documentation**: *`Element`*

*Defined in [index.ts:51](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L51)*

Documentation for the component

*__deprecated__*: *   this property is not required for snapshot testing and will be removed

___
<a id="name"></a>

###  name

**● name**: *`string`*

*Defined in [index.ts:23](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L23)*

The name of the component

___
<a id="schema"></a>

### `<Optional>` schema

**● schema**: *`any`*

*Defined in [index.ts:39](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L39)*

The JSON schema for the components data

*__deprecated__*: *   this property is not required for snapshot testing and will be removed

___

