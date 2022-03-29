# FormAssociated

An abstract class which can be used to provide a general implementation for components that should be form-associated, including checkboxes, radios, text inputs, and other components which store user input and should be captured during form submission.

For more information view the [specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/form-associated/form-associated-custom-element.spec.md).

## API

### `src/form-associated/form-associated.ts`:

#### Variables

| Name                       | Description | Type |
| -------------------------- | ----------- | ---- |
| `supportsElementInternals` |             |      |

<hr/>

#### Functions

| Name                      | Description                                                  | Parameters    | Return |
| ------------------------- | ------------------------------------------------------------ | ------------- | ------ |
| `FormAssociated`          | Base function for providing Custom Element Form Association. | `BaseCtor: T` | `T`    |
| `CheckableFormAssociated` |                                                              | `BaseCtor: T` | `T`    |

<hr/>

#### Exports

| Kind | Name                       | Declaration              | Module                                 | Package |
| ---- | -------------------------- | ------------------------ | -------------------------------------- | ------- |
| `js` | `supportsElementInternals` | supportsElementInternals | src/form-associated/form-associated.ts |         |
| `js` | `FormAssociated`           | FormAssociated           | src/form-associated/form-associated.ts |         |
| `js` | `CheckableFormAssociated`  | CheckableFormAssociated  | src/form-associated/form-associated.ts |         |


I