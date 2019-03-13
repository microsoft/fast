[@microsoft/fast-jest-snapshots-react](../README.md) > ["index"](../modules/_index_.md)

# External module: "index"

## Index

### Interfaces

* [SnapshotTestSuite](../interfaces/_index_.snapshottestsuite.md)

### Type aliases

* [SnapshotTestCase](_index_.md#snapshottestcase)
* [SnapshotTestCases](_index_.md#snapshottestcases)

### Functions

* [generateSnapshots](_index_.md#generatesnapshots)
* [renderSnapshot](_index_.md#rendersnapshot)

---

## Type aliases

<a id="snapshottestcase"></a>

###  SnapshotTestCase

**Ƭ SnapshotTestCase**: *`T` \| [`string`, `T`]*

*Defined in [index.ts:14](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L14)*

An prop object to supply for snapshots. Optionally, a an array can be provided where the first index is a string representing a snapshot description, with the second index being the prop data

___
<a id="snapshottestcases"></a>

###  SnapshotTestCases

**Ƭ SnapshotTestCases**: *`Array`<[SnapshotTestCase](_index_.md#snapshottestcase)<`T`>>*

*Defined in [index.ts:7](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L7)*

A set of snapshot test cases

___

## Functions

<a id="generatesnapshots"></a>

###  generateSnapshots

▸ **generateSnapshots**<`T`>(examples: *[SnapshotTestSuite](../interfaces/_index_.snapshottestsuite.md)<`T`>*): `void`

*Defined in [index.ts:78](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L78)*

Generate a set of snapshot tests given a snapshot suite

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| examples | [SnapshotTestSuite](../interfaces/_index_.snapshottestsuite.md)<`T`> |

**Returns:** `void`

___
<a id="rendersnapshot"></a>

###  renderSnapshot

▸ **renderSnapshot**<`T`>(data: *`T`*, component: *`React.ComponentType`<`T`>*, title: *`string`*): `void`

*Defined in [index.ts:57](https://github.com/Microsoft/fast-dna/blob/164dd3ca/packages/fast-jest-snapshots-react/src/index.ts#L57)*

Executes a single snapshot test given a component, component data, and a test title

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `T` |
| component | `React.ComponentType`<`T`> |
| title | `string` |

**Returns:** `void`

___

