# FAST Figma Plugin MSFT
A Figma Plugin for designing MSFT components and experiences.


## Building
To build the plugin, run `yarn build`. Then follow [Figma's documentation](https://help.figma.com/article/331-making-plugins) for importing the plugin into Figma.

You can also use `yarn watch` to watch files and rebuild the plugin when files are changed.

## Usage
This plugin enables using certain parts of FAST's adaptive UI system in Figma. Currently, it supports assigning color recipes to the following:
- background fills
- stroke fills
- text fills

With the plugin open, selecting a node in Figma will cause the available options for that node type to be reflected in the UI. Assigning a recipe to the node will apply change the color of the node and also store the assigned recipe on the node.

Assigning a recipe to a node opts the node into the adaptive system, and assigning a background fill recipe higher in the Figma node tree will inform what the output color the downstream recipe is. Changing upstream nodes will cause all nodes downstream that have been assigned a recipe type to be re-evaluated, allowing you to keep an entire tree of nodes in sync with their background fill.
