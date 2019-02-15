# Pivot
Use *pivot* when there is a paged interface where one controlling pivot element corresponds to one pivot panel.

## Usage
The *pivot* component can be passed a collection of *tabitems* via the `items` prop. The `items` prop expects an array of the interface `Item`. `Item` consists of `tab`, `content` and `id`. `tab` and `content` will render a ReactNode and `id` is a string that represents its unique identifier.

## Accessibility
The *pivot* component is based off the [WAI-ARIA spec](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel). It utilizes activation on left/right keyboard buttons for navigation through the tab list and the home and end keyboard buttons to navigate to the beginning and end tabs respectively.
